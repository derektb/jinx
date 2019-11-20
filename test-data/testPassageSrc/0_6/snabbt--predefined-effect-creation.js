
jinx.createEffect("fooBar",
  {
    fromScale: [0,0],
    fromOpacity: 0,
    fromRotation: [0, 2, -.5*Math.PI],

    scale: [1,1],
    opacity: 1,
    rotation: [0,0,0],

    duration: 1000,
    easing: "easeOut"
  }
);

jinx.effects.create("wibbleWobble",
  {
    fromScale: [1,1],
    fromOpacity: 1,
    fromRotation: [0,0,0],

    scale: [0,0],
    opacity: 0,
    rotation: [0, 2, -.5*Math.PI],

    duration: 1000,
    easing: "easeIn"
  }
);

p.addArtAssets(
  ['bg', '../numbers-loose/test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
  ['3', '../numbers300/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',  e: "fooBar"},
  {p: 'add',     a: '2',  l: 'L',  e: "fooBar"},
  {p: 'add',     a: '3',  l: 'L',  e: "fooBar"},
);

p.step.create(
  {p: 'remove',  a: '1',  l: 'L',  e: "wibbleWobble"},
  {p: 'remove',  a: '2',  l: 'L',  e: "wibbleWobble"},
  {p: 'remove',  a: '3',  l: 'L',  e: "wibbleWobble"},
);

p.destination.main = '[[->Start]]';
