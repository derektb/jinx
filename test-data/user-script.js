console.log('User JavaScript is working.');

window.story.state.rootArtPath = "test-art/frames/";
jinx.setup({
  rootArtPath: "../test-data/test-art/frames/"
});
jinx.debug();

var hideLayers = window.hideLayers = function hideLayers() {
  var images = document.querySelectorAll(".panel .layer img, .css-border")
  snabbt(document.querySelector('.panel'), {rotation: [0,0,0], easing: function easeOutCubic(t) { return 1+(--t)*t*t }, duration: 250});

  snabbt(images, {position: [0,0,0],
    easing: function easeOutCubic(t) { return 1+(--t)*t*t },
    duration: 300, delay: 50, complete: function(){
      $('#passages').removeClass("__show-layers");
    }});
}

var showLayers = window.showLayers = function showLayers(){
  var images = document.querySelectorAll(".panel .layer img, .css-border")
  $('#passages').addClass("__show-layers");
  snabbt(images, {fromPosition: [0,0,0], position: function(i, total){
  var val = (i-(total/2))*30;
  return [0, 0, val];
  },
  easing: function easeOutCubic(t) { return 1+(--t)*t*t },
  duration: 300, delay: 50});

  snabbt(document.querySelector('.panel'), {
    fromRotation: [0,0,0],
    rotation: [-1.2,0.5,0],
    easing: function easeOutCubic(t) { return 1+(--t)*t*t },
    duration: 250,
  });
}
