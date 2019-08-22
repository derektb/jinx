p.addArtAssets(
  ['bg', '../numbers-loose/test-bg.png'],
  ['1', '../numbers-loose/1.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',  u: 500, d:200},
  {p: 'effect',  a: '1',  l: 'L',  u: 1000, d: 250, s: 'after', e: {
      position: [250,100],
      easing: jinx.getDefault('easing')
    }
  },
  {p: 'effect',  a: '1',  l: 'L',  u: 1000, d: 250, s: 'after', e: {
      position: [50,200],
      easing: jinx.getDefault('easing')
    }
  }
);

p.destination = { main: '[[->Start]]' };
