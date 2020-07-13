passage.panel.replay = function() {
 const p = passage.panel;
 $(p.__selectors.panel).find('.layer').empty()
  p.refresh();
  p.advance();
}

// while we're at it:

p.select = function(which = 'panel') {
  return $(this.__selectors[which]);
}

// p.select() => the panel
// p.select('passage') = the passage
