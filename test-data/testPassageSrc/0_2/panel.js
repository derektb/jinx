<%$(function(){window.passage.panelize(function(p) {
  p.addArt("background-art","background/background-1.png");
  p.addArt("character-art","../character.png");
  p.addArt("speech-art","../speech.png");

  p.addLayer("background");
  p.addLayer("character");
  p.addLayer("speech");
  p.addLayer("css-border");

  p.seq.addSeqel("background-art","background");
  p.seq.addSeqel("character-art","character");
  p.seq.addSeqel("speech-art","speech");

  p.destination = { main: "[[Start]]" };
})});%>
