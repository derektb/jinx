p.art.path("../numbers300/")

p.addArtAssets(
  {
    name: 'bg',
    src: '../test-bg.png',
    path: false
  },
  ['1', '1.png'],
  ['2', '2.png'],
  ['3', '3.png'],
  ['4', '4.png'],
  ['5', '5.png']
);
p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg',  l: 'bg',  u: 200},
  {p: 'add',     a: '1',   l: 'L',   d: 400, u: 400},
  {p: 'add',     a: '2',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'remove',  a: '1',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '3',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'add',     a: '4',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '5',   l: 'L',   d: 400, u: 400, sync: 'after'}
);

p.destination = { main: '[[->Start]]' };
