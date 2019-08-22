p.addArtAssets(
  ['bg', '../test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',
   u: 1000,
   e: {
     fromScale: [0,0],
     toScale: [1,1],
     fromOpacity: 0,
     opacity: 1,
     easing: "easeOut"
   }
  },
  {p: 'add',     a: '2',  l: 'L',
   d: 500, u: 1000, s: 'with',
   e: {
     fromScale: [2,2],
     scale: [1,1],
     fromOpacity: 0,
     opacity: 1,
     easing: "easeOut"
   }
  }
);

p.step.create(
  {p: 'remove',     a: '1',  l: 'L',
   u: 1000,
   e: {
     fromPosition: [0,0,0],
     fromOpacity: 1,
     position: [0,150,0],
     opacity: 0,

     easing: 'spring',
     springConstant: 0.3,
     springDeceleration: 0.8,
   }
  },
  {p: 'remove',     a: '2',  l: 'L',
   d: 500, u: 1000, s: "with",
   e: {
     fromPosition: [0,0,0],
     fromOpacity: 1,
     position: [150,0,0],
     opacity: 0,

     easing: 'spring',
     springConstant: 0.3,
     springDeceleration: 0.8,
   }
  }
);

p.destination = { main: '[[->Start]]' };
