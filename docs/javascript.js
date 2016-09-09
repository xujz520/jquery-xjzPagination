$(function () {
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