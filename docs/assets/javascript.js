$(function () {
    //基本使用
    (function () {
        //初始化分页控件
        var paging = $("#test_xjzPagination").xjzPagination({
            onPageClick: function (currentPage) {
                loadData(currentPage);
            }
        });

        //加载数据方法
        function loadData(currentPage) {
            var limit = 10,
                start = (currentPage - 1) * limit;
            
            //过滤数据
            var search_value = $("#search_value").val();
            var _data=[], rows = [];
            if (search_value) {
                for (var i = 0, len = data.length; i < len; i++) {  //data -> data.js
                    for (var pro in data[i]) {
                        if (data[i][pro].toString().indexOf(search_value) != -1) {
                            _data.push(data[i]);
                            break;
                        }
                    }
                }
            } else {
                _data = data;
            }

            //提取数据
            rows = _data.slice(start, start + limit);

            //渲染模板
            $("#test_table_temp").prev().html(template("test_table_temp", { rows:rows }));     //artTemplate.js

            //更新分页
            var totalPages = Math.ceil(_data.length / limit);     //上舍
            paging.update(totalPages, currentPage);
        }

        //搜索按钮事件
        $("#search_btn").click(function () {
            loadData(1);    //重置分页
        });
        //清除搜索事件
        $("#search_clear").click(function () {
            $("#search_value").val('');
            loadData(1);    //重置分页
        });
    })();


    $("#paging1").xjzPagination({
        totalPages:20,
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging2").xjzPagination({
        totalPages: 20,
        pagingType:'full_numbers',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging3").xjzPagination({
        totalPages: 20,
        pagingType:'full',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging4").xjzPagination({
        totalPages: 20,
        pagingType: 'simple',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging5").xjzPagination({
        totalPages: 20,
        pagingType: 'numbers',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging6").xjzPagination({
        totalPages: 20,
        visiblePages:1,
        pagingType: 'full_numbers',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });

    $("#paging7").xjzPagination({
        totalPages: 20,
        pagingType: 'full_numbers',
        first: '<<',
        prev: '<',
        next: '>',
        last:'>>',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging8").xjzPagination({
        totalPages: 20,
        visiblePages: 1,
        pagingType: 'simple',
        prevClass: 'PREV',
        nextClass:'NEXT',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging9").xjzPagination({
        totalPages: 20,
        visiblePages: 7,
        startPage: 7,
        first: '<<',
        prev: '<',
        next: '>',
        last: '>>',
        pagingType: 'full_numbers',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });


    $("#paging10").xjzPagination({
        totalPages: 20,
        visiblePages: 7,
        startPage: 7,
        pagingType: 'full_numbers',
        onPageClick: function (currentPage) {
            this.parent().prev().text(currentPage);
        }
    });
});