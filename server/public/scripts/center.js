$(window).resize(function(){
    $('#container').css({
        position:'absolute',
        left: ($(window).width() - $('#container').outerWidth())/2
    });
});

// To initially run the function:
$(window).resize();
