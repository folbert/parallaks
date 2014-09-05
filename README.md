#Parallaks

jQuery plugin for creating basic parallax effects.

##How to use

JavaScript: Include either `:assets/js/Parallaks.jquery.js` or `:Parallaks.jquery.min.js` in your page.

CSS: Include `:parallaks.min.css`.

Add the following code where you want the parallax items to appear on your site:

`<div class="parallaks-item" data-imgsrc="http://lorempixel.com/1600/800/sports/5" data-originalwidth="1600" data-originalheight="800" data-parallaksspeed="0.6"></div>`

The class "parallaks-item" aside, you must change the attributes so it matches your data:

- `data-imgsrc`: The image you want to use.
- `data-originalwidth`: The width of the image.
- `data-originalheight`: The height of the image.
- `data-parallakscenter`: Set to false in case you dont want the image to center vertically if the window becomes smaller than the image. If you don't set this attribute or set it to true, centering will .
- `data-parallaksspeed`: **not implemented yet**.

Initiate the plugin using

`$('.parallaks-item').parallaks({
  doParallax: true
});`

Available options:

- `doParallax`: Whether the plugin should create parallax effect or just produce static images. This can come in handy of you detect that you for example is running a device that you dont want to run the parallax effect on.
