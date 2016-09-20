define(assetsUrl+'/m/pager',function(require,exports,module){
	var $ = require("$");
	$.fn.pager = function(options) {
        var opts = $.extend({}, $.fn.pager.defaults, options);
        return this.each(function() {
            $(this).empty().append(renderpager(parseInt(options.currentPage), parseInt(options.totalPage), options.pageCallback));
        });
    };
    function renderpager(currentPage, totalPage, pageCallback) {
        var $pager = $('<span></span>');
        $pager.append(renderButton('首页', currentPage, totalPage, pageCallback ,"firstpage")).append(renderButton('上一页', currentPage, totalPage, pageCallback,"prevPage"));
        var startPoint = 1;
        var endPoint = 5;
        if (currentPage > 4) {
            startPoint = currentPage - 4;
            endPoint = currentPage + 4;
        }

        if (endPoint > totalPage) {
            startPoint = totalPage - 8;
            endPoint = totalPage;
        }

        if (startPoint < 1) {
            startPoint = 1;
        }
        for (var page = startPoint; page <= endPoint; page++) {
            var currentButton = $('<a href="javascript:void(0);" class="paging-item">' + (page) + '</a>');
            page == currentPage ? currentButton.addClass('paging-current'):currentButton.click(function() { pageCallback(this.firstChild.data); });
            currentButton.appendTo($pager);
        }
        $pager.append(renderButton('下一页', currentPage, totalPage, pageCallback,"nextPage")).append(renderButton('尾页', currentPage, totalPage, pageCallback,"lastPage"));
        return $pager;
    }

    function renderButton(buttonLabel, currentPage, totalPage, pageCallback,className) {
        var $Button = $('<a href="javascript:void(0);" class="paging-prev">' + buttonLabel + '</a>');
        var thisPage = 1;
        switch (className) {
            case "firstpage":
                thisPage = 1;
                break;
            case "prevPage":
                thisPage = currentPage - 1;
                break;
            case "nextPage":
                thisPage = currentPage + 1;
                break;
            case "lastPage":
                thisPage = totalPage;
                break;
        }

        if (className == "firstpage" || className == "prevPage") {
            currentPage <= 1 ? $Button.addClass('pgEmpty') : $Button.click(function() { pageCallback(thisPage); });
        }else {
            currentPage >= totalPage ? $Button.addClass('pgEmpty') : $Button.click(function() { pageCallback(thisPage); });
        }
        return $Button;
    }

    $.fn.pager.defaults = {
        currentPage: 1,
        totalPage: 1
    };
});