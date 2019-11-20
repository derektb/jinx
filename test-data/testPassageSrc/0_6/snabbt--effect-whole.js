p.addArtAssets(
  ['bg', '../test-bg.png'],
  ['1', '../numbers300/1.png'],
  ['2', '../numbers300/2.png'],
);

p.addLayers('bg', 'L', 'css-border');

p.step.create(
  {p: 'add',     a: 'bg', l: 'bg', u: 200},
  {p: 'add',     a: '1',  l: 'L',
   e: {
     fromOpacity: 0,
     opacity: 1,
     duration: 1000,
     easing: function(v){
       return .5-(.5*Math.cos((Math.PI/2*18)*v*v));
     }
   }
  },
  {p: 'add',     a: '2',  l: 'L',
   e: {
     fromOpacity: 0,
     opacity: 1,
     duration: 5000,
     delay: 1000,
     easing: function(v){
       return .5-(.5*Math.cos((Math.PI/2*18)*v*v));
     }
   }
  },
);

p.destination.main = '[[->Start]]';
