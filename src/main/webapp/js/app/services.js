'use strict';

angular.module('todoService', ['ngResource']).
        factory('Todo', function ($resource) {
            return $resource('rest/todo/:id', {}, {
                'save': {method:'PUT'}
            });
        });


(function() {
	'use strict';

	angular
			.module("template/accordion/accordion-group.html", [])
			.run(
					[
							"$templateCache",
							function($templateCache) {
								$templateCache
										.put(
												"template/accordion/accordion-group.html",
												"<div class=\"panel panel-default\">\n"
														+ "  <div class=\"panel-heading\">\n"
														+ "    <h4 class=\"panel-title\">\n"
														+ "      <a class=\"accordion-toggle\" ng-class=\"{'collapsed': isOpen}\" ng-click=\"isOpen = !isOpen\" accordion-transclude=\"heading\">{{heading}}</a>\n"
														+ "    </h4>\n" + "  </div>\n" + "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n"
														+ "	  <div class=\"panel-body\" ng-transclude></div>\n" + "  </div>\n" + "</div>");
							} ]);

	/*
	 * Declaration de l'application
	 */
	var swiperGuide;
	var app = angular.module('sl3App', [ 'sl3.accueil', 'sl3.login', 'sl3.navigation', 'sl3.ameliorer', 'sl3.comprendre', 'sl3.conseils',
			'sl3.guides', 'sl3.parcours', 'sl3.preparer', 'sl3.quizz', 'sl3.situation', 'sl3.systeme', 'sl3.guides.gip', 'restangular', 'ui.router', 'ui.bootstrap',
			'ui.bootstrap.accordion', 'ngTouch', 'ngRoute', 'ngAnimate', 'LocalStorageModule', 'partageDonnee', 'config', 'templates-main'], function() {

		// $locationProvider.html5Mode(true);

	});


	angular.element(document).ready(function() {
		var initInjector = angular.injector([ 'ng' ]);
		var $http = initInjector.get('$http');
		$http.get('rest/parametres').then(function(response) {
			var parametres = response.data;
			angular.module('config', []).constant('PARAMETRES', parametres);
			new Webtrends.dcs().init({
			dcsid : parametres.idDsc,
				domain : parametres.serverDsc,
				timezone : 0,
				i18n : true
			}).track();
			angular.bootstrap(document, [ 'sl3App' ]);
		});
	});

	/*
	 * Lancement de l'application
	 */
	app
			.run(['$rootScope',function($rootScope) {
				$rootScope.updateSwiper = function() {
					mySwiper.reInit();
				};
			}])

			/*
			 * Configuration de l'application Definition de routes avec
			 * ui-router
			 */
			.config(['$urlRouterProvider','$locationProvider','RestangularProvider',
			         function($urlRouterProvider, $locationProvider, RestangularProvider) {
				/*
				 * Url de base pour restangular
				 */
				RestangularProvider.setBaseUrl('rest');
				/*
				 * On met en cache les requests on met en commentaire le temps
				 * du developpement
				 */
//				RestangularProvider.setDefaultHttpFields({cache : true});
				//
				// state par defaut
				$urlRouterProvider.otherwise("/accueil");

			}])

			/*
			 * Controller principal de l'application
			 */
			.controller(
					'AppController',
					['Restangular','$window','$scope','$rootScope','$routeParams','$location', 'localStorageService','$state','$modal','partageDonneeService','PARAMETRES','$anchorScroll',
					function AppController(Restangular, $window, $scope, $rootScope, $routeParams, $location, localStorageService, $state,$modal, partageDonneeService, PARAMETRES,$anchorScroll) {
						$rootScope.$state = $state;
						$rootScope.modeSaisie = PARAMETRES.modeSaisie;
						$scope.modeSaisie = function() {
							return PARAMETRES.modeSaisie;
						};

						$scope.reinitProfil = function() {
							localStorageService.remove('sl3.profil');
							$state.go('navigation.profil');
						};

						$scope.profilToggleDrop = function() {
							jQuery(".infosProfil").toggleClass("dropped");
							jQuery(".infosProfilNull").toggleClass("dropped");
							jQuery(".dropInfosProfil").toggleClass("dropped");
							jQuery(".textInfosProfil").toggleClass("dropped");
						};

						$scope.afficherAlerte = function(ref) {
							var ModalInstanceCtrl = function($scope, $modalInstance) {
								$scope.oui = function() {
									var a = document.createElement('a');
									a.href=ref;
									a.target = '_blank';
									document.body.appendChild(a);
									a.click();
									$modalInstance.close();
								};

								$scope.non = function() {
									$modalInstance.dismiss('cancel');
								};
							};

							var modalInstance = $modal
									.open({
										template : '<div class="modal-content"><div class="modal-header">Attention</div><div class="modal-body">Vous allez accéder à un site qui n’est pas optimisé pour la navigation sur terminal mobile. Voulez vous continuez ?</div><div class="modal-footer"><button ng-click="oui()">Oui</button><button ng-click="non()">Non</button></div></div>',
										controller : ModalInstanceCtrl,
										resolve : {
											items : function() {
												return $scope.items;
											}
										}
									});

							modalInstance.result.then(function() {
							}, function() {
							});
						};

						$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
							jQuery('#paperContent').unblock();
							jQuery('#paperContent').block({
								message : '<img  src="resources/src/assets/img/ajax-loader-easytube-gallery.gif" />',
								css : {
									backgroundColor : 'transparent',
									border : 0
								},
								overlayCSS : {
									backgroundColor : '#D0D0D0',
									border : 0
								}
							});

							$rootScope.urlRetour =  fromState.name;

							if (!partageDonneeService.isAutorise() && toState.name != 'login' && PARAMETRES.connexion) {
								// on debranche sur le login
								event.preventDefault();
								$state.go('login');
							}
						});

						$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
							jQuery('#paperContent').unblock();
							/**
							 * A chaque changement de url appel de web
							 * trends pour les statistiques
							 */
							var uri = $location.path();
							dcsMultiTrack('DCS.dcsuri', uri, 'WT.ti', toState.name);
						});
					} ])

			/*
			 * Directive pour indiquer a un objet dom qu'il doit integrer un
			 * contenu a aller chercher dans le cms
			 */
			.directive('sl3Getcontenu',
					[ 'Restangular', 'localStorageService', '$timeout', '$compile', 'PARAMETRES', 'partageDonneeService', function(Restangular, localStorageService, $timeout, $compile, PARAMETRES, partageDonneeService) {
						var def = {
							replace : true,
							restrict : 'AE',
							link : function(scope, element, attrs) {
								var profil = "public";
								var profession = "non_coache";
								var tabProfil = localStorageService.get('sl3.profil');
								var block;
								if (tabProfil != null) {
									profil = tabProfil.profil;
									profession = tabProfil.profession;
								}
								if ((attrs.profil == profil && attrs.profession == profession) || attrs.profil == null || attrs.profession == null) {

									var contenus = Restangular.one('contenus', attrs.contenu);

									jQuery('#paperContent').block({
										message : '<img  src="resources/src/assets/img/ajax-loader-easytube-gallery.gif" />',
										css : {
											backgroundColor : 'transparent',
											border : 0
										},
										overlayCSS : {
											backgroundColor : '#D0D0D0',
											border : 0
										}
									});
									contenus.get().then(function(contenus) {
										if (PARAMETRES.modeSaisie) {
											if (partageDonneeService.isAfficherId()) {
												if (null == contenus.id_article || '' == contenus.id_article) {
													contenus.id_article = "non saisi";
												}
												jQuery("<span style='background: black;color: white;'>" + attrs.contenu + " </span>" + "<span style='background: black;color: white;'>id : " + contenus.id_article + "</span>").insertAfter(element);
											}
										}
										element.html(contenus.texte_article);
										$compile(element.contents())(scope);
										jQuery(".nontimeline ul br").replaceWith("");
										 $('.containerKplayer').on('mousedown touchstart MSPointerDown', function(e){
									           e.stopPropagation();
										});

										if (angular.element(element).hasClass("readmore")) {
											$timeout(function() {
												angular.element(element).readmore({
													speed : 150,
													maxHeight : 70,
													moreLink : '<a href="#">Lire la suite</a>',
													lessLink : '<a href="#">Réduire</a>'
												});
											}, 50);
										}
										if (angular.element(element).hasClass("readConseil")) {
											$timeout(function() {
												angular.element(element).readmore({
													speed : 150,
													maxHeight : 17,
													moreLink : '<a href="#">Lire la suite</a>',
													lessLink : '<a href="#">Réduire</a>'
												});
											}, 50);
										}
										jQuery('#paperContent').unblock();
									}, function errorCallback() {
										if (PARAMETRES.modeSaisie) {
											if (partageDonneeService.isAfficherId()) {
												jQuery("<span style='background: black;color: white;'>" + attrs.contenu + " </span>" + "<span style='background: black;color: white;'>id : non saisi</span>").insertAfter(element);
											}
										}
										if (angular.element(element).hasClass("readmore")) {
											$timeout(function() {
												angular.element(element).readmore({
													speed : 150,
													maxHeight : 70,
													moreLink : '<a href="#">Lire la suite</a>',
													lessLink : '<a href="#">Réduire</a>'
												});
											}, 50);
										}
										if (angular.element(element).hasClass("readConseil")) {
											$timeout(function() {
												angular.element(element).readmore({
													speed : 150,
													maxHeight : 17,
													moreLink : '<a href="#">Lire la suite</a>',
													lessLink : '<a href="#">Réduire</a>'
												});
											}, 50);
										}
										jQuery('#paperContent').unblock();
									});
								} else {
									element.replaceWith("");
								}
							}
						};
						return def;
					} ])
			.directive('sl3Scrollto',
					[ 'Restangular', 'localStorageService', '$timeout', '$compile', 'PARAMETRES', 'partageDonneeService',
					  function(Restangular, localStorageService, $timeout, $compile, PARAMETRES, partageDonneeService) {
						var def = {
							replace : true,
							restrict : 'AE',
							link : function(scope, element, attrs) {
								$timeout(function() {

									var tabProfil = localStorageService.get('sl3.profil');
									if (tabProfil != null && tabProfil.age != null ) {
											var age = tabProfil.age;
											var id ;
											if(age%5 == 0 && age > 35 && age < 62){
												id = age;
											}else if (age <= 35){
												id = 35 ;
											}else{
												while(age%5 !=0)
													age--;
												id = age;
											}

											var contenu1 = jQuery(".leftPostit");
											var contenu2 = contenu1[0].clientHeight;
											var contenu =	jQuery("#contenu").height();
											var titre = jQuery("#titreTimeline").height();
											// on calcul l'écart entre le debut de page et le début de la timeline
											var ecartBandeau =  contenu - contenu2 - titre ;

											// on récupère la position du titre en haut de page
											var el = jQuery("#" + id);
											var pos = el.position().top ;
											//calcul de la taille de la page
											var hauteurpage = jQuery("#scrollTo").height() ;
											var hauteurTitre = el[0].clientHeight ;
											var posNeg =  (pos+ ecartBandeau) - (hauteurpage - hauteurTitre) ;

											if(pos > hauteurpage){
											var swipes = scope.mySwiper;
											swipes.setWrapperTranslate(0, (-1 *posNeg) ,0);
											}
									}
								}, 1500);
							}
						};
						return def;
					} ])


				.directive('sl3Getvolet',
					[ 'Restangular', 'localStorageService', '$timeout', '$compile', 'PARAMETRES', 'partageDonneeService',
					  function(Restangular, localStorageService, $timeout, $compile, PARAMETRES, partageDonneeService) {
						var def = {
							replace : true,
							restrict : 'AE',
							link : function(scope, element, attrs) {
								var profil = "public";
								var profession = "non_coache";
								var tabProfil = localStorageService.get('sl3.profil');
								var block;
								if (tabProfil != null) {
									profil = tabProfil.profil;
									profession = tabProfil.profession;
								}
								if ((attrs.profil == profil && attrs.profession == profession) || attrs.profil == null || attrs.profession == null) {

											var contents = "" ;
											var volet    = Restangular.one('volet',attrs.contenu);
											volet.get().then(function(listId){

												for(var i = 0 ; i < listId.length ; i++){
														contents += '<accordion-group  heading="'+listId[i].titre_article+'" is-open="'+attrs.isopen+'">'
															+ '<div>'
															+ '<img ng-src="resources/src/assets/img/volet.png" style="float: left;" />'
															+  '<p>'+listId[i].texte_article+'</p>'
															+ '</div>'
															+ '</accordion-group>';
													}

													element.html(contents);
													$compile(element.contents())(scope);
													jQuery('#paperContent').unblock();

											});

											jQuery('#maVue').block({
												message : '<img  src="resources/src/assets/img/ajax-loader-easytube-gallery.gif" />',
												css : {
													backgroundColor : 'transparent',
													border : 0
												},
												overlayCSS : {
													backgroundColor : '#D0D0D0',
													border : 0
												}
											});

								} else {
									element.replaceWith("");
								}
							}
						};
						return def;
					} ])

			.directive('sl3Getpostit',
					[ 'Restangular', 'localStorageService', '$timeout', '$compile', 'PARAMETRES', 'partageDonneeService', function(Restangular, localStorageService, $timeout, $compile, PARAMETRES, partageDonneeService) {
						var def = {
							template : '<div class="postit"><h5>Le conseil du coach</h5><p id="contentPostit" class="readmore"></p></div>',
							replace : true,
							restrict : 'E',
							scope: {content: '='},
							compile : function(element, attrs) {
								var profil = "public";
								var profession = "non_coache";
								var tabProfil = localStorageService.get('sl3.profil');
								var block;
								if (tabProfil != null) {
									profil = tabProfil.profil;
									profession = tabProfil.profession;
								}
								if ((attrs.profil == profil && attrs.profession == profession) || attrs.profil == null || attrs.profession == null) {

									var contenus = Restangular.one('contenus', attrs.contenu);

									jQuery('#paperContent').block({
										message : '<img  src="resources/src/assets/img/ajax-loader-easytube-gallery.gif" />',
										css : {
											backgroundColor : 'transparent',
											border : 0
										},
										overlayCSS : {
											backgroundColor : '#D0D0D0',
											border : 0
										}
									});
									contenus.get().then(function(contenus) {
										if (PARAMETRES.modeSaisie) {
											if (partageDonneeService.isAfficherId()) {
												if (null == contenus.id_article || '' == contenus.id_article) {
													contenus.id_article = "non saisi";
												}
												jQuery("<span style='background: black;color: white;'>" + attrs.contenu + " </span>" + "<span style='background: black;color: white;'>id : " + contenus.id_article + "</span>").insertAfter(element);
											}
										}
										if (null == contenus.texte_article || contenus.texte_article.length == 0) {
											element.replaceWith("");
											jQuery('#paperContent').unblock();
										} else {
											angular.element('#contentPostit').html(contenus.texte_article);
							//				$timeout(function() {
												angular.element('#contentPostit').readmore({
													speed : 150,
													maxHeight : 70,
													moreLink : '<a href="#">Lire la suite</a>',
													lessLink : '<a href="#">Réduire</a>'
												});
							//				}, 10);
												jQuery('#paperContent').unblock();
										}
									}, function errorCallback() {
										if (PARAMETRES.modeSaisie) {
											if (partageDonneeService.isAfficherId()) {
												jQuery("<span style='background: black;color: white;'>" + attrs.contenu + " </span>" + "<span style='background: black;color: white;'>id : non saisi</span>").insertAfter(element);
											}
										}
										element.replaceWith("");
										jQuery('#paperContent').unblock();
									});
								} else {
									element.replaceWith("");
									jQuery('#paperContent').unblock();
								}
							},
							link : function(scope, element, attrs) {
								$compile(element.contents())(scope);
								jQuery('#paperContent').unblock();

							}
						};
						return def;
					} ])

			/**
			 * Directive permettant d'appliquer l'effet readmore
			 */
			.directive('readMoreconseil', [ '$timeout', function($timeout) {
				return function link(scope, element, attrs) {
					$timeout(function() {
						angular.element(element).readmore({
							speed : 150,
							maxHeight : 17,
							moreLink : '<a href="#">Lire la suite</a>',
							lessLink : '<a href="#">Réduire</a>'
						});

					}, 50);
				};
			} ])

						/**
			 * Directive permettant d'appliquer l'effet readmore
			 */
			.directive('textillate', [ '$timeout', function($timeout) {
				return function link(scope, element, attrs) {
					$timeout(function() {
						angular.element(element).textillate({
							  loop: true,
							  minDisplayTime: 2000,
							  initialDelay: 0,
							  autoStart: true,

						});
					}, 50);
				};
			} ])
			/**
			 * Directive permettant d'appliquer l'effet readmore
			 */
			.directive('readMore', [ '$timeout', function($timeout) {
				return function link(scope, element, attrs) {
					$timeout(function() {
						angular.element(element).readmore({
							speed : 150,
							maxHeight : 70,
							moreLink : '<a href="#">Lire la suite</a>',
							lessLink : '<a href="#">Réduire</a>'
						});
					}, 100);
				};
			} ])

			/**
			 * Directive permettant de fermer ou ouvrir la barre de menus via le bouton
			 */
			.directive('toggleSidenav', function() {
				return function link(elm) {
					jQuery(".burgerBtn").on('click', toggleClass);

					function toggleClass() {
						jQuery(".sidenav").toggleClass("expanded");
					}
				};
			})

			/**
			 * Directive permettant de fermer ou ouvrir la barre de menus
			 */
			.directive('sidenav', ['$timeout',function($timeout) {
				return function link(elm) {
					$timeout(function() {
					$(".contentnavli").on('click', toggleClass);
					function toggleClass() {
						jQuery(".sidenav").toggleClass("expanded");
						return false;
					}
					}, 100);
				};
			}])


			/**
			 * Directive permettant ouvrir une popup pour le détail d'un item d'une timeline
			 */
			.directive('coachtag',  ['$modal', '$compile', function($modal, $compile) {
						return function link(scope, elm, attrs) {
							elm.on('click', toggleClass);
							function toggleClass() {
								/*
								 * On ouvre le détail que si le texte n'est pas visible
								 */
								if (elm.context.firstElementChild.firstElementChild.clientWidth == 0) {
									scope.content = elm.context.firstElementChild.firstElementChild.innerHTML;
									var TimeLineInstanceCtrl = function($scope, $modalInstance) {
										$scope.close = function() {
											$modalInstance.dismiss('cancel');
										};
									};
									$modal.open({
												template : '<div class="modal-content"><div class="modal-body" ng-mouseup="close()" id="content-body">' + attrs.texte + '</div><div class="modal-footer"><button ng-click="close()" class="btn btn-warning" ng-click="cancel()">Fermer</button></div></div>',
												controller : TimeLineInstanceCtrl,
												windowClass : 'timelineContent-dialog',
												resolve : {
												}
											});
								}
							}
						};
					}])

			/**
			 * Directive permettant d'ouvrir ou fermer les infos du profil
			 */
			.directive('dropInfo', function() {
				return function link(elm) {
					jQuery(".dropInfosProfil").on('click', toggleClass);

					function toggleClass() {
						jQuery(".infosProfil").toggleClass("dropped");
					}
				};
			})

			/**
			 * Directive permettant d'ouvrir ou fermer les infos du profil
			 */
			.directive('pictureFill', ['$window', '$timeout', function($window, $timeout) {
				return function link(elm) {
					$timeout(function() {
						$window.picturefill();
					}, 5);
				};
			}])


			/*
			 * ==================================== Custom radio button et
			 * checkbox =====================================
			 */
			.directive('jqtransform', function() {
				return function link(elm) {
					jQuery('form').jqTransform({
						imgPath : 'jqtransformplugin/../../../img/'
					});
					jQuery('ng-form').jqTransform({
						imgPath : 'jqtransformplugin/../../../img/'
					});
				};
			})

	.directive('swipe', [ '$timeout',
		function($timeout) {
			var def = {
				restrict : 'A',
				link : function(scope, element, attrs) {
					$timeout(function() {
						scope.mySwiper = new Swiper('.swiper-container', {
							    scrollContainer:true,
							    mousewheelControl : true,
							    mode:'vertical',
							    freeMode: true,
							    freeModeFluid: true,
							    releaseFormElements: true,
							    resizeReInit: true,
							    noSwiping: true,
							    scrollbar: {
							      container :'.swiper-scrollbar',
							      hide: false,
							      draggable: true
							    }
							  });
						  }, 50);
					scope.oldHeight = $('#'+attrs.swipecontent).height();
					setInterval(function(){
						scope.height = $('#'+attrs.swipecontent).height();
						if (scope.height != scope.oldHeight) {
							scope.mySwiper.reInit(true);
							scope.mySwiper.resizeFix();
							scope.oldHeight = scope.height;
						}
					},300);
				}
			};
			return def;
		} ])

		.directive('swipeMain', [ '$timeout','$rootScope',
		function($timeout, $rootScope) {
			var def = {
				restrict : 'A',
				link : function(scope, element, attrs) {
					$timeout(function() {
						$rootScope.mySwiperMain = new Swiper('#swiper-container-main', {
							    scrollContainer:true,
							    mousewheelControl : true,
							    mode:'vertical',
							    releaseFormElements: true,
							    resizeReInit: true,
							    noSwiping: true,
							    scrollbar: {
							      container :'.swiper-scrollbar',
							      hide: true,
							      draggable: false
							    }
							  });
						  }, 10);
					$rootScope.oldHeightMain = $('#'+attrs.swipecontent).height();
					setInterval(function(){
						var el = $('#'+attrs.swipecontent);
						$rootScope.heightMain = $('#'+attrs.swipecontent).height();
						if ($rootScope.heightMain != $rootScope.oldHeightMain) {
							$rootScope.mySwiperMain.reInit(true);
							$rootScope.mySwiperMain.resizeFix();
							$rootScope.oldHeightMain = $rootScope.heightMain;
						}
					},50);
				}
			};
			return def;
		} ])

		/**
		 * Directive permettant de gérer les swipers
		 */
		.directive('swiper', [ '$timeout', function($timeout) {
			var def = {
				restrict : 'A',
				link : function(scope, element, attrs) {
					$timeout(function() {
						swiperGuide = jQuery('.swiper-nav').swiper({
						// pagination : '.pagination',
						});
					}, 1000);
				}
			};
			return def;
		} ])
		.directive('directiveguide', function() {
			return function(scope, element, attrs) {
				scope.$watch('$last', function(v, scope) {
					if (v) {
						var h = jQuery('.paperContent').height();
						jQuery('.swiper-container').height(h - 50);
						jQuery('.swiper-slide').height(h - 50);
						swiperGuide = $('.swiper-nav').swiper({
							pagination : '.pagination',
							paginationClickable: true
						});
						swiperGuide.reInit();
						swiperGuide.resizeFix();
					}
				});

			};
		})
})();