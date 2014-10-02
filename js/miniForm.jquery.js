(function($) {
    $.fn.miniForm = function(params) {

        // Default settings
        var def = {
            css : 'jquery',
            note : {
                required : 'Please enter a value for this field.',
                empty : 'You must have existing label and input fields.'
            },
        };

        // Assigning default parameters
        $.fn.miniForm.params  = def;

        // Check arguments for user defined parameters
        if(params){
            for(var opt in def)
                if(params[opt])
                   $.fn.miniForm.params[opt] = params[opt];
        }

        // Define parent element
        this.parent = this;

        // Ensure manipulated element has elements defined else notify of missing elements
        if (this.children().length) {       

            // Add default style     
            this.wrap('<div class="mf"></div>');
            
            // Find and group input and label elements and define the list
            var elems = this.find('input,label');
            elems.wrapAll('<ul></ul>');
            for(var i = 0; i < elems.length; i+=2)
                   elems.slice(i,i+2).wrapAll('<li '+ ( i == 0 ? 'class="mf-active"':'' ) + '></li>');

            // Form parent definition
            element = $(this).parent('.mf');

            // Apply HTML miniForm
            element.html(element.html() + $.fn.miniForm.controlConstruct);
        } else {
            // Notify user of missing elements
            this.html('<h1>'+ $.fn.miniForm.params.note.empty + '</h1>');
        }

        // Add location helper (bottom right)
        element.find('.mf-loc').html(1 + ' | ' + element.find('li').length);

        // Add form attributes used in form navigation
        element.find('form').attr('current', 1).attr('steps', element.find('li').length);

        // Make initial list element the active element
        element.find('li').eq(0).toggle();

        // Apply styles if defined
        if($.fn.miniForm.params.css == 'jquery'){
            var styles = $.fn.miniForm.styles;
            for(var key in styles)
                element.find(key).css(styles[key]);
        }

        // Keyboard navigation of form
        $('.mf li input').keydown(function(e) {
            var key = e.keyCode || e.which;

            // TAB / Enter to submit
            if ($.fn.miniForm.toggle && (key == 13 || key == 9)) {
                e.preventDefault();
                $('.mf form').submit();
            // TAB / Enter to move to next form field
            } else if (!$.fn.miniForm.toggle && (key == 13 || key == 9)) {
                e.preventDefault();
                console.log('next');
                $('a.mf-next').click();
            // ALT to go to the previous form field
            } else if (key == 18) {
                e.preventDefault();
                $('a.mf-prev').click();
            }
        });

        // Focus on input if list element if clicked
        $('.mf li').click(function() {
            $(this).find('input').focus();
        });

        // Navigate to the next form field
        $('a.mf-next').click(function() {
            // Get current location from form attribute
            var cNum = $('.mf form').attr('current') - 1;

            // Check if field is required
            if (!$('.mf li').eq(cNum).find('input').val() && $('li').eq(cNum).find('input').attr('required') == 'required') {
                $('.mf-note').text($.fn.miniForm.params.note.required);
            // Move to the next form field
            } else if (cNum <= $('.mf form').attr('steps')) {
                // Clear note
                $('.mf-note').text('');

                // Hide previous active element
                $('.mf li').eq(cNum).toggle();
                // Activate next element
                cNum++;
                $('.mf li').eq(cNum).toggle();
                $('.mf form').attr('current', cNum+1);

                // Update UI elements to indicate next element
                var progress = ((cNum) / ($('.mf form').attr('steps') - 1)) * 100;
                $('.mf .mf-progress').animate({
                    "width": progress + "%",
                });
                $('.mf-loc').html($('.mf form').attr('current') + ' | ' + $('.mf form').attr('steps'));

                // Toggle submission status (true on last element)
                if (cNum == $('.mf form').attr('steps')) {
                    $.fn.miniForm.toggle = true;
                }

                // Focus on new input element
                $('.mf li input').eq(cNum).focus();
            }
        });

        // Navigate to previous form element
        $('a.mf-prev').click(function() {
            
            // Get current location from form attribute
            var cNum = $('.mf form').attr('current') - 1;

            // Determine if previous exists
            if (cNum >= 1) {
                // Clear note
                $('.mf-note').text('');

                // Deactivate current list element
                $('.mf li').eq(cNum).toggle();
                
                cNum--;

                // Activate new element
                $('.mf li').eq(cNum).toggle();

                // Update fields and UI with new location
                $('.mf form').attr('current', cNum+1);
                var progress = ((cNum) / ($('.mf form').attr('steps') - 1)) * 100;
                $('.mf .mf-progress').animate({
                    "width": progress + "%",
                });
                $('.mf-loc').html($('.mf form').attr('current') + ' | ' + $('.mf form').attr('steps'));

                // Focus on new input element
                $('.mf li input').eq(cNum).focus();
            }
        });

        // Return miniForm element
        return this;
    }
    // Submission toggle
    $.fn.miniForm.toggle = false;

    // Control construct
    $.fn.miniForm.controlConstruct = '<div class="mf-controls"><div class="mf-bar"><div class="mf-progress"></div></div><a href="javascript:;" class="mf-next">TAB / ENTER</a><a href="javascript:;" class="mf-prev">ALT</a><span class="mf-loc"></span><span class="mf-note"></span></div>';

    // jQuery styles
    $.fn.miniForm.styles = {
            a : {
                "position": "absolute",
                "display": "inline-block",
                "font-size": "0.75em",
                "padding": "2px",
                "top":"10%"
            },
            input : {
                "position": "absolute",
                "left": "20%",
                "bottom": "0",
                "border": "none",
                "width": "60%",
                "height": "30%",
                "margin": "0 auto",
                "padding": "0 8%",
                "outline": "0",
                "font-size": "2rem",
                "text-align": "center",
            },
            label : {
                "cursor" : "text",
                "position": "absolute",
                "top": "0%",
                "left" : "0",
                "width" : "100%",
                "height" : "55%",
                "z-index" : "2",
                "font-size" : "2rem",
                "text-align" : "center",
            },
            li : {
                "cursor" : "text",
                "position" : "absolute",
                "top" : "15%",
                "left" : "0",
                "height" : "45%",
                "width" : "100% ",
                "display" : "none",
                "text-align" : "center",
            },
            span : {
                "position": "absolute",
                "top": "65%",
                "font-size": "1.2rem",
            },
            ul : {
                "height" : "100%",
                "list-style-type": "none",
                "min-height" : "300px",
                "padding" : 0
            },
            '.mf' : {
                "height": "100%",
                "width": "100%"
            },
            '.mf-active' : {
                "display" : 'block'
            },
            '.mf-bar' : {
                "position": "absolute",
                "top": "50%",
                "left": "20%",
                "width": "60%",
                "height": "3px",
            },
            '.mf-controls' : {
                "cursor" : "text",
                "position": "absolute",
                "top": "52%",
                "width": "100%",
                "min-height": "40px",
                "text-align": "center",
            },
            '.mf-loc' : {
                "right" : "20%"
            },
            '.mf-note' : {
                "left" : "20%"
            },
            '.mf-prev' : {
                "left": "21%" 
            },
            '.mf-progress' : {
                "height": "100%",
                "width": "0",
            },
            '.mf-next' : {
                "right": "21%" 
            },
        };

}(jQuery));
