p.addArtAssets(
  ['bg', '../numbers-loose/test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
  ['3', '../numbers300/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',  e: "fadeOut"},
  {p: 'add',     a: '2',  l: 'L',  e: "fadeOut", s: "with"},
  {p: 'add',     a: '3',  l: 'L',  e: "fadeOut", s: "with"}
);

p.step.create(
  {p: 'remove',  a: '1',  l: 'L',  e: "fadeIn"},
  {p: 'remove',  a: '2',  l: 'L',  e: "fadeIn", s: "with"},
  {p: 'remove',  a: '3',  l: 'L',  e: "fadeIn", s: "with"}
);

p.destination = { main: '[[->Start]]' };
