/// <reference path="jquery-1.11.0-vsdoc.js" />
/*--------------------------------------------------
* jQuery pagination plugin v1.1
* 作者: 徐俊洲
* QQ: 765550360
* 日期: 2016-09
* 说明: 该插件任何人可以应用于任何项目, 完全免费开放自由.
---------------------------------------------------*/

; (function ($, window, document) {
    var XjzPagination = function ($element, _option) {
        var me = this;

        //配置项校验
        var errorStr = '[xjzPagination.js]: ';
        if (_option.totalPages !== undefined && _option.totalPages !== null) {
            if (isNaN(_option.totalPages) || (_option.totalPages == 0)) {
                $.error(errorStr + '静态分页配置项totalPages, 必须为数字且不能为0');
            }
        }
        if (_option.visiblePages !== undefined && (isNaN(_option.visiblePages) || _option.visiblePages < 1)) {
            $.error(errorStr + '可视页面数visiblePages, 必须为数字且要大于0');
        }
        if (_option.startPage !== undefined && (isNaN(_option.startPage) || _option.startPage < 1)) {
            $.error(errorStr + '起始页面startPage, 必须为数字且要大于0');
        }
        if (typeof _option.onPageClick != 'function') {
            $.error(errorStr + '请添加页面点击回调函数, onPageClick');
        }

        me.options = $.extend({}, XjzPagination.default, _option);
        me.$element = $element; //保存分页$实例
        //初始化总页面, 当前页面
        me.totalPages = 0;
        me.currentPage = -1;

        //绑定事件
        me.bindEvent();

        //静态分页配置
        if (me.options.totalPages) {
            me.currentPage = me.options.startPage;
            me.totalPages = me.options.totalPages;
        }

        //初始化分页控件
        me.createPages();

        //在起始页面上触发click事件
        if (me.options.initiateStartPageClick) {
            me.currentPage = me.options.startPage;
            me.options.onPageClick.call(me.$element, me.options.startPage);
        }
    };

    XjzPagination.default = {
        totalPages: null,
        visiblePages: 7,
        startPage: 1,
        initiateStartPageClick: true,
        pagingType: 'simple_numbers',   //分页类型
        ellipsis: true,     //是否显示省略页面...
        onPageClick: $.noop,
        first: '首页',
        prev: '上一页',
        next: '下一页',
        last: '尾页',
        more: '...',        //省略页面文本
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first',
        pageClass: 'page',
        moreClass: 'more',  //省略页面css类
        activeClass: 'active',
        disabledClass: 'disabled'
    };

    XjzPagination.prototype = {
        test: function () {
            alert('test');
        },
        //创建页面
        createPages: function () {
            var me = this,
                $lis = $("<div></div>"),
                FPNL = ['first', 'prev', 'next', 'last'],
                options = me.options;

            //获取页面按钮数组, 并创建dom元素
            var pageArray = this.getPages();
            $.each(FPNL, function (i, d) {
                if (i == 2) {
                    $.each(pageArray, function (I, D) {
                        $lis.append(me.createDom(D, me.currentPage));
                    });
                }
                $lis.append(me.createDom(d));
            });

            //翻页按钮的禁用状态
            if (me.currentPage < 2) {
                $lis.find("."+options.firstClass+",."+options.prevClass).addClass(options.disabledClass);
            }
            if (me.currentPage >= me.totalPages) {
                $lis.find("." + options.nextClass + ",." + options.lastClass).addClass(options.disabledClass);
            }
            me.$element.empty().append($lis.children());
            //控制分页类型
            this.pagingType();
        },
        //获取页面按钮数组
        getPages: function () {
            var me = this,
                visiblePages = Math.min(me.options.visiblePages, me.totalPages),    //如果总页面数小于可视页面数, 则可视页面为总页面数
                totalPages = me.totalPages,
                currentPage = me.currentPage,
                flankPages = Math.floor(visiblePages / 2),  //下舍
                start = 0,  //要显示的第一个页面
                end = 0,    //要显示的最后一个页面
                pages = [];

            if (totalPages == 0) return pages;  //如果总页面为0, 返回空数组

            //左右不饱和状态:
            //在可视分页为偶数的情况下, 左边比右边页面数少1  ((currentPage - flankPages) + 1)
            //在可视页面为奇数的情况下, 减去(visiblePages % 2), 用来保持左右对称
            start = ((currentPage - flankPages) + 1) - (visiblePages % 2);
            end = currentPage + flankPages;

            //右边不饱和状态:
            if (start <= 0) {
                start = 1;
                end = visiblePages;
            }
            //左边不饱和状态:
            if (end > totalPages) {
                start = totalPages - visiblePages + 1;
                end = totalPages;
            }

            for (var i = start; i <= end; i++) {
                pages.push(i);
            }

            //省略页面[...]控制
            if (me.options.ellipsis) {
                //要显示省略页面, 则可视页面必须>=7个 且 总页面数大于可视页面数
                if ((visiblePages >= 7) && (totalPages > visiblePages)) {
                    if (pages[0] == 1) {
                        pages[pages.length - 1] = totalPages;
                        pages[pages.length - 2] = 'more';
                    } else if (pages[pages.length - 1] == totalPages) {
                        pages[0] = 1;
                        pages[1] = 'more';
                    } else {
                        pages[0] = 1;
                        pages[1] = 'more';
                        pages[pages.length - 1] = totalPages;
                        pages[pages.length - 2] = 'more';
                    }
                }
            }
            //console.log(pages);
            return pages;
        },
        //创建页面Dom
        createDom: function (page, currentPage) {
            var options = this.options;
            var $li = $('<li></li>'),
                $a = $('<a href="javacript:;"></a>');

            //页面类型
            if (isNaN(page)) {
                //['first','prev','next','last','more']
                $li.addClass(options[page + 'Class']);
                $a.text(options[page]);
            } else {
                //[1,2,3,4...]
                if (page == currentPage) {
                    //激活当前页
                    $li.addClass(options.activeClass);
                }
                $li.addClass(options.pageClass);
                $a.text(page);
            }
            return $li.append($a);
        },
        //分页类型
        pagingType: function () {
            var options = this.options,
                type = options.pagingType,
                $ul = this.$element;

            switch (type) {
                //显示所有按钮
                case 'full_numbers': { break; }
                    //上一页[1...]下一页
                case 'simple_numbers': { $ul.find("."+options.firstClass+",."+options.lastClass).remove(); break; }
                    //首页 上一页 下一页 尾页
                case 'full': { $ul.find("."+options.pageClass+",."+options.moreClass).remove(); break; }
                    //上一页 下一页
                case 'simple': { $ul.find("."+options.firstClass+",."+options.lastClass+",."+options.pageClass+",."+options.moreClass).remove(); break; }
                    //[1...]
                case 'numbers': { $ul.find("."+options.firstClass+",."+options.lastClass+",."+options.prevClass+",."+options.nextClass).remove(); break; }
            }
        },
        //更新页面
        update: function (_totalPages, _currentPage) {
            var me = this;
            //在不是静态分页的情况下, 总页数发生变化或总页数等于0, 才进行重新分页
            if ((me.totalPages != _totalPages || _totalPages == 0 || _currentPage != undefined) && me.options.totalPages === null) {
                me.totalPages = _totalPages;
                //当initiateStartPageClick=false, 且需要手动加载数据时, 需要给该方法传递当前页数
                if (_currentPage) {
                    me.currentPage = _currentPage;
                }

                //总页数小于当前页
                if (me.totalPages < me.currentPage) {
                    if (me.totalPages == 0) {
                        //总页数=0, 设置当前页为初始状态-1, 在分页时保留[下一页, 尾页]的可用状态, 用于加载数据
                        me.currentPage = -1;
                    } else {
                        //总页数不等0, 设置当前页为总页数+1, 在分页时禁用[下一页, 尾页], 此时点击上一页可激活最后一页
                        me.currentPage = me.totalPages + 1;
                    }
                }

                this.createPages();
            }
        },
        //绑定事件
        bindEvent: function () {
            var me = this, options = me.options;
            me.$element.on('click', 'li', function (event) {
                var $li = $(this),
                    _currentPage = $li.text();

                //禁用按钮, 和当前页面 不触发
                if ($li.hasClass(options.disabledClass) || me.currentPage == _currentPage) {
                    return false;
                }

                switch (true) {
                    case $li.hasClass(options.firstClass): {
                        //首页 设置当前页为1
                        _currentPage = 1;
                        break;
                    }
                    case $li.hasClass(options.prevClass): {
                        //上一页 设置当前页-1
                        _currentPage = me.currentPage - 1;
                        //_currentPage = me.currentPage >= 1 ? me.currentPage - 1 : 1;
                        break;
                    }
                    case $li.hasClass(options.pageClass): {
                        _currentPage = $li.text();
                        break;
                    }
                    case $li.hasClass(options.nextClass): {
                        //下一页 如果当前页<1, 设置当前页为1. 否则当前页+1
                        _currentPage = me.currentPage < 1 ? 1 : me.currentPage + 1;
                        break;
                    }
                    case $li.hasClass(options.lastClass): {
                        //尾页    如果总页数为0, 设置当前页为1
                        _currentPage = me.totalPages == 0 ? 1 : me.totalPages;
                        break;
                    }
                    case $li.hasClass(options.moreClass): {
                        //则设置当前页面为[...]应该所在页面
                        if ($li.next().text() == me.totalPages) {
                            //[...]在右侧
                            _currentPage = Number($li.prev().text()) + 1;
                        } else {
                            //[...]在左侧
                            _currentPage = Number($li.next().text()) - 1;
                        }
                        break;
                    }
                }

                me.currentPage = +_currentPage;
                me.createPages();

                //触发页单击回调函数
                me.options.onPageClick.call(me.$element, +_currentPage);
                return false;
            });
        }
    };

    $.fn.extend({
        xjzPagination: function (_option) {
            if (this.data("xjzPagination")) return this;
            //初始化分页控件, 保存该对象的实例到$Dom元素并返回
            var obj = new XjzPagination(this, _option);
            this.data("xjzPagination", obj);
            return obj;
        }
    });
})(window.jQuery, window, document);