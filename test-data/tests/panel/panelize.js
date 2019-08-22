var Panel = require("Panel");
var Passage = require("Passage");
var Twize = require("Twize");
const Story = require('Story');
var _ = require("underscore");
const $ = require('jQuery');
const TestPanels = require('./_testpanels');

var seq, twize, fixture;

QUnit.module("Panelization",
{
  beforeEach: function() {
    twize = window.twize = new Twize();
  },
  afterEach: function() {
    twize = window.twize = null;
  }
},

function() {
  QUnit.test("Panelize creates initial state for a Passage Panel", function(assert) {
    var passage = new Passage(1, "test", undefined, TestPanels.simple);
  })
});
