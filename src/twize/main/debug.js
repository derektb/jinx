var $ = require('jquery');

var Debug = function(){
  // create debug passage
  var debugPassage = new Passage(Number(_.thumbprint(5,10)), "debug", "", debugPassageSrc);
  window.story.passages.push(debugPassage);

  // setup tilde event listener
  $(document).keydown(function(e){
  	if (e.keyCode === 192) {
  		if($('#debug').length === 0){
  			var d = document.createElement('div');
  			d.id = "debug";
  			d.insertAdjacentHTML("afterbegin", window.story.render('debug'));
  			$('body').append(d);
  		} else {
  			$('#debug').remove()
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

var debugPassageSrc = `All Passages:
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
<a>close</a>`;

module.exports = Debug;
