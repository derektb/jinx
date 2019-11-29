window.jinx.setDefaults({duration:150})

p.addArtAssets(
  ['bga','background/background-1.png'],
  ['1-char', '1/character.png'],
  ['1-sp', '1/speech.png'],

  ['2-char', '2/character.png'],
  ['2-effect', '2/effect.png'],
  ['2-sp', '2/speech.png']
);

p.addLayers('bg', 'char', 'speech', 'css-border')

p.step.create({a: 'bga', l: 'bg', delay: 100},
  {a: '1-char', l: 'char', delay: 100},
  {a: '1-sp', l: 'speech', s: 'after', d: 200, duration: 600});
p.step.create({p: 'remove', l: 'speech', duration: 500},
  {a: '2-effect', l: 'speech', s: 'after', d: 200},
  {a: '2-char', l: 'char', p: 'replace', s: 'after', d: 300, duration: 400},
  {a: '2-sp', l: 'speech', sync: 'with', delay: 200})

p.destination.to("Start"); // jinx 0.7 refactor
