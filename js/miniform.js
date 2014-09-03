(function($) {
    $.fn.miniForm = function(params) {

        this.params = params;
        this.parent = this;

        this.append('<div class="mf"></div>');
        element = this.find('.mf');
        element.html($.fn.miniForm.formConstruct(params));

        this.find('.mf-loc').html(1 + ' | ' + this.find('li').length)
        this.find('form').attr('current', 1).attr('steps', this.find('li').length);
        this.find('li').eq(0).addClass('mf-active');


        $('.mf li input').keydown(function(e) {
            var key = e.keyCode || e.which;
            if ($.fn.miniForm.toggle && (key == 13 || key == 9)) {
                e.preventDefault();
                $('.mf form').submit();
            } else if (!$.fn.miniForm.toggle && (key == 13 || key == 9)) {
                e.preventDefault();
                console.log('next');
                $('a.mf-next').click();
            } else if (key == 18) {
                e.preventDefault();
                $('a.mf-prev').click();
            }
        });
        $('.mf li').click(function() {
            $(this).find('input').focus();
        });
        $('a.mf-next').click(function() {
            var cNum = $('.mf form').attr('current');
            if (cNum <= $('.mf form').attr('steps') && $('.mf-active input').val()) {
                $('.mf-note').text('');
                $('.mf-active').toggleClass('mf-active');
                cNum++;
                $('.mf li').eq(cNum - 1).toggleClass('mf-active');
                $('.mf form').attr('current', cNum);
                var progress = ((cNum - 1) / ($('.mf form').attr('steps') - 1)) * 100;
                $('.mf .mf-progress').animate({
                    "width": progress + "%",
                });
                if (cNum == $('.mf form').attr('steps')) {
                    $.fn.miniForm.toggle = true;
                }
                $('.mf li.mf-active input').focus();
                $('.mf-loc').html($('.mf form').attr('current') + ' | ' + $('.mf form').attr('steps'));
            } else if (!$('.mf-active input').val()) {
                $('.mf-note').text('Please enter a value for this field.');
            }
        });
        $('a.mf-prev').click(function() {
            var cNum = $('.mf form').attr('current');
            if (cNum >= 2) {
                $('.mf-active').toggleClass('mf-active');
                cNum--;
                $('.mf li').eq(cNum - 1).toggleClass('mf-active');
                $('.mf form').attr('current', cNum);
                var progress = ((cNum - 1) / ($('.mf form').attr('steps') - 1)) * 100;
                $('.mf .mf-progress').animate({
                    "width": progress + "%",
                });
                if (cNum == $('.mf form').attr('steps')) {
                    $.fn.miniForm.toggle = true;
                }
                $('.mf li.mf-active input').focus();
                $('.mf-loc').html($('.mf form').attr('current') + ' | ' + $('.mf form').attr('steps'));
            }
        });


        return this;
    }

    $.fn.miniForm.toggle = false;

    $.fn.miniForm.fieldConstruct = function(params) {
        var temp = "";
        var temp = "<ul>";
        var fields = params['fields'];
        for (var opt in fields) {
            var attrs = fields[opt];
            temp += '<li><label for="' + opt + '">' + attrs['label'] + '</label>';
            temp += '<input id="' + opt + '" "' + attrs['attributes'] + '"></li>';
        }
        temp += '</ul>';
        return temp;
    };

    $.fn.miniForm.controlConstruct = '<div class="mf-controls"><div class="mf-bar"><div class="mf-progress"></div></div><a href="javascript:;" class="mf-next">TAB / ENTER</a><a href="javascript:;" class="mf-prev">ALT</a><span class="mf-loc"></span><span class="mf-note"></span></div>';

    $.fn.miniForm.formConstruct = function(params) {
        var temp = '';
        var formElement = params['form'];
        temp += '<form action=' + formElement['action'];
        if (formElement['attributes'])
            temp += formElement['attributes'];
        temp += ' >' + $.fn.miniForm.fieldConstruct(params) + $.fn.miniForm.controlConstruct + '</form>';
        return temp;
    };
}(jQuery));
