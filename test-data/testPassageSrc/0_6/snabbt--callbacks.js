p.addArtAssets(
  ['bg', '../test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
  ['3', '../numbers300/3.png']
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200,
    e: twize.effects.extend('fadeIn', {
      start: function() {
        $(document).one('ended-playing-animation', p, function() {
          alert(p.name+" has finished its animation!");
        });
      }
    })
  },
  {p: 'add',     a: '1',  l: 'L',  d: 1000, u: 1000},
  {p: 'add',     a: '2',  l: 'L',  d: 1000, u: 1000, sync: 'after'},
  {p: 'remove',  a: '1',  l: 'L',  d: 1000, u: 1000, sync: 'after'},
  {p: 'replace', a: '3',  l: 'L',  d: 1000, u: 1000, sync: 'after'}
);

p.destination = { main: '[[->Start]]' };
