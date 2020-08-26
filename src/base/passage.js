/**
 An object representing a single passage in the story. The passage currently
 being displayed is available as `window.passage`.

 @class Passage
 @constructor
**/

'use strict';
const _ = require('underscore');
const marked = require('marked');
const jQuery = require('jquery');

/**
 Our rendering engine. This is available externally as Passage.render(),
 as well as on Passage instances.

 @method render
 @private
 @return HTML source
**/

function render(source) {

	let result = _.template(source)({ s: window.story.state, $: readyFunc });

	result = result.replace(/\/\*.*\*\//g, '');

	// Remove // comments
	// to avoid clashes with URLs, lines must start with these
	result = result.replace(/^\/\/.*(\r\n?|\n)/g, '');

	// [\ndiv\n]{.withClass#andID}
	const divRegexp = /\[([\r\n+])([^\]]*?)([\r\n+])\]\{(.*?)\}/g;
	const divRenderer = function(wholeMatch, startBr, source, endBr, selector) {
		return renderEl(
			'div',
			startBr + source + endBr,
			selector
		);
	};

	while (divRegexp.test(result)) {
		result = result.replace(divRegexp, divRenderer);
	}

	// [span]{.withClass#andID}
	const spanRegexp = /\[(.*?)\]\{(.*?)\}/g;
	const spanRenderer = function(wholeMatch, source, selector) {
		return renderEl('span', source, selector);
	};

	while (spanRegexp.test(result)) {
		result = result.replace(spanRegexp, spanRenderer);
	}

	// [[links]]
	result = result.replace(/\[\[(.*?)\]\]/g, function(match, target) {
		let display = target;

		// display|target format

		const barIndex = target.indexOf('|');

		if (barIndex != -1) {
			display = target.substr(0, barIndex);
			target = target.substr(barIndex + 1);
		}
		else {
			// display->target format

			const rightArrIndex = target.indexOf('->');

			if (rightArrIndex != -1) {
				display = target.substr(0, rightArrIndex);
				target = target.substr(rightArrIndex + 2);
			}
			else {
				// target<-display format

				const leftArrIndex = target.indexOf('<-');

				if (leftArrIndex != -1) {
					display = target.substr(leftArrIndex + 2);
					target = target.substr(0, leftArrIndex);
				}
			}
		}

		// does this look like an external link?
		if (/^\w+:\/\/\/?\w/i.test(target)) {
			return '<a href="' + target + '">' + display + '</a>';
		}
		else {
			return '<a href="javascript:void(0)" data-passage="' +
				_.escape(target) + '">' + display + '</a>';
		}
	});

	return marked(result);
};

/**
 A helper function that converts markup like [this]{#id.class} into HTML
 source for a DOM element.

 @method renderEl
 @private
 @param {String} nodeName element's node name, e.g. 'div' or 'span'.
 @param {String} source inner source code of the element
 @param {String} selector a string selector, i.e. #myId.className. If the
						  first character of this is a dash (-), then
						  this element will also be given the attribute 'style="display:none"'.
 @return {String} HTML source code
**/

function renderEl(nodeName, source, selector) {
	let result = '<' + nodeName;

	if (selector) {
		if (selector[0] == '-') {
			result += ' style="display:none"';
		}

		let classes = [];
		let id = null;
		const classOrId = /([#\.])([^#\.]+)/g;
		const matches = classOrId.exec(selector);

		while (matches !== null) {
			switch (matches[1]) {
				case '#':
					id = matches[2];
					break;

				case '.':
					classes.push(matches[2]);
					break;

				default:
					throw new Error("Don't know how to apply selector " + matches[0]);
			}

			matches = classOrId.exec(selector);
		}

		if (id !== null) {
			result += ' id="' + id + '"';
		}

		if (classes.length > 0) {
			result += ' class="' + classes.join(' ') + '"';
		}
	}

	result += '>';

	if (source !== null)
		result += render(source);

	return result + '</' + nodeName + '>';
}

/**
 A helper function that is connected to passage templates as $. It acts
 like the jQuery $ function, running a script when the passage is ready in
 the DOM. The function passed is also bound to div#passages for convenience.

 If this is *not* passed a single function, then this acts as a passthrough
 to jQuery's native $ function.

 @function readyFunc
 @return jQuery object, as with jQuery()
 @private
**/

function readyFunc() {
	if (arguments.length == 1 && typeof arguments[0] == 'function') {
		return jQuery(window).one(
			'showpassage:after',
			_.bind(arguments[0], jQuery('#passages'))
		);
	}
	else {
		return jQuery.apply(window, arguments);
	}
}

const Passage = function(id, name, tags, source) {
	/**
	 The numeric ID of the passage.
	 @property name
	 @type Number
	 @readonly
	**/

	this.id = id;

	/**
	 The name of the passage.
	 @property name
	 @type String
	**/

	this.name = name;

	/**
	 The tags of the passage.
	 @property tags
	 @type Array
	**/

	this.tags = tags;
  this.getTagClasses = function(){
    const classTags = this.tags.filter(
      (tag) => { return tag[0] === "." }
    );

    if (classTags.length) {
      const classNames = classTags.map(
        (tag) => { return tag.slice(1) }
      ); // strip period

      return " "+classNames.join(" ");
    } else return "";
  }

	/**
	 The passage source code.
	 @property source
	 @type String
	**/

	this.source = _.unescape(source);
};

/**
 Static renderer, which will render any string passed to it as HTML.
 See Passage.render()'s instance method for a description of what exactly it does.
 @method render
 @static
 @return HTML source
**/
Passage.render = render;

_.extend(Passage.prototype, {
	/**
	 Returns an HTML-rendered version of this passage's source. This
	 first runs the source code through the Underscore template parser,
	 then runs the result through a Markdown renderer, and then finally
	 converts bracketed links to passage links.

	 @method render
	 @return HTML source
	**/

	render: function() {
		return render(_.unescape(this.source));
	},

  renderPanel: function() {
    return render(_.unescape(`
<%
  $( function(){
    window.passage.panelize(function initializer(p) {
      ${this.source}
    });
  });
%>
    `))
  }
});

module.exports = Passage;
