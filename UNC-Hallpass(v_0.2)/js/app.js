 
$(document).ready(function(){
	setTimeout(function(){ 
		$("body").css({visibility:'visible'});
	}, 1000);
	$('a').css('cursor', 'pointer');
	$('a').focus();
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
	
	//skip link to main content
	/* $('.skip-link').keyup(function(){
		$('#navigation').removeClass('open');
    }); */
	
	
	//Mouse users
	/* var menuItems = document.querySelectorAll('li.has-submenu');
	Array.prototype.forEach.call(menuItems, function(el, i){
		el.addEventListener("mouseover", function(event){			
			this.className = "has-submenu open";
			clearTimeout(timer);
			alert();
		});
		el.addEventListener("mouseout", function(event){
			timer = setTimeout(function(event){
				document.querySelector(".has-submenu.open").className = "has-submenu";
			}, 1000);
		});
	}); */
    
    /* $('.navigation-menu>li').slice(-1).addClass('last-elements');
    
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
    }); */

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
	
	
	
	
	/* $('.has-submenu a').click(function(){
		//alert(focus);	
		//alert(event clicked);	
		//$(".navigation-menu li").addClass('visibleMenu'); // if hovered then it has class active
		//$(this).removeClass('menuVis');
	}); */
	
	// Clickable Menu
    /* $("section").click(function() {
		$(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'});
    }); */
	
	
	
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
	
	
	
	
	// mouseover function
	$("section").mouseout(function(){
		//$(".submenu").css({visibility:'hidden'});
		//$(".submenu").css({opacity:'0'});
		//e.preventDefault();
		//return false;
	});
	
	// mouseover function
	/* $(".has-submenu").mouseover(function(){
		$(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'});
		$(this).closest("li").find(".submenu").css({visibility:'visible'});
		$(this).closest("li").find(".submenu").css({opacity:'1'});
		setTimeout(function(event){
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
		}, 0);
		
		
    }); */
	
	
	
	//keyboard users
	/* var menuItems = document.querySelectorAll('.has-submenu a');
	Array.prototype.forEach.call(menuItems, function(el, i){
		el.querySelector('a').addEventListener("click",  function(event){
			if (this.parentNode.className == "has-submenu") {
				this.parentNode.className = "has-submenu open";
				this.setAttribute('aria-expanded', "true");
				//alert("key pressed");
			} else {
				this.parentNode.className = "has-submenu";
				this.setAttribute('aria-expanded', "false");
			}
			event.preventDefault();
			return false;
		});
	}); */
	
	
	
	// Clickable Menu
    $(".has-submenu a").click(function() {
		//alert("click event triggerd");
		/* $(".submenu").css({visibility:'hidden'});
		$(".submenu").css({opacity:'0'});
		$(this).closest("li").find(".submenu").css({visibility:'visible'});
		$(this).closest("li").find(".submenu").css({opacity:'1'}); */
		
		//$('[data-toggle="collapse"]').remove();
		//$(".has-submenu a").append("<span class='feather icon-plus'></span>");
		
	
		
		/* $(this).closest("li").find(".submenu").collapse('hide'); */
		//$(".submenu").on('show.bs.collapse', function(){
			//$(this).addClass('collapseHide');
		//});

		//$(this).closest("li a").css({content:'\e897'});
		//$(this).closest("li a").css({font-family:'feather'});
		
		/* if(window.innerWidth < 992){
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
        } */
		
    });
	
	// Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function(){
        $(this).prev(".has-submenu a").find("i").addClass("icon-minus").removeClass("icon-plus");
		//event.stopPropagation();
    });
    
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function(){
        $(this).prev(".has-submenu a").find(".feather").removeClass("icon-plus").addClass("icon-minus");
		//event.stopPropagation();
    }).on('hide.bs.collapse', function(){
        $(this).prev(".has-submenu a").find(".feather").removeClass("icon-minus").addClass("icon-plus");
		//event.stopPropagation();
    });
	
	/* if (!$(e.target).is('.mobile-view-home')) {
    	$('.collapse').collapse('hide');	    
    } */
	
	$(document).click(function(e) {
		if (!$(e.target).is('section')) {
			$('.collapseMenu').collapse('hide');	    
		}
	});
	
	/* $(document).keyup(function(e) {
		if (!$(e.target).is('section')) {
			$('.collapseMenu').collapse('hide');	    
		}
	}); */
	
	
	
	// Clickable Menu
    /* $(".has-submenu a").keyup(function() {
		//alert("click event triggerd");
		$(this).closest("li").find(".submenu").css({visibility:'visible'});
		$(this).closest("li").find(".submenu").css({opacity:'1'});		
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
		
    }); */
	
	
	
	
	
	//hamburger menu click via keyboard
	/* $('.has-submenu a').keyup(function(){
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
   }); */
   
   
	
	//$('a').on('focus', function() {
	/* $('a').keyup(function() {
		var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 0
        }, 500, 'easeInOutExpo');
        event.preventDefault();
	}); */
	
	

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