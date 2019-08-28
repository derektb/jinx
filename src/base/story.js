
'use strict';
var $ = require('jquery');
var _ = require('underscore');
var LZString = require('lz-string');

/**
An object representing the entire story. After the document has completed
loading, an instance of this class will be available at `window.story`.
**/
var Story = function(el) {
	// -- BASIC PROPERTIES --
	this.el = el;

	this.name = el.attr('name'); // The name of the story.
	this.startPassage = parseInt(el.attr('startnode')); // The ID of the first passage to be displayed.
	this.creator = el.attr('creator'); // The program that created this story.
	this.creatorVersion = el.attr('creator-version'); // The version of the program used to create this story.

	// -- INITIALIZE HISTORY AND STATE --

	/**
	 An array of passage IDs, one for each passage viewed during the current
	 session. **/
	this.history = [];

	/**
	 An object that stores data that persists across a single user session.
	 Any other variables will not survive the user pressing back or forward. **/
	this.state = {};

	/**
	 The name of the last checkpoint set. If none has been set, this is an
	 empty string. **/
	this.checkpointName = '';

	/**
	 If set to true, then any JavaScript errors are ignored -- normally, play
	 would end with a message shown to the user. **/
	this.ignoreErrors = false;

	/**
	 The message shown to users when there is an error and ignoreErrors is not
	 true. Any %s in the message will be interpolated as the actual error
	 message. **/
	this.errorMessage = '\u26a0 %s';

	/**
	 Mainly for internal use, this records whether the current passage contains
	 a checkpoint. **/
	this.atCheckpoint = false;

	// -- CREATE PASSAGE OBJECTS --

	/**
	 An array of all passages, indexed by ID. **/
	this.passages = [];

	var p = this.passages;

	/**
	 Read Twine passage data and create Passages from them **/
	el.children('tw-passagedata').each(function(el) {
		var $t = $(this);
		var id = parseInt($t.attr('pid'));
		var tags = $t.attr('tags');

		p[id] = new Passage(
			id,
			$t.attr('name'),
			(tags !== '' && tags !== undefined) ? tags.split(' ') : [],
			$t.html()
		);
	});

	/**
	 An array of user-specific scripts to run when the story is begun.
	**/

	this.userScripts = _.map(
		el.children('*[type="text/twine-javascript"]'),
		function(el) {
			return $(el).html();
		}
	);

	/**
	 An array of user-specific style declarations to add when the story is begun.

	 @property userStyles
	 @type Array
	**/

	this.userStyles = _.map(
		el.children('*[type="text/twine-css"]'),
		function(el) {
			return $(el).html();
		}
	);
};

_.extend(Story.prototype, {
	/**
	 Begins playing this story. **/
	start: function() {
		// set up history event handler
		$(window).on('popstate', function(event) {
			var state = event.originalEvent.state;

			if (state) {
				this.state = state.state;
				this.history = state.history;
				this.checkpointName = state.checkpointName;
				this.show(this.history[this.history.length - 1], true);
			}
			else if (this.history.length > 1) {
				this.state = {};
				this.history = [];
				this.checkpointName = '';
				this.show(this.startPassage, true);
			}
		}.bind(this));

		// set up passage link handler
		$('body').on('click', 'a[data-passage]', function (e) {
			this.show(_.unescape(
				$(e.target).closest('[data-passage]').attr('data-passage')
			));
		}.bind(this));

		// set up hash change handler for save/restore
		$(window).on('hashchange', function() {
			this.restore(window.location.hash.replace('#', ''));
		}.bind(this));

		// set up error handler
		window.onerror = function(message, url, line) {
			if (! this.errorMessage || typeof(this.errorMessage) != 'string') {
				this.errorMessage = Story.prototype.errorMessage;
			}

			if (!this.ignoreErrors) {
				if (url) {
					message += ' (' + url;

					if (line) {
						message += ': ' + line;
					}

					message += ')';
				}

				$('#passages').html(this.errorMessage.replace('%s', message));
			}
		}.bind(this);

		// activate user styles
		_.each(this.userStyles, function(style) {
			$('body').append('<style>' + style + '</style>');
		});

		// run user scripts
		_.each(this.userScripts, function(script) {
			eval(script);
		});

		/**
		 Triggered when the story is finished loading, and right before
		 the first passage is displayed. The story property of this event
		 contains the story.	**/
		$.event.trigger('startstory', { story: this });

		// try to restore based on the window hash if possible
		if (window.location.hash === '' ||
			!this.restore(window.location.hash.replace('#', ''))) {
			// start the story; mark that we're at a checkpoint

			this.show(this.startPassage);
			this.atCheckpoint = true;
		}
	},

	/**
	 Finds and returns the Passage object corresponding to either an ID or name.
	 If none exists, then it returns null. **/
	passage: function(idOrName) {
		if (_.isNumber(idOrName)) {
			return this.passages[idOrName];
		}
		else if (_.isString(idOrName)) {
			const unwrappedName = idOrName.match(/(?:\[\[)?([^\[\]]+)(?:\]\])?/)[1];
			return _.findWhere(this.passages, { name: unwrappedName });
		}
	},

	/**
	 Displays a passage on the page. If there is no passage by the
	 name or ID passed, an exception is raised.

	 Calling this immediately inside a passage (i.e. in its source code) will
	 *not* display the other passage. Use Story.render() instead.
	**/
	show: function(idOrName, noHistory) {
		var passage = this.passage(idOrName);

		if (!passage) {
			throw new Error(
				'There is no passage with the ID or name "' + idOrName + '"'
			);
		}

		/**
		 Triggered whenever a passage is about to be replaced onscreen with another.
		 The passage being hidden is stored in the passage property of the event. **/
		$.event.trigger('hidepassage', { passage: window.passage });

		/**
		 Triggered whenever a passage is about to be shown onscreen.
		 The passage being displayed is stored in the passage property of the event. **/
		$.event.trigger('showpassage', { passage: passage });

		/**
		 If noHistory, this passage will not be added to the history.
		 Otherwise: **/
		if (!noHistory) {
			this.history.push(passage.id);

			try {
				if (this.atCheckpoint) {
					window.history.pushState(
						{
							state: this.state,
							history: this.history,
							checkpointName: this.checkpointName
						},
						'',
						''
					);
				}
				else {
					window.history.replaceState(
						{
							state: this.state,
							history: this.history,
							checkpointName: this.checkpointName
						},
						'',
						''
					);
				}
			}
			catch (e) {
				/**
				 Triggered whenever a checkpoint fails to be saved to browser history.
				 (the above may fail due to security restrictions in the browser) **/
				$.event.trigger('checkpointfailed', { error: e });
			}
		}

		window.passage = passage;
		this.atCheckpoint = false;

		// --- JINX PANEL PREPARATIONS ---

		var rendered;

		const jinxAutoPanelize = window.jinx.getSetting('autoPanelize')
		const shouldPanelize = !!(
			jinxAutoPanelize && !passage.tags.includes('not-panel')
			|| !jinxAutoPanelize && passage.tags.includes('panel')
		);

		try {
			if (shouldPanelize) {
				rendered = passage.renderPanel()
			} else {
				rendered = passage.render()
			}
		} catch (e) {
			throw new Error(`Some sort of rendering issue with passage "${passage.name}":
---
${e.stack}`)
		}

		 // -- PASSAGE RENDERING --

		 // should replace?
 		const jinxAutoReplace = window.jinx.getSetting('autoReplace');
 		const passageTaggedReplace = passage.tags.includes("replace");
		const passageTaggedKeep = passage.tags.includes("keep");
		const shouldReplace = !!(
			jinxAutoReplace && !passageTaggedKeep
			|| !jinxAutoReplace && passageTaggedReplace
		);

		if (shouldReplace) {
			$('#passages').empty();
		}

		const passageNameClass = passage.passageDomName();
		const passageCustomClasses = passage.getTagClasses();
		const historyIndex = _.wiz_findInHistory(passage.id)

		$('#passages').append(`<div class="passage ${passageNameClass}${passageCustomClasses}" historyIndex="${historyIndex}">${rendered}</div>`);

		/**
		 Triggered after a passage has been shown onscreen, and is now
		 displayed in the div with id passage. The passage being displayed is
		 stored in the passage property of the event.	**/
		$.event.trigger('showpassage:after', { passage: passage });
	},

	/**
	 Returns the HTML source for a passage. This is most often used when
	 embedding one passage inside another. In this instance, make sure to
	 use <%= %> instead of <%- %> to avoid incorrectly encoding HTML entities. **/
	render: function(idOrName) {
		var passage = this.passage(idOrName);

		if (!passage) {
			throw new Error('There is no passage with the ID or name ' + idOrName);
		}

		return passage.render();
	},

	/**
	 Tries to add an entry in the browser history for the current story state.
	 Remember, only variables set on this story's state variable are stored in
	 the browser history.	**/

	/** TODO: JINX HISTORY MANAGEMENT
		Jinx currently fights with Snowman's built-in history management, mainly
		because Snowman expected to have only one passage displayed at a time,
		and Jinx displays multiple "passages" (as panels) at a time.

		This should be addressed in future page-based versions of jinx
	**/
	checkpoint: function(name) {
		if (name !== undefined) {
			document.title = this.name + ': ' + name;
			this.checkpointName = name;
		}
		else {
			this.checkpointName = '';
		}

		this.atCheckpoint = true;

		/**
		 Triggered whenever a checkpoint is set in the story.

		 @event checkpoint
		**/

		$.event.trigger('checkpoint', { name: name });
	},

	/**
	 Returns a hash value representing the current state of the story.

	 @method saveHash
	 @return String hash
	**/

	saveHash: function()
	{
		return LZString.compressToBase64(JSON.stringify({ state: this.state, history: this.history, checkpointName: this.checkpointName }));
	},

	/**
	 Sets the URL's hash property to the hash value created by saveHash().

	 @method save
	 @return String hash
	**/

	save: function()
	{
		/**
		 Triggered whenever story progress is saved.

		 @event save
		**/

		$.event.trigger('save');
		window.location.hash = this.saveHash();
	},

	/**
	 Tries to restore the story state from a hash value generated by saveHash().

	 @method restore
	 @param hash {String}
	 @return {Boolean} whether the restore succeeded
	**/

	restore: function (hash)
	{
		/**
		 Triggered before trying to restore from a hash.

		 @event restore
		**/

		$.event.trigger('restore');

		try
		{
			var save = JSON.parse(LZString.decompressFromBase64(hash));
			this.state = save.state;
			this.history = save.history;
			this.checkpointName = save.checkpointName;
			this.show(this.history[this.history.length - 1], true);
		}
		catch (e)
		{
			// swallow the error

			/**
			 Triggered if there was an error with restoring from a hash.

			 @event restorefailed
			**/

			$.event.trigger('restorefailed', { error: e });
			return false;
		};

		/**
		 Triggered after completing a restore from a hash.

		 @event restore:after
		**/

		$.event.trigger('restore:after');
		return true;
	}
});

module.exports = Story;
