// --- Art ---
jinx.setDefaults({duration: 400})

p.addArtAssets(
  ["bg-1", "background/background-1.png"],
  ["1-char", "1/character.png"],
  ["1-sp", "1/speech.png"],
  ["2-char", "2/character.png"],
  ["2-effect", "2/effect.png"],
  ["2-sp", "2/speech.png"],
  ["3-char", "3/character.png"],
  ["3-sp-1", "3/speech-1.png"],
  ["3-sp-2", "3/speech-2.png"],
  ["bg-2", "background/background-2.png"],
  ["4-char", "4/character.png"],
  ["4-sp-1", "4/speech-1.png"],
  ["4-sp-2", "4/speech-2.png"],
  ["4-sp-3", "4/speech-3.png"]
);

// --- Layers ---
p.addLayers("bg", "char", "speech", "css-border");

// --- Sequence ---
// [1]
p.step.create(
  {a: "bg-1", l: "bg", u: 300},
  {a: "1-char", l: "char", u: 500},
  {a:"1-sp", l:"speech", f:"stop", d: 250, u: 500});
// [2]
p.step.create(
  {a:"1-sp", l:"speech", p: "remove", u: 600},
  {a:"2-effect", l:"speech", s: 'after', d: 300, u: 200},
  {a: "2-char", l: "char", p: 'replace', d:550, s:'after', u: 300},
  {a:"2-sp", l:"speech", p:"add", d: 175, u: 200, f:"stop"});
// [3]
p.step.create(
  {p:'remove',a:'2-sp',l:'speech', u: 300},
  {p:'remove',a:'2-effect',l:'speech', u:300, d:75},
  {a: 'bg-2', l: 'bg', u: 400},
  { a:'2-char', l:'char', d: 200, u: 300},
  {a:'3-char', l:'char', p: 'replace', s:'after', d: 200, u: 400},
  {a: '3-sp-1', l:'speech', d: 200, u: 300, f: 'stop'})
// @
p.step.create({a: '3-sp-2', l:'speech', f:'stop', u: 400})
// [4]
p.step.create(
  {p:'remove',a:'3-sp-2',l:'speech', u: 300},
  {p:'remove',a:'3-sp-1',l:'speech', u:300, d:75},
  {a:'4-char',l:'char',p:'replace', u:300, d:600},
  {a: '4-sp-1', l: 'speech', u: 750, d: 800, flow: 'stop'}
);

p.seq.addSeqel("4-sp-2", "speech", "stop");
// @
p.seq.addSeqel("4-sp-3", "speech", "end");

p.destination.main = '[[->Start]]';
