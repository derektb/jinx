p.art.path("../test-data/test-art")

p.art.assets(
  {name: 'bg', type: 'asset', useRoot: false, src: '/test-bg.png'},
  {name: '1', type: 'asset', useRoot: false, src: '/numbers300/1.png'},
  {name: '2', type: 'asset', useRoot: false, src: '/numbers300/2.png'},
  {name: '3', type: 'asset', useRoot: false, src: '/numbers300/3.png'},
  {name: '4', type: 'asset', useRoot: false, src: '/numbers300/4.png'},
  {name: '5', type: 'asset', useRoot: false, src: '/numbers300/5.png'}
);
p.art.layers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1', l: 'L', d: 400, u: 400},
  {p: 'add',     a: '2', l: 'L', d: 400, u: 400, sync: 'after'},
  {p: 'remove',  a: '1', l: 'L', d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '3', l: 'L', d: 400, u: 400, sync: 'after'},
  {p: 'add',     a: '4', l: 'L', d: 400, u: 400, sync: 'after'},
  {p: 'replace', a: '5', l: 'L', d: 400, u: 400, sync: 'after'}
);

p.destination.main = '[[->Start]]';
