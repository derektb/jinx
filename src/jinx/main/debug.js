const $ = require('jquery');
const gridHelper = require('./debug/gridHelper.js');

// This is junk-ass code but it gets the job done

const Debug = function(){
  // create debug passage
  const debugPassage = new Passage(Number(_.thumbprint(5,10)), "debug", "", debugPassageSrc);
  window.story.passages.push(debugPassage);

  this.renderGridHelper = function() {
    const jinx = window.jinx;
    const panelDefs = jinx.grid.data().panels
    if (panelDefs) {
      const gh = gridHelper(panelDefs);

      // because of how debug renders stuff, sorry, junk-ass hack, lol
      const d = document.createElement('div');
      d.append(gh);
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
<%= jinx.debug.renderGridHelper() %>
<hr>
<a>close</a>`;

module.exports = Debug;
