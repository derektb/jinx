'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var _ = window._ = require('underscore');
var marked = window.marked = require('marked');
var snabbt = window.snabbt = require('./snabbt.min.js');
var seedrandom = require('seedrandom');

var Story = window.Story = require('Story');
var Passage = window.Passage = require('Passage');
var Panel = window.Panel = require('Panel');

var Seqel = window.Seqel = require('Seqel');
var Sequence = window.Sequence = require('Sequence');
var Jinx = window.Jinx = require('Jinx')

$(function() {
	window.story = new Story($('tw-storydata'));
	// probably:
	window.jinx = new Jinx();
	window.story.start();
});
