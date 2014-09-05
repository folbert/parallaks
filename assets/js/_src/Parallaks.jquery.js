/**
 * Based on Maxime Dantecs text at https://gist.github.com/Warry/4254579.
 */

(function ( $ ) {

  var transformCssAttribute = getTransformCssAttribute();

  // Detect request animation frame
  var scroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || false;

  var winScrollTop = -1;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var nrOfObjects;
  var injectedWrapperObjects = [];
  var injectedImgObjects = [];
  var settings;
  var originalObjects;
  var bodyPaddingTop = parseInt($('body').css('padding-top'));

  var animation;

  /**
   * [parallaks description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  $.fn.parallaks = function(options) {

    //bodyPaddingTop = bodyPaddingTop*2;

    settings = $.extend({
       doParallax: true
    }, options);

    var $firstObj = $(this).eq(0);

    originalObjects = this;
    nrOfObjects = originalObjects.length;

    // If request animation frame is not supported or window dont have pagYoffset or IE
    if(scroll === false || typeof window.pageYOffset == 'undefined') {
      settings.doParallax = false;
    }

    alert(settings.doParallax);

    // If we should do parallax effect
    if(settings.doParallax) {

      initParallaxObjects();

      setParallaksData();
      animation = scroll(loop);

      $(window).on('resize.parallaks', function() {
        setParallaksData();
      });

    } else { // Uncool browser

      $('body').addClass('no-parallaks');

      initUnCoolObjects();
      setUnCoolSize();

      $(window).on('resize.parallaks', function() {
        setUnCoolSize();
      });

    }

  };

  /**
   * [injectParallaxElms description]
   * @return {[type]} [description]
   */
  function initParallaxObjects() {

    var html = '';

    // For every original object that we have...
    originalObjects.each(function(index) {

      // ...create a new one which we will use for the parallax effect
      html += '<div class="parallaks-background-wrapper" id="parallaks-' + index + '"><img src="' + $(this).attr('data-imgsrc') + '" /></div>';

    });

    // Add the new HTML to the top of the <body>
    $('body').prepend(html);

    originalObjects.each(function(index) {

      var $this = $(this);

      var $wrapperElm = $('#parallaks-' + index);

      var originalWidth = $this.attr('data-parallaksoriginalwidth');
      var originalHeight = $this.attr('data-parallaksoriginalheight');

      var centerImg = (!$this.is("[data-parallakscenter]") || $this.attr('data-parallakscenter') == 'true');

      injectedWrapperObjects[index] = { el: $wrapperElm[0] };

      injectedImgObjects[index] = {
        el: $wrapperElm.find('img')[0],
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        imgRatio: originalWidth/originalHeight,
        center: centerImg
      };

    });

  }

  /**
   * [injectParallaxElms description]
   * @return {[type]} [description]
   */
  function initUnCoolObjects() {

    var html = '';

    originalObjects.each(function(index) {

      $(this).append('<img src="' + $(this).attr('data-imgsrc') + '" class="parallaks-background-wrapper--img" />');

      injectedImgObjects[index] = {el: $(this).find('img')[0] };

    });

  }

  // Detect css transform
  function getTransformCssAttribute() {

    var cssTransform;

    if(false && /MSIE (\d+\.\d+);/.test(navigator.userAgent)) {

      cssTransform = false;

    } else {

      var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' ');
      var i = 0;

      while( cssTransform === undefined ) {

        cssTransform = document.createElement('div').style[prefixes[i]] !== undefined ? prefixes[i] : undefined;
        i++;

      }

    }

    return cssTransform;

  }

  /**
   * [resizeImg description]
   * @return {[type]} [description]
   */
  function getImgSizeData(injectedImgObject, cool, windowHeight, windowWidth) {

    var requiredImgHeight = (cool ? windowHeight * 0.9 : windowHeight * 0.5);
    var newImgWidth = windowWidth;
    var newImgHeight = injectedImgObject.originalHeight * (newImgWidth/injectedImgObject.originalWidth);
    var positionX = 0;

    if(newImgHeight < requiredImgHeight) {

      newImgHeight = requiredImgHeight;
      newImgWidth = injectedImgObject.originalWidth * (newImgHeight/injectedImgObject.originalHeight);

    }

    if(injectedImgObject.center && newImgWidth > window.innerWidth) {

      positionX = parseInt((windowWidth - newImgWidth)/2);

    }

    return {
      newImgWidth: newImgWidth,
      newImgHeight: newImgHeight,
      positionX: positionX
    };

  }

  /**
   * Pre calculate sizes to get better perfs
   */
  function setParallaksData() {

    winScrollTop = -1; // Force a recalculation
    windowHeight = parseInt(window.innerHeight);
    windowWidth = parseInt(window.innerWidth);

    elementHeight = parseInt((windowHeight * 0.6));

    for (var i = 0; i<nrOfObjects; i++) {

      imgSizeData = getImgSizeData(injectedImgObjects[i], true, windowHeight, windowWidth);

      originalObjects[i].style.height = elementHeight + 'px';
      injectedWrapperObjects[i].el.style.height = elementHeight + 'px';

      // Reinit
      injectedWrapperObjects[i].el.style.display = "block";

      injectedWrapperObjects[i].height = elementHeight;
      injectedWrapperObjects[i].start = originalObjects[i].getBoundingClientRect().top + window.pageYOffset;
      injectedWrapperObjects[i].stop = injectedWrapperObjects[i].start + elementHeight;
      injectedWrapperObjects[i].speed = originalObjects[i].getAttribute('data-parallaksspeed');

      injectedImgObjects[i].el.style.width = imgSizeData.newImgWidth + 'px';
      injectedImgObjects[i].el.style.height = imgSizeData.newImgHeight + 'px';
      injectedImgObjects[i].positionX = imgSizeData.positionX;

      /**
       * DEBUG
       */
      injectedWrapperObjects[i].el.setAttribute('data-start', injectedWrapperObjects[i].start);
      injectedWrapperObjects[i].el.setAttribute('data-stop', injectedWrapperObjects[i].stop);
      injectedImgObjects[i].el.setAttribute('data-positionX', injectedImgObjects[i].positionX);

    }

  }

  /**
   * [setUnCoolSize description]
   */
  function setUnCoolSize() {

    // No need to resize if its only the hieght that has changed.
    // This also avoid calculations when scrolling on mobile devices.
    if(window.innerWidth != windowWidth) {

      imgSizeData = getImgSizeData(injectedImgObjects[i], false, windowHeight, windowWidth);
      windowHeight = parseInt(window.innerHeight);
      windowWidth = parseInt(window.innerWidth);

      for (var i =0; i<nrOfObjects; i++) {

        injectedImgObjects[i].el.style.width = imgSizeData.newImgWidth + 'px';
        injectedImgObjects[i].el.style.height = imgSizeData.newImgHeight + 'px';
        injectedImgObjects[i].el.style.left = parseInt(imgSizeData.positionX) + 'px';

      }

    }

  }

   /**
    * [setTop description]
    * @param {[type]} m [description]
    * @param {[type]} t [description]
    */
  function setPosition(el, x, y){

    el.style[transformCssAttribute] = "translate3d("+ x + "px, "+ y +"px,0)";

  }

  /**
   * [loop description]
   * @return {[type]} [description]
   */
  function loop() {

    // If we have not moved
    if (window.pageYOffset == winScrollTop) {

      scroll.call(window, loop);
      return false;

    } else {

      winScrollTop = window.pageYOffset;

    }

    for (var i =0; i<nrOfObjects; i++) {

      // Is the element visible right now?
      if ((winScrollTop >= injectedWrapperObjects[i].start - windowHeight && winScrollTop <= injectedWrapperObjects[i].stop)){

        if(injectedWrapperObjects[i].el.style.display != "block") {
          injectedWrapperObjects[i].el.style.display = "block";
        }

        if(injectedImgObjects[i].el.style.visibility != "visible") {
          injectedImgObjects[i].el.style.visibility = "visible";
        }

        setPosition(injectedWrapperObjects[i].el, 0, (originalObjects[i].offsetTop - bodyPaddingTop) - (winScrollTop));

        setPosition(injectedImgObjects[i].el, injectedImgObjects[i].positionX, (((originalObjects[i].offsetTop) - (winScrollTop))*injectedWrapperObjects[i].speed)*-1);

      } else if(injectedWrapperObjects[i].el.style.display != "none") {

        injectedWrapperObjects[i].el.style.display = "none";
        injectedImgObjects[i].el.style.visibility = "hidden";

      }

    }

    scroll.call(window, loop);

  }

}( jQuery ));