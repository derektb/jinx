
twize.effects.create("fizzBuzz",
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

twize.effects.extend("fizzBuzz",
  "zipZop", // including a name will also save it to the list of effects
  {
    fromScale: [5,5],
    duration: 2000,
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
  {p: 'add',     a: '1',  l: 'L',  e: "fizzBuzz"},
  {p: 'add',     a: '2',  l: 'L',  e: "zipZop"},
  {p: 'remove',  a: '1',  l: 'L',  e: twize.effects.extend('fadeOut', { fromScale: [1,1], scale: [.8,.8], duration: 1000 }), s: 'after' } // not including a name will just extend and return a hash
);

p.destination = { main: '[[->Start]]' };
