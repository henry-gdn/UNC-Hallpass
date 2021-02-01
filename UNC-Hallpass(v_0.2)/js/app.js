 
$(document).ready(function(){
	setTimeout(function(){ 
		$("body").css({visibility:'visible'});
	}, 1000);
	$('a').css('cursor', 'pointer');
	$('a').focus();
	
	
	$('.navigation-menu li').keyup(function(e) {
        var code = e.keyCode || e.which;
        if (code === 9) {
			var menu_status = $(this).attr('data-val');
			if(menu_status == 'menu1') {
				$('.collapseMenu').collapse('show');
			}
			if(menu_status == 'menu2') {
				$('.collapseMenu_2').collapse('show');
			}
			if(menu_status == 'menu3') {
				$('.collapseMenu_2').collapse('hide');
			}
			if(menu_status == 'menu') {
				$('.collapseMenu_2').collapse('hide');
				$('.collapseMenu').collapse('hide');
				e.preventDefault();
			}
        }
    });
});

! function($) {
    "use strict"; 
    // Loader 
    $(window).on('load', function() {
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    }); 
    
    // Menu
    $('.navbar-toggle').on('click', function (event) {
        $(this).toggleClass('open');
        $('#navigation').slideToggle(400);
    });
	
	//hamburger menu click via keyboard
	$('.navbar-toggle').keyup(function(){
        $(this).toggleClass('open');
        $('#navigation').slideToggle(400);
    });
	
	
	// Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function(){
        $(this).prev(".has-submenu a").find("i").addClass("icon-minus").removeClass("icon-plus");
		//event.stopPropagation();
    });
    
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function(){
        $(this).prev(".has-submenu a").find(".feather").removeClass("icon-plus").addClass("icon-minus");
    }).on('hide.bs.collapse', function(){
        $(this).prev(".has-submenu a").find(".feather").removeClass("icon-minus").addClass("icon-plus");
    });
	
	
	$(document).click(function(e) {
		if (!$(e.target).is('section')) {
			$('.collapse').collapse('hide');	    
		}
	});
	


    $('.mouse-down').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 0
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });

    //Sticky
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 50) {
            $(".sticky").addClass("nav-sticky");
        } else {
            $(".sticky").removeClass("nav-sticky");
        }
    });

    // Back to top
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    }); 
    $('.back-to-top').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    }); 

    //Tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    //Popover
    $(function () {
        $('[data-toggle="popover"]').popover()
    });
}(jQuery)