p.addArtAssets(
  ['bg', '../test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
  ['3', '../numbers300/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add', a: 'bg', l: 'bg'},
  {p: 'add',     a: '1',  l: 'L'},
  {p: 'add',     a: '2',  l: 'L'});

p.step.create(
  {p: 'remove',     a: '1',  l: 'L'},
  {p: 'remove',     a: '2',  l: 'L'});

p.destination = { main: '[[->Start]]' };
