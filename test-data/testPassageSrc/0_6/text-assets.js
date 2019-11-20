p.art.path("../numbers300/")

const STYLES_ID = 'text-assets-styles';
if (!document.getElementById(STYLES_ID)) {
  var textStyle = document.createElement('style');
  textStyle.innerHTML = ".passage--text-assets .layer.text .asset{padding:10px;background-color:white;line-height: 1}";
  $('body').append(textStyle)
}

p.addArtAssets(
  {
    name: 'bg',
    src: '../test-bg.png',
    path: false
  },
  {
    name: 'text1',
    type: 'text',
    text: "This text's width is set.",
    size: [270,0]
  },
  {
    name: 'text2',
    type: 'text',
    text: "This text's width and height are set.",
    size: [125,120]
  },
  {
    name: 'text3',
    type: 'text',
    text: "This<br>Text's<br>height<br>is<br>set.",
    size: [0,120]
  }
);
p.addLayers('bg', 'text');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: 'text1',  l: 'text',  u: 200, xy: [5,5]}
);
p.step.create(
  {p: 'add',     a: 'text2',  l: 'text',  u: 200, xy: [5,155]}
);
p.step.create(
  {p: 'add',     a: 'text3',  l: 'text',  u: 200, xy: [155,155]}
);

p.destination.main = '[[->Start]]';
