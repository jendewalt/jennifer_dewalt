(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
    var x = 0,
        y = 0,
        even = true,
        super_mode = false;

    function makeWrap() {
        for (var i = 0; i < 292; i++) {
            $('<div>', {
                class: 'bubble',
                id: i
            }).html('<img src="images/bubble.png">').appendTo('#bubble_container')
            .css({top: y, left: x})
            .on('click', function () {
                $(this).hide();
                $('#' + this.id + 'pop').show();
                // [Bug fix: 03.03.2016] Original code was prompting for download.
                // $('#sound').html("<embed src='audio/pop.wav' hidden=true autostart=true loop=false>");
                document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/pop.wav' type='audio/wav'></audio>";
            })
            .on('mouseover', function () {
                if (super_mode) {
                    $(this).hide();
                    $('#' + this.id + 'pop').show();
                    // [Bug fix:033.1162015] Original code was prompting for download.
                    // $('#sound').html("<embed src='audio/pop.wav' hidden=true autostart=true loop=false>");
                    document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/pop.wav' type='audio/wav'></audio>";
                }
            });

            $('<div>', {
                class: 'popped',
                id: i + 'pop'
            }).html('<img src="images/popped.png">').appendTo('#bubble_container')
            .css({top: y, left: x})
            .hide();

            x += 39;

            if (x > 849) {
                if (even) {
                    x = -19;
                    even = !even;
                } else {
                    x = 0;
                    even = !even;
                }

                y += 33;
            }
        }
    };

    makeWrap();

    $('.super').on('click', function () {
        if (super_mode) {
            $('.super').removeClass('on');
            super_mode = !super_mode;
            $('.super').addClass('off');
        }else {
            $('.super').removeClass('off');
            super_mode = !super_mode;
            $('.super').addClass('on');
        }
    });

    $('.reset').on('click', function () {
        $('.popped').hide();
        $('.bubble').show();
    })

    $('body').disableSelection();
});
