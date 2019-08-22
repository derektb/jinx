// window.jinx.__settings.rootArtPath = 'numbers300/';

p.addArtAssets(
  {name: 'bg', type: 'asset', useRoot: false, src: 'test-art/test-bg.png'},
  {name: '1', type: 'asset', useRoot: false, src: 'test-art/numbers300/1.png'},
  {name: '2', type: 'asset', useRoot: false, src: 'test-art/numbers300/2.png'},
  {name: '3', type: 'asset', useRoot: false, src: 'test-art/numbers300/3.png'},
  {name: '4', type: 'asset', useRoot: false, src: 'test-art/numbers300/4.png'},
  {name: '5', type: 'asset', useRoot: false, src: 'test-art/numbers300/5.png'}
);
p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1', l: 'L', d: 1000, u: 1000},
  {p: 'add',     a: '2', l: 'L', d: 1000, u: 1000, sync: 'after'},
  {p: 'remove',  a: '1', l: 'L', d: 1000, u: 1000, sync: 'after'},
  {p: 'replace', a: '3', l: 'L', d: 1000, u: 1000, sync: 'after'},
  {p: 'add',     a: '4', l: 'L', d: 1000, u: 1000, sync: 'after'},
  {p: 'replace', a: '5', l: 'L', d: 1000, u: 1000, sync: 'after'}
);

p.destination = { main: '[[->Start]]' };
