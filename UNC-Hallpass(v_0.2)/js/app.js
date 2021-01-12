/* Template Name: Leaping - Creative Multipurpose Template
   Author: Uniquecrew
   E-mail: uniquecrewdesign@gmail.com
   Version: 1.3.0
   Created: May 2020
   File Description: Main JS file of the template
*/

/****************************/
/*         INDEX            */
/*===========================
 *     01.  Loader          *
 *     02.  Menu            *
 *     03.  Sticky Menu     *
 *     03.  Back to top     *
 ===========================*/
 
$(document).ready(function(){
	setTimeout(function(){ 
		$("body").css({visibility:'visible'});
		
		
	}, 1000);
	
	
	
	
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
    
    $('.navigation-menu>li').slice(-1).addClass('last-elements');
    
    $('.menu-arrow,.submenu-arrow').on('click', function (e) {
        if ($(window).width() < 992) {
            e.preventDefault();
            $(this).parent('li').toggleClass('open').find('.submenu:first').toggleClass('open');
        }
    });
    
    $(".navigation-menu a").each(function () {
        if (this.href == window.location.href) {
            $(this).parent().addClass("active"); 
            $(this).parent().parent().parent().addClass("active"); 
            $(this).parent().parent().parent().parent().parent().addClass("active"); 
        }
    });

    // Clickable Menu
     $('.has-submenu a').hover(function(e) { // password written	
		//alert(hover);
		//$(this).siblings('.submenu').addClass('visibleMenu');
		//var code = e.keyCode || e.which;
		//if (code === 9) {  
			//e.preventDefault();
			//$(".submenu").addClass("active");
			//$(".submenu").focus();
			//alert('it works!');
		//}
    });
	
	
	$('.has-submenu a').focus(function(){
		//alert(focus);	
		//$(".navigation-menu li").addClass('visibleMenu'); // if hovered then it has class active
		//$(this).removeClass('menuVis');
	});
	
	// Clickable Menu
    $("section").click(function() {
		$(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'});
    });
	
	$('.navigation-menu li').find("a").focus(function() {
		/* if ($(this).find(".submenu").length == 0) {
            $(".submenu").css({visibility:'hidden'});
			$(".submenu").css({opacity:'0'});	
        } */
		/* alert($(this).closest("li").find(".submenu").length);
		$(this).closest("li").find(".submenu").length;
		$(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'}); */	
	});
	
	
	
	// Clickable Menu
    $(".has-submenu a").click(function() {
		//alert("click event triggerd");
		$(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'});
		$(this).closest("li").find(".submenu").css({visibility:'visible'});
		$(this).closest("li").find(".submenu").css({opacity:'1'});
		
		
		
		//$(this).closest("li a").css({content:'\e897'});
		//$(this).closest("li a").css({font-family:'feather'});
		
		if(window.innerWidth < 992){
			$(".submenu").css({visibility:'visible'});
			$(".submenu").css({opacity:'1'});
            if($(this).parent().hasClass('open')){
                $(this).siblings('.submenu').removeClass('open');
                $(this).parent().removeClass('open');
				$(this).closest("li").find(".submenu").css({visibility:'visible'});
				$(this).closest("li").find(".submenu").css({opacity:'1'});
            } else {
                $(this).siblings('.submenu').addClass('open');
                $(this).parent().addClass('open');
				$(this).closest("li").find(".submenu").css({visibility:'visible'});
				$(this).closest("li").find(".submenu").css({opacity:'1'});
            }
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