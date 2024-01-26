(function($) {

    "use strict";

    // hide show category
    $(".display-cat").click(function() {
        $(".shop-category ul").slideToggle();
    });

    $(document).ready(function () {
        $('.minus').click(function () {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            return false;
        });
        $('.plus').click(function () {
            var $input = $(this).parent().find('input');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            return false;
        });
    });
    // $(".search-box-btn").click(function() {
    //     $(".search-box-outer").slideToggle();
    // });
    $("#profileModel").on('show.bs.modal', function(e) {
        $("#exampleModal").modal("hide");
    });
    if ($(window).width() <= 767) {
        $(".display-filter").click(function() {
            $(".filter-box").slideToggle();
        });
    }
    // Banner Carousel / Owl Carousel 
    if ($('.banner-carousel').length) {
        $('.banner-carousel').owlCarousel({
        	 	center: true,
			    items:1.5,
			    loop:true,
			    margin:10,
			    animateOut: 'fadeOut',
            	animateIn: 'fadeIn',
            	smartSpeed: 500,
            	autoHeight: true,
	            autoplay: true,
	            autoplayTimeout: 5000,
	            navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
            	nav: true,
			    responsive:{
			        600:{
			            items:1.5,
			             autoWidth: false,
                    nav: true
			        },
			         1024: {
                    items: 1,
                    autoWidth: false,
                    nav: true
                },
                1190: {
                    items: 1,
                    autoWidth: false,
                    nav: true
                },
                1450: {
                    items: 3,
                    autoWidth: true,
                    nav: true
                }
            }
			    
      //       animateOut: 'fadeOut',
      //       animateIn: 'fadeIn',
      //       center: true,
		    // items:3,
		    // loop:true,
		    // margin:10,
      //   	nav: true,
      //       smartSpeed: 500,
      //       autoHeight: true,
      //       autoplay: true,
      //       autoplayTimeout: 5000,
      //       navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
      //       responsive: {
      //           0: {
      //               items: 3,
      //               autoWidth: true,
      //               nav: true
      //           },
      //           600: {
      //               items: 3,
      //               autoWidth: true,
      //               nav: true
      //           },
      //           1024: {
      //               items: 1,
      //               autoWidth: false,
      //               nav: true
      //           },
      //           1190: {
      //               items: 1,
      //               autoWidth: false,
      //               nav: true
      //           },
      //           1450: {
      //               items: 3,
      //               autoWidth: true,
      //               nav: true
      //           }
      //       }
        });
    }


    if ($('.profile-slider').length) {
        $('.profile-slider').owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            loop: true,
            margin: 30,

            dots: true,
            nav: false,
            smartSpeed: 500,
            autoHeight: true,
            autoplay: true,
            autoplayTimeout: 5000,
            navText: ['', ''],
            responsive: {
                0: {
                    items: 3,
                    margin: 10
                },
                991: {
                    items: 3,
                    margin: 0
                },
                1024: {
                    items: 1,
                    loop: true,

                },

                1200: {
                    items: 2,

                    nav: true
                }
            }
        });
    }

    $(function() {
        var owl = $('.event-slider'),

            owlOptions = {
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                loop: true,
                margin: 10,
                nav: true,
                smartSpeed: 500,
                autoHeight: true,
                autoplay: true,
                autoplayTimeout: 5000,
                navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
                items: 2
            };

        if ($(window).width() <= 767) {
            var owlActive = owl.owlCarousel(owlOptions);
        } else {
            owl.addClass('off');
        }

        $(window).resize(function() {
            if ($(window).width() <= 767) {
                if ($('.event-slider').hasClass('off')) {
                    var owlActive = owl.owlCarousel(owlOptions);
                    owl.removeClass('off');
                }
            } else {
                if (!$('.event-slider').hasClass('off')) {
                    owl.addClass('off').trigger('destroy.owl.carousel');
                    owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
                }
            }
        });
    });
    $(function() {
        var owl = $('.category-slider'),

            owlOptions = {
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                loop: true,
                margin: 20,
                nav: true,
                smartSpeed: 500,
                autoHeight: true,
                autoplay: true,
                autoplayTimeout: 5000,
                navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
                items: 2
            };

        if ($(window).width() <= 767) {
            var owlActive = owl.owlCarousel(owlOptions);
        } else {
            owl.addClass('off');
        }

        $(window).resize(function() {
            if ($(window).width() <= 767) {
                if ($('.category-slider').hasClass('off')) {
                    var owlActive = owl.owlCarousel(owlOptions);
                    owl.removeClass('off');
                }
            } else {
                if (!$('.category-slider').hasClass('off')) {
                    owl.addClass('off').trigger('destroy.owl.carousel');
                    owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
                }
            }
        });
    });
    if ($('.cat-slider').length) {
        $('.cat-slider').owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            loop: true,
            nav: true,
            smartSpeed: 500,
            autoHeight: true,
            autoplay: true,
            autoplayTimeout: 5000,
            navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
            responsive: {
                0: {
                    items: 2,
                    margin: 20
                },
                600: {
                    items: 3,
                    margin: 20
                },
                1024: {
                    items: 5,
                    margin: 30
                },
            }
        });
    }
    if ($('.event-slider-two').length) {
        $('.event-slider-two').owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            loop: true,
            nav: true,
            smartSpeed: 500,
            autoHeight: true,
            autoplay: true,
            autoplayTimeout: 5000,
            navText: ['', ''],
            responsive: {
                0: {
                    items: 2,
                    margin: 20,
                    dots: true,
                    // navText: ['<span class="fa fa-angle-left">', '<span class="fa fa-angle-right">'],
                },
                600: {
                    items: 3,
                    margin: 20
                },
                1024: {
                    items: 5,
                    margin: 30
                },
            }
        });
    }

    $("#myBtn").click(function() {
        var kkk = $(this).text();

        if (kkk == "Read More") {
            $("#myBtn").text("Read Less");
        } else {
            $("#myBtn").text("Read More");
        }
        $("#more").slideToggle(500);
    });


    $(".search-box-btn").click(function() {
        $(".search-box-btn").addClass('show');
        $("#search").slideToggle(500);
    });
})(window.jQuery);
// sticky share bar

// window.addEventListener('scroll', () => {
//    const navbar = document.querySelector('.like-share')      

//    navbar.classList[window.scrollY > 50 ? 'add' : 'remove']('hide')

// });
// var lastScrollTop = 0;
// $(window).scroll(function() {
//     var st = $(this).scrollTop();
//     var banner = $('.like-share');
//     setTimeout(function() {
//         if (st > lastScrollTop) {
//             banner.addClass('hide');
//         } else {
//             banner.removeClass('hide');
//         }
//         lastScrollTop = st;
//     }, 100);
// });
// price range slider
const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
let priceGap = 1000;

priceInput.forEach(input => {
    input.addEventListener("input", e => {
        let minPrice = parseInt(priceInput[0].value),
            maxPrice = parseInt(priceInput[1].value);

        if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            } else {
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});
// sidenav
function openNav() {
    document.getElementById("mySidenav").style.right = "0px";
   document.body.classList.add('sideopen');
}

function closeNav() {
    document.getElementById("mySidenav").style.right = "-300px";
    document.body.classList.remove('sideopen');
     document.body.style.width="0;"
}
