p.art.path("../numbers300/")

if (s.livePanelTestControl) {
  s.livePanelTestControl++;
} else {
  s.livePanelTestControl = 1;
}

p.addArtAssets(
  {
    name: 'bg',
    src: '../test-bg.png',
    path: false
  },
  {
    name: 'text1',
    type: 'text',
    text: `This is a live panel, which re-panelizes each time this passage is displayed.  This panel has been panelized ${s.livePanelTestControl} times!`,
    size: [270,0]
  },
);
p.addLayers('bg', 'text');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: 'text1',  l: 'text',  u: 200, xy: [5,5]}
);

p.destination = { main: '[[->Start]]' };
