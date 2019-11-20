jinx.effects.extend("fadeIn", "dropIn", {
  fromPosition: [0,-50],
  position: [0,0]
})

p.addArtAssets(
  ['bg', '../numbers-loose/test-bg.png'],
  ['1', '../numbers-loose/1.png'],
  ['2', '../numbers-loose/2.png'],
  ['3', '../numbers-loose/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',  d: 500, u: 500, sync: 'after',
    xy: [200,0],
    e: "dropIn"
  },
  {p: 'add',     a: '2',  l: 'L',  d: 300, u: 500, sync: 'with',
    xy: [100,100],
    e: "dropIn"
  },
  {p: 'add',     a: '3',  l: 'L',  d: 300, u: 500, sync: 'with',
    xy: [0,200],
    e: "dropIn"
  }
);

p.destination.main = '[[->Start]]';
