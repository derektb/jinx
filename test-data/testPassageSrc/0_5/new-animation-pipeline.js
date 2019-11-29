p.art.path("..")

p.art.assets(
  ['bg', '/test-bg.png'],
  ['1',  '/numbers300/1.png'],
  ['2',  '/numbers300/2.png'],
  ['3',  '/numbers300/3.png'],
  ['4',  '/numbers300/4.png'],
  ['5',  '/numbers300/5.png']
);
p.art.layers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg',  l: 'bg',  u: 200},
  {p: 'add',     a: '1',   l: 'L',   d: 400, u: 400},
  {p: 'add',     a: '2',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'remove',  a: '1',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '3',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'add',     a: '4',   l: 'L',   d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '5',   l: 'L',   d: 400, u: 400, sync: 'after'}
);

p.destination.to("Start")
