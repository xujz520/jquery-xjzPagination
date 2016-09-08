/// <reference path="jquery-1.11.0-vsdoc.js" />
/*--------------------------------------------------
* jQuery pagination plugin v1.0
* 作者: 徐俊洲
* QQ: 765550360
* 日期: 2016-08
* 说明: 该插件任何人可以应用于任何项目, 完全免费开放自由.
---------------------------------------------------*/

; (function ($, window, document) {
    var XjzPagination = function ($element, _option) {
        var me = this;
        me.option = $.extend({}, XjzPagination.default, _option);
        me.$element = $element;
        me.totalPages = 0;
        me.currentPage = 0;

        me.bindEvent();
        me.createPage();

        if (me.option.initiateStartPageClick) {
            me.currentPage = me.option.startPage;
            me.option.onPageClick.call(me.$element, me.option.startPage);
        }
    };

    XjzPagination.default = {
        first: '首页',
        prev: '上一页',
        next: '下一页',
        last: '尾页',
        visiblePages: 5,
        startPage: 1,
        initiateStartPageClick: true,
        pagingType: 'full_numbers'
    };

    XjzPagination.prototype = {
        test: function () {
            alert('test');
        },
        createPage: function () {
            var me = this;
            var lis = '', $lis;

            lis += '<li class="first"><a href="javascript:;">' + me.option.first + '</a></li>';
            lis += '<li class="prev"><a href="javascript:;">' + me.option.prev + '</a></li>';

            lis = me.createPageButton(lis);

            lis += '<li class="next"><a href="javascript:;">' + me.option.next + '</a></li>';
            lis += '<li class="last"><a href="javascript:;">' + me.option.last + '</a></li>';
            $lis = $(lis);

            if (me.currentPage == 0 || me.currentPage == 1) {
                $lis.filter("li.first,li.prev").addClass("disabled");
            }

            if (me.currentPage == me.totalPages) {
                if (me.currentPage != 0) {
                    $lis.filter("li.next,li.last").addClass("disabled");
                }
            }

            if (me.currentPage > me.totalPages) {
                if (me.totalPages != 0) {
                    $lis.filter("li.next,li.last").addClass("disabled");
                    me.currentPage = me.totalPages + 1;
                } else {
                    me.currentPage = 0;
                    $lis.filter("li.first,li.prev").addClass("disabled");
                }
            }

            console.log("c:" + me.currentPage + "|" + "t:" + me.totalPages);
            $lis.filter(".first").addClass("xjz");
            me.$element.empty().append($lis);
            this.pagingType();
        },
        createPageButton: function (lis) {
            var me = this, flankPages = Math.ceil(me.option.visiblePages / 2);

            if (me.currentPage == 0 && me.totalPages != 0) {
                me.currentPage = 1;
            }

            //判断总页数是否大于可见页数
            if (me.totalPages > me.option.visiblePages) {
                //判断当前页数是否大于两侧页面数
                if (me.currentPage > flankPages) {
                    var let = 0;
                    //判断可见页数是偶数还是奇数. 如果是偶数, 则右边页数比左边多1
                    if (me.option.visiblePages % 2 != 0) {
                        let = 1;
                    }

                    //判断右侧页面数是否大于两侧页面数
                    if (me.totalPages - me.currentPage > flankPages - let ) {
                        console.log("(currentPage-flankPages + 1)--(currentPage + flankPages - let)");
                        //(currentPage-flankPages + 1)--(currentPage + flankPages - let)
                        for (var i = me.currentPage - flankPages + 1 - 1, len = me.currentPage + flankPages - let ; i < len; i++) {
                            if (me.currentPage == (i + 1)) {
                                lis += '<li class="page active"><a href="javascript:;">' + (i + 1) + '</a></li>';
                            } else {
                                lis += '<li class="page"><a href="javascript:;">' + (i + 1) + '</a></li>';
                            }
                        }
                    } else {
                        console.log("(totalPages-visiblePages + 1)--totalPages");
                        //(totalPages-visiblePages + 1)--totalPages
                        for (var i = me.totalPages - me.option.visiblePages + 1 - 1, len = me.totalPages; i < len; i++) {
                            if (me.currentPage == (i + 1)) {
                                lis += '<li class="page active"><a href="javascript:;">' + (i + 1) + '</a></li>';
                            } else {
                                lis += '<li class="page"><a href="javascript:;">' + (i + 1) + '</a></li>';
                            }
                        }
                    }
                } else {
                    console.log("1--visiblePages");
                    //1--visiblePages
                    for (var i = 0, len = me.option.visiblePages; i < len; i++) {
                        if (me.currentPage == (i + 1)) {
                            lis += '<li class="page active"><a href="javascript:;">' + (i + 1) + '</a></li>';
                        } else {
                            lis += '<li class="page"><a href="javascript:;">' + (i + 1) + '</a></li>';
                        }
                    }
                }
            } else {
                console.log("1--totalPages");
                //1--totalPages
                for (var i = 0, len = me.totalPages; i < len; i++) {
                    if (me.currentPage == (i + 1)) {
                        lis += '<li class="page active"><a href="javascript:;">' + (i + 1) + '</a></li>';
                    } else {
                        lis += '<li class="page"><a href="javascript:;">' + (i + 1) + '</a></li>';
                    }
                }
            }

            return lis;
        },
        pagingType: function () {
            var type = this.option.pagingType,
                $ul = this.$element;

            switch (type) {
                case 'full_numbers': { break; }
                case 'simple_numbers': {
                    $ul.find(".first,.last").remove();
                    break;
                }
                case 'full': {
                    $ul.find(".page").remove();
                    break;
                }
                case 'simple': {
                    $ul.find(".first,.last,.page").remove();
                    break;
                }
                case 'numbers': {
                    $ul.find(".first,.last,.prev,.next").remove();
                    break;
                }
            }
        },
        update: function (_totalPages, pageIndex) {
            if (this.totalPages != _totalPages) {
                this.totalPages = _totalPages;
                if (pageIndex) {
                    this.currentPage = pageIndex;
                }
                this.createPage();
            }
        },
        bindEvent: function () {
            var UL_xjzPagination = this;
            this.$element.on('click', 'li', function (event) {
                var $li = $(this),
                    _currentPage = $li.text();

                if ($li.hasClass("disabled") || UL_xjzPagination.currentPage == _currentPage) {
                    return false;
                }

                switch (true) {
                    case $li.hasClass("first"): {
                        _currentPage = 1;
                        $li.siblings().removeClass("active").siblings(".page:first").addClass("active");
                        break;
                    }
                    case $li.hasClass("prev"): {
                        _currentPage = UL_xjzPagination.currentPage >= 1 ? UL_xjzPagination.currentPage - 1 : 1;
                        $li.siblings(".active").parent().find("li").removeClass("active").end().end().prev().addClass("active");
                        break;
                    }
                    case $li.hasClass("page"): {
                        _currentPage = $li.text();
                        $li.siblings().removeClass("active").end().addClass("active");
                        break;
                    }
                    case $li.hasClass("next"): {
                        _currentPage = UL_xjzPagination.currentPage + 1;
                        $li.siblings(".active").parent().find("li").removeClass("active").end().end().next().addClass("active");
                        break;
                    }
                    case $li.hasClass("last"): {
                        _currentPage = UL_xjzPagination.totalPages == 0 ? 1 : UL_xjzPagination.totalPages;
                        $li.siblings().removeClass("active").siblings(".page:last").addClass("active");
                        break;
                    }
                }

                UL_xjzPagination.currentPage = +_currentPage;
                //UL_xjzPagination.update(UL_xjzPagination.totalPages);
                UL_xjzPagination.createPage();

                UL_xjzPagination.option.onPageClick.call(UL_xjzPagination.$element, +_currentPage);
                return false;
            });
        }
    };

    $.fn.extend({
        xjzPagination: function (_option) {
            //初始化分页对象, 并保存该对象的实例
            this.data('xjzPagination', new XjzPagination(this, _option));
        }
    });
})(window.jQuery, window, document);