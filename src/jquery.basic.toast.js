;(function($){
    $.Toast = function(message, options){
        // default properties
        options = options || {};
        options.width = options.width || 0;
        options.duration = options.duration || 3000;
        options.class = options.class || '';
        options.position = options.position || 'bottom'; // top or bottom
        options.align = options.align || 'right'; // left or right or center
        options.zindex = options.zindex || 999999;
        if (options.autohide === undefined) {
            options.autohide = true;  // autohide. If false never hide
        }
        options.uid = options.uid || Math.floor(Date.now() * Math.random()).toString(36);  // uid used to deduplicate

        var css = {'z-index': options.zindex};
        //var UID = Math.floor(Date.now() * Math.random()).toString(36);

        // init toast container
        var $item = $('<div>' + message + '</div>').addClass('sl-notification');

        // set custom class
        if(options.class !== '') {
            $item.addClass(options.class);
        }

        // store the setting to check later the latest toast (filter by alignement and positionning)
        $item.data('position', options.position).data('align', options.align).data('id', options.uid);

        if(options.width > 0) {
            css['width'] = options.width + 'px';
        }

        // *** stack the toasts : TOP/BOTTOM
        var offsetSum = 20; // initial offset from top or bottom positionning
        var padding = 10; // number of pixel beetween each toasts

        var displayed_uid = [];
        $('.sl-notification').each(function()
        {
            var $toast = $(this);
            var val = 0, offsetHeight = 0;

            // check the latest toast position to calc the position for the new toast
            if ($toast.data('position') === options.position && $toast.data('align') === options.align) {
                val = parseInt($toast.css(options.position), 10);
                offsetHeight = $toast.outerHeight();
            }
            if ($toast.data('id')) {
                displayed_uid.push($toast.data('id'));
            }
            return offsetSum = Math.max(offsetSum, val + offsetHeight + padding);
        });
        css[options.position] = offsetSum + 'px';

        // align the toast : LEFT/CENTER/RIGHT
        switch (options.align)
        {
            case "center":
                css['left'] = '50%';
                css['margin-left'] = '-' + ($item.outerWidth() / 2) + 'px';
                break;
            case "left":
                css['left'] = '20px';
                break;
            case "right":
                css['right'] = '20px';
                break;
        }

        //console.log("displayed_uid", displayed_uid);
        if (displayed_uid.indexOf(options.uid) < 0) {  // deduplication
            // add the toast to the 'document.body' with the css options
            $item.css(css).appendTo(document.body);
        }

        // setup timeout
        var time = 0;
        // setTimeout - instead Of jQuery.queue();
        setTimeout(function() {
            // 1 - show the toast
            $item.addClass('show');
        }, time += 100);

        if (options.autohide) {
            setTimeout(function() {
                // 2 - hide the toast after X seconds
                $item.removeClass('show');
            }, time += options.duration);
            setTimeout(function() {
                // 3 - destroy the DIV element
                $item.remove();
            }, time += 500);
        }

        // Mouse interaction on the toast
        $('.sl-notification').on('click', function () {
            // TODO : add an effect before removing the toast when we click ?
            $(this).hide().remove();
        });
    };

    $.ToastRemove = function(uid){
        /* remove a displayed Toast */
        $('.sl-notification').each(function()
        {
            if ($(this).data('id') == uid) {
                $(this).hide().remove();
                // setup timeout
                //$(this).removeClass('show');
                //setTimeout(function() {
                //    // 3 - destroy the DIV element
                //    $(this).remove();
                //}, 500);
            }
        });
    };
})(jQuery);
