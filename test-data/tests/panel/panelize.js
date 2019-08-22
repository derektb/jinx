var Panel = require("Panel");
var Passage = require("Passage");
var Jinx = require("Jinx");
const Story = require('Story');
var _ = require("underscore");
const $ = require('jQuery');
const TestPanels = require('./_testpanels');

var seq, jinx, fixture;

QUnit.module("Panelization",
{
  beforeEach: function() {
    jinx = window.jinx = new Jinx();
  },
  afterEach: function() {
    jinx = window.jinx = null;
  }
},

function() {
  QUnit.test("Panelize creates initial state for a Passage Panel", function(assert) {
    var passage = new Passage(1, "test", undefined, TestPanels.simple);
  })
});
