p.addArtAssets(
  ['bg', '../test-bg.png'],
  ['1', '../numbers300/1.png'],
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add', a: 'bg', l: 'bg'},
  {p: 'add',     a: '1',  l: 'L'},
);

p.destination.main = '[[->Start]]';
