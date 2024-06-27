/* -----------------------------------------------------------------------------

File:           JS Core
Version:        1.0
Author:         

-------------------------------------------------------------------------------- */
(function() {

	"use strict";

	var SaaSio = {
		init: function() {
			this.Basic.init();  
		},

		Basic: {
			init: function() {
				this.DiApreloader();
				this.BackgroundImage();
				this.Animation();
				this.DiaHeader();
				this.SkillProgress();
				this.DiaMobileMenu();
				this.DiaPortSlider();
				this.DiaTeamSlide();
				this.DiaTestimonial();
				this.DiaCounterUp();
				this.DiaScrollTop();
				this.DiaScrollImg();
				this.Eipreloader();
				this.EicounterUp();
				this.EiStickyMenu();
				this.EiscreenSlider();
				this.EiscrollTop();
				this.EiTeamSlide();
				this.EifaqBg();
				this.EiScroller();
				this.EiServiceSLider();
				this.EiTestimonialSlider();
				this.EiPartnerSlider();
				this.Pmpreloader();
				this.PmStickymenu();
				this.PmMobileMenu();
				this.PmScrollTop();
				this.PmPartnerSlider();
				this.PmcounterUp();
			},

			DiApreloader: function (){
				jQuery(window).on('load', function(){
					jQuery('#dia-preloader').fadeOut('slow',function(){jQuery(this).remove();});
				});
			},
			BackgroundImage: function (){
				$('[data-background]').each(function() {
					$(this).css('background-image', 'url('+ $(this).attr('data-background') + ')');
				});
				if($('.lightbox-image').length) {
					$('.lightbox-image').fancybox({
						openEffect  : 'fade',
						closeEffect : 'fade',
						helpers : {
							media : {}
						}
					});
				}
			},
			Animation: function (){
				if($('.wow').length){
					var wow = new WOW(
					{
						boxClass:     'wow',
						animateClass: 'animated',
						offset:       0,
						mobile:       true,
						live:         true
					}
					);
					wow.init();
				}
			},
			DiaHeader: function (){
				jQuery(window).on('scroll', function() {
					if (jQuery(window).scrollTop() > 100) {
						jQuery('.dia-main-header').addClass('dia-sticky-menu')
					} else {
						jQuery('.dia-main-header').removeClass('dia-sticky-menu')
					}
				})
				$('.dia-main-navigation ul li a').on("click", function(){
					if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
						var target = $(this.hash);
						target = target.length ? target : $('[name="DCSext.Level"' + this.hash.slice(1) +']');
						if (target.length) {
							$('html, body').animate({
								scrollTop: target.offset().top -100
							}, 1000);
							return false;
						}
					}
				});
			},
			SkillProgress: function (){
				if ($(".progress-bar").length) {
					var $progress_bar = $('.progress-bar');
					$progress_bar.appear();
					$(document.body).on('appear', '.progress-bar', function() {
						var current_item = $(this);
						if (!current_item.hasClass('appeared')) {
							var percent = current_item.data('percent');
							current_item.css('width', percent + '%').addClass('appeared').parent().append('<span>' + percent + '%' + '</span>');
						}
						
					});
				};
			},
			DiaMobileMenu: function (){
				$('.dia-open_mobile_menu').on("click", function() {
					$('.dia-mobile_menu_wrap').toggleClass("mobile_menu_on");
				});
				$('.dia-open_mobile_menu').on('click', function () {
					$('body').toggleClass('mobile_menu_overlay_on');
				});
				if($('.dia-mobile_menu li.dropdown ul').length){
					$('.dia-mobile_menu li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
					$('.dia-mobile_menu li.dropdown .dropdown-btn').on('click', function() {
						$(this).prev('ul').slideToggle(500);
					});
				}
			},
			DiaPortSlider: function (){
				$('#dia-portfolio-slider').owlCarousel({
					margin: 20,
					responsiveClass:true,
					nav: true,
					dots: false,
					loop:true,
					rtl: true,
					autoplay: false,
					navText:["<i class='fas fa-chevron-left'></i>","<i class='fas fa-chevron-right'></i>"],
					smartSpeed: 1000,
					responsive:{
						0:{
							items:1,
						},
						400:{
							items:1,
						},
						600:{
							items:2,
						},
						700:{
							items:2,
						},
						1000:{
							items:3,

						},
						1300:{
							items:4,

						},
						1600:{
							items:5,

						},
					},
				})
			},
			DiaTeamSlide: function (){
				$('#dia-team-slide').owlCarousel({
					margin:0,
					responsiveClass:true,
					nav: true,
					dots: false,
					loop:true,
					center:true,
					rtl: true,
					autoplay: false,
					navText:["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],
					smartSpeed: 1000,
					responsive:{
						0:{
							items:1,
						},
						400:{
							items:1,
						},
						600:{
							items:2,
						},
						700:{
							items:2,
						},
						1000:{
							items:3,

						}
					},
				})
			},
			DiaTestimonial: function (){
				$('ol.carousel-indicators2 li').on("click",function(){ 
					$('ol.carousel-indicators2 li.active').removeClass("active");
					$("ol.carousel-indicators li.active").removeClass("active");
					$(this).addClass("active");   
					var indicators = $(this).data("slide-to");
					$(".carousel-indicators").find("[data-slide-to='" + indicators + "']")
					.addClass("active");
				});
				$('.carousel').on('slid.bs.carousel', function() {
					var indicatorsAct = $(".carousel-indicators li.active").data("slide-to");
					$(".carousel-indicators2 li").removeClass("active");
					$(".carousel-indicators2").find("[data-slide-to='" + indicatorsAct + "']")
					.addClass("active");
				});
			},
			DiaCounterUp: function (){
				if ($(".odometer").length) {
					$('.odometer').appear();
					$(document.body).on('appear', '.odometer', function(e) {
						var odo = $(".odometer");
						odo.each(function() {
							var countNumber = $(this).attr("data-count");
							$(this).html(countNumber);
						});
						window.odometerOptions = {
							format: 'd',
						};
					});
				}
			},
			DiaScrollTop: function (){
				$(window).on("scroll", function() {
					if ($(this).scrollTop() > 200) {
						$('.dia-scrollup').fadeIn();
					} else {
						$('.dia-scrollup').fadeOut();
					}
				});

				$('.dia-scrollup').on("click", function()  {
					$("html, body").animate({
						scrollTop: 0
					}, 800);
					return false;
				});
			},
			DiaScrollImg: function (){
				(function($) {
					$.fn.visible = function(partial) {
						var $t            = $(this),
						$w            = $(window),
						viewTop       = $w.scrollTop(),
						viewBottom    = viewTop + $w.height(),
						_top          = $t.offset().top,
						_bottom       = _top + $t.height(),
						compareTop    = partial === true ? _bottom : _top,
						compareBottom = partial === true ? _top : _bottom;
						return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
					};
				})(jQuery);
				$(window).on('scroll', function() {

					$(".banner-img1, .banner-img2").each(function(i, el) {
						var el = $(el);
						if (el.visible(true)) {
							el.addClass("view-on"); 
						} else {
							el.removeClass("view-on");
						}
					});
				});
				$(document).on('ready', function() {
					$(".banner-img1, .banner-img2").each(function(i, el) {
						var el = $(el);
						if (el.visible(true)) {
							el.addClass("view-on"); 
						} else {
							el.removeClass("view-on");
						}
					});
				});
			},
			Eipreloader: function (){
				jQuery(window).on('load', function(){
					jQuery('#ei-preloader').fadeOut('slow',function(){jQuery(this).remove();});
				});
			},
			EiStickyMenu: function (){
				jQuery(window).on('scroll', function() {
					if (jQuery(window).scrollTop() > 100) {
						jQuery('.main-header-eight').addClass('eisticky-menu-bg-overlay ')
					} else {
						jQuery('.main-header-eight').removeClass('eisticky-menu-bg-overlay ')
					}
				})
				$('.navigation-eight a').on("click", function(){
					if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
						var target = $(this.hash);
						target = target.length ? target : $('[name="DCSext.Level"' + this.hash.slice(1) +']');
						if (target.length) {
							$('html, body').animate({
								scrollTop: target.offset().top -10
							}, 1000);
							return false;
						}
					}
				});
				$('.appi-ei-open_mobile_menu').on("click", function() {
					$('.appi-ei-mobile_menu_wrap').toggleClass("mobile_menu_on");
				});
				$('.appi-ei-open_mobile_menu').on('click', function () {
					$('body').toggleClass('mobile_menu_overlay_on');
				});
				if($('.appi-ei-mobile_menu li.dropdown ul').length){
					$('.appi-ei-mobile_menu li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
					$('.appi-ei-mobile_menu li.dropdown .dropdown-btn').on('click', function() {
						$(this).prev('ul').slideToggle(500);
					});
				}				
			},
			EicounterUp: function (){
				if ($(".odometer").length) {
					$('.odometer').appear();
					$(document.body).on('appear', '.odometer', function(e) {
						var odo = $(".odometer");
						odo.each(function() {
							var countNumber = $(this).attr("data-count");
							$(this).html(countNumber);
						});
						window.odometerOptions = {
							format: 'd',
						};
					});
				}
			},
			EiscreenSlider: function (){
				if ($('.ei-appScreenshotCarousel-container').length) {
					if ($('.ei-appScreenshotCarousel-container').length) {
						var swiper = new Swiper('.ei-appScreenshotCarousel-container', {
							effect: 'coverflow',
							loop: true,
							centeredSlides: true,
							slidesPerView: 4,
							initialSlide: 4,
							keyboardControl: true,
							mousewheelControl: false,
							lazyLoading: true,
							preventClicks: false,
							preventClicksPropagation: false,
							lazyLoadingInPrevNext: true,
							nextButton: '.swiper-button-next',
							prevButton: '.swiper-button-prev',
							coverflow: {
								rotate: 0,
								stretch: 0,
								depth: 250,
								modifier: .5,
								slideShadows: false,
							},
							breakpoints: {
								1199: {
									slidesPerView: 3,
									spaceBetween: 30,
								},
								991: {
									slidesPerView: 3,
									spaceBetween: 10,
								},
								767: {
									slidesPerView: 2,
									spaceBetween: 10,
								},
								575: {
									slidesPerView: 1,
									spaceBetween: 5,
								}
							}
						});

					}
				}
			},
			EiscrollTop: function (){
				$(window).on("scroll", function() {
					if ($(this).scrollTop() > 200) {
						$('.ei-scrollup').fadeIn();
					} else {
						$('.ei-scrollup').fadeOut();
					}
				});

				$('.ei-scrollup').on("click", function()  {
					$("html, body").animate({
						scrollTop: 0
					}, 800);
					return false;
				});
			},
			EiTeamSlide: function (){
				$('#ei-team-slide').owlCarousel({
					margin:0,
					responsiveClass:true,
					nav: true,
					dots: false,
					loop:true,
					rtl: true,
					center:true,
					autoplay: false,
					navText:["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],
					smartSpeed: 1000,
					responsive:{
						0:{
							items:1,
						},
						400:{
							items:1,
						},
						600:{
							items:2,
						},
						700:{
							items:2,
						},
						1000:{
							items:3,

						}
					},
				})
			},
			EifaqBg: function (){
				$(document).on('click', '.ei-faq', function(){
					$(this).addClass('faq_bg').siblings().removeClass('faq_bg')
				}) 	
			},
			EiScroller: function (){
				$(window).on("load",function(){
					$("#how-workscrollbar").mCustomScrollbar({
						autoHideScrollbar:true,
					});
				});
			},
			EiServiceSLider: function (){
				if($('.ei-service-slide').length){
					var customPagerSlider = $(".ei-service-slide").bxSlider({
						adaptiveHeight: true,
						controls: true,
						pause: 5000,
						speed: 1000,
						rtl: true,
						nextText: '<span class="control-icon fa fa-angle-right"></span>',
						prevText: '<span class="control-icon fa fa-angle-left"></span>',
						pagerCustom: '#banner-pager',
					});
				}
			},
			EiTestimonialSlider: function (){
				$('#testimonial-scroller').owlCarousel({
					margin: 105,
					responsiveClass:true,
					nav: false,
					dots: true,
					rtl: true,
					autoplay: false,
					smartSpeed: 1000,
					responsive:{
						0:{
							items:1,
						},
						400:{
							items:1,
						},
						600:{
							items:1,
						},
						700:{
							items:1,
						},
						1000:{
							items:2,

						}
					},
				})
			},
			EiPartnerSlider: function (){
				$('#ei-partner-slide').owlCarousel({
					margin: 105,
					autoplay: true,
					loop: true,
					rtl: true,
					responsiveClass:true,
					nav: false,
					dots: false,
					slideTransition:'linear',
					autoplayTimeout: 10,
					autoplayHoverPause:false,
					autoplaySpeed:4500,
					responsive:{
						0:{
							items:2,
						},
						400:{
							items:3,
						},
						600:{
							items:4,
						},
						700:{
							items:4,
						},
						1000:{
							items:4,

						}
					},
				})
			},
			Pmpreloader: function (){
				jQuery(window).on('load', function(){
					jQuery('#pm-preloader').fadeOut('slow',function(){jQuery(this).remove();});
				});
				$(document).on('click', '.pm-blog-img-text', function(){
					$(this).addClass('active').siblings().removeClass('active')
				}) 
			},
			PmStickymenu: function (){
				jQuery(window).on('scroll', function() {
					if (jQuery(window).scrollTop() > 100) {
						jQuery('.pm-main-header').addClass('pm-sticky-menu')
					} else {
						jQuery('.pm-main-header').removeClass('pm-sticky-menu')
					}
				})
			},
			PmMobileMenu: function (){
				$('.pm-open_mobile_menu').on("click", function() {
					$('.pm-mobile_menu_wrap').toggleClass("mobile_menu_on");
				});
				$('.pm-open_mobile_menu').on('click', function () {
					$('body').toggleClass('mobile_menu_overlay_on');
				});
				if($('.pm-mobile_menu li.dropdown ul').length){
					$('.pm-mobile_menu li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
					$('.pm-mobile_menu li.dropdown .dropdown-btn').on('click', function() {
						$(this).prev('ul').slideToggle(500);
					});
				}
			},
			PmScrollTop: function (){
				$(window).on("scroll", function() {
					if ($(this).scrollTop() > 200) {
						$('.pm-scrollup').fadeIn();
					} else {
						$('.pm-scrollup').fadeOut();
					}
				});

				$('.pm-scrollup').on("click", function()  {
					$("html, body").animate({
						scrollTop: 0
					}, 800);
					return false;
				});
			},
			PmPartnerSlider: function (){
				$('#pm-partner-slide').owlCarousel({
					margin: 90,
					autoplay: true,
					loop: true,
					responsiveClass:true,
					nav: false,
					dots: false,
					rtl: true,
					slideTransition:'linear',
					autoplayTimeout: 10,
					autoplayHoverPause:false,
					autoplaySpeed:4500,
					responsive:{
						0:{
							items:1,
						},
						400:{
							items:1,
						},
						600:{
							items:2,
						},
						700:{
							items:3,
						},
						1000:{
							items:4,

						}
					},
				})
			},
			PmcounterUp: function (){
				if ($(".odometer").length) {
					$('.odometer').appear();
					$(document.body).on('appear', '.odometer', function(e) {
						var odo = $(".odometer");
						odo.each(function() {
							var countNumber = $(this).attr("data-count");
							$(this).html(countNumber);
						});
						window.odometerOptions = {
							format: 'd',
						};
					});
				}
			},

/* End Of js
================================================*/
}
}
jQuery(document).ready(function (){
	SaaSio.init();
});

})();