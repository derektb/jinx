p.addArtAssets(
  ['bg', '../numbers-loose/test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
  ['3', '../numbers300/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',  e: "fadeIn", d: 500, s: "after"},
  {p: 'add',     a: '2',  l: 'L',  e: "fadeIn", d: 1000, s: "with"},
  {p: 'add',     a: '3',  l: 'L',  e: "fadeIn", d: 2000, s: "with"},
);

p.step.create(
  {p: 'remove',  a: '1',  l: 'L', d: 500, e: "fadeOut"},
  {p: 'remove',  a: '2',  l: 'L', d: 1000, e: "fadeOut", s: "with"},
  {p: 'remove',  a: '3',  l: 'L', d: 2000, e: "fadeOut", s: "with"},
);

p.destination.main = '[[->Start]]';
