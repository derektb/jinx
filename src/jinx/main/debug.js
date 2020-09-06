const $ = require('jquery');
const gridHelpers = require('./grid/gridHelpers.js');

// This is junk-ass code but it gets the job done

const Debug = function(){
  // create debug passage
  const debugPassage = new Passage(Number(_.thumbprint(5,10)), "debug", "", debugPassageSrc);
  window.story.passages.push(debugPassage);

  this.renderGridHelpers = function() {
    const jinx = window.jinx;
    const panelDefs = jinx.grid.data().panels
    const gridSize = jinx.grid.data().grid;
    if (panelDefs) {
      const panelSizes = gridHelpers.renderAllPanels(panelDefs);
      const gridPositions = gridHelpers.renderAllPositions(gridSize[0], gridSize[1])

      // because of how debug renders stuff, sorry, junk-ass hack, lol
      const d = document.createElement('div');
      d.innerHTML += `<p class="grid-helper-header">all grid positions</p>`
      d.append(gridPositions);
      d.innerHTML += `<p class="grid-helper-header">all panel sizes</p>`
      d.append(panelSizes);
      return d.innerHTML; // lol
    } else {
      return `<p>No grid defined for this comic</p>`
    }
  }

  // setup keypress
  $(document).keydown(function(e){
  	if (e.keyCode === 192) { // tilde
      const debugEl = document.getElementById("debug");
  		if(!debugEl){
  			var d = document.createElement('div');
  			d.id = "debug";
  			d.insertAdjacentHTML("afterbegin", window.story.render('debug'));
  			document.querySelector("body").insertAdjacentElement("beforeend", d);
  		} else {
  			debugEl.remove()
  		}
  	}
  });

  // setup debug passage links
  $(document).on('click', '#debug a', function(e){
    let target = e.target;
    if($(target).hasClass('passage-src-link')) {
      console.log(story.passage(target.getAttribute('data-passage-name')).source);
    }

  	$('#debug').remove();
  });
}

const debugPassageSrc = `All Passages:
<%
_(window.story.passages).each(function(passage) {
 if(passage) {
%>
**<%= passage.name %>**
<br>
[[Display-><%= passage.name %>]] | <a class="passage-src-link" data-passage-name="<%=passage.name%>">src</a>
<br>
<%
}
});
%>
<hr>
<%= jinx.debug.renderGridHelpers() %>
<hr>
<a>close</a>`;

module.exports = Debug;
