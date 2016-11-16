/*!
 * jQuery-xjzPagination v0.2.0
 * 作者: 徐俊洲
 * QQ: 765550360
 * 软件许可协议: MIT license
 * 日期: 2016-11-16
 */
; (function ($, window, document) {
    var xjzPagination = function ($element, _option) {
        var me = this;

        me.options = $.extend(true, {}, xjzPagination.Default, _option);
        me.$element = $element; //保存分页$实例

        //初始化总页面, 当前页面
        me.totalPages = 0;
        me.currentPage = me.options.startPage;

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

            setTimeout(function () {
                me.options.onPageClick.call(me.$element, me.options.startPage);
            }, 100);
        }
    };

    xjzPagination.Default = {
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

    xjzPagination.prototype = {
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
                $lis.find("." + options.firstClass + ",." + options.prevClass).addClass(options.disabledClass);
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
                visiblePages = Math.min(me.options.visiblePages, me.totalPages),    //如果总页面数小于最大页面按钮数, 则最大页面按钮数为总页面数
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
                case 'simple_numbers': { $ul.find("." + options.firstClass + ",." + options.lastClass).remove(); break; }
                    //首页 上一页 下一页 尾页
                case 'full': { $ul.find("." + options.pageClass + ",." + options.moreClass).remove(); break; }
                    //上一页 下一页
                case 'simple': { $ul.find("." + options.firstClass + ",." + options.lastClass + ",." + options.pageClass + ",." + options.moreClass).remove(); break; }
                    //[1...]
                case 'numbers': { $ul.find("." + options.firstClass + ",." + options.lastClass + ",." + options.prevClass + ",." + options.nextClass).remove(); break; }
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
                        //上一页
                        _currentPage = me.currentPage - 1;
                        break;
                    }
                    case $li.hasClass(options.pageClass): {
                        _currentPage = $li.text();
                        break;
                    }
                    case $li.hasClass(options.nextClass): {
                        //下一页
                        _currentPage = me.currentPage + 1;
                        break;
                    }
                    case $li.hasClass(options.lastClass): {
                        //尾页
                        _currentPage = me.totalPages;
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
        },

        /*---------API方法:----------*/
        //更新页面, 在数据加载成功的回调函数中调用.
        update: function (_totalPages, _currentPage) {
            var me = this;

            me.totalPages = _totalPages;
            if (_currentPage) {
                me.currentPage = _currentPage;
            }
            //总页数小于当前页, 则设置当前页为总页数+1
            if (me.totalPages < me.currentPage) {
                me.currentPage = me.totalPages + 1;
            }
            this.createPages();
        },
        //加载指定页面
        reload: function (currentPage) {
            if (currentPage && !isNaN(currentPage)) {
                this.options.onPageClick.call(this.$element, +currentPage);
            }
        },
        //获取当前页
        getCurrentPage: function () {
            return this.currentPage;
        },
        //获取总页数
        getTotalPages: function () {
            return this.totalPages;
        },
        //销毁
        destroy: function () {
            this.$element.empty().removeData('xjzPagination');
        }
    };

    $.fn.extend({
        xjzPagination: function (_option) {
            if (this.data("xjzPagination")) return this;

            //初始化分页控件, 保存该对象的实例到$Dom元素并返回
            var obj = new xjzPagination(this, _option);
            this.data("xjzPagination", obj);
            return obj;
        }
    });
})(window.jQuery, window, document);