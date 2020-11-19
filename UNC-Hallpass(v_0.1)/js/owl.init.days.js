//Owl Carousel
$('#days-slider').owlCarousel({
  loop:false,
  nav: false,
  dots: true,
  mouseDrag : false,
  touchDrag : false,
  pullDrag : false,
  freeDrag : false,
  autoplay:false,
  autoplayTimeout:false,
  autoplayHoverPause:false,
  responsive:{
      0:{
          items:3
      },
      600:{
          items:3
      },
      1000:{
          items:7
      }
  }
});