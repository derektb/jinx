var Seqel = require("Seqel");
var _ = require('underscore');

QUnit.module("Seqel Tests");

QUnit.test( "Seqel is creatable", function( assert ) {
  var seqel;
  try {
    seqel = new Seqel()
  } catch (e) {
    assert.equal(e.name, 'TypeError', "Seqel Constructor must be given a hash of parameters.");
  }

  var seqelProperties = [
                         "type",
                         "art",
                         "layer",
                         "effect",
                         "apply",
                         "delay",
                         "duration",
                         "sync",
                         "flow"
                        ].sort();

  try {
    var jinx = { getDefault: function(){return "stub"} }
    seqel = new Seqel({art: "foo", layer: "bar"}, jinx);

    assert.deepEqual(_.keys(seqel).sort(), seqelProperties, "Seqel will construct itself with default data fetched from Jinx via a getDefault() method. It can be fed Jinx as its second parameter...");

    window.jinx = jinx;
    seqel = new Seqel({art: "foo", layer: "bar"});
    assert.deepEqual(_.keys(seqel).sort(), seqelProperties, "...or it can get it directly from the window.  I don't encourage that, though, and maybe will get rid of it.");
    window.jinx = null;
  } catch (e) {
    if(e.name === "TypeError" && e.message.match(/getDefault/g)) {
      throw new Error("\n-----\nTWIZE ERROR:\n-----\nI designed the Seqel to grab defaults from 'window.jinx', which was very naughty.  I am inclined to say that the Seqel should be refactored to recieve the defaults as a param, given to it by a higher power.  This is an uncomfortable proposition, though—I'm not sure how that higher power gets those defaults.  Maybe we just rewrite the getting of jinx.window to have an or?  I don't know.\n-----\n\""+e+"\"")
    } else {
      throw e;
    }
  }
  assert.ok(false, "HEY!  This Jinx defaults thing stinks.  You don't get to pass this test, because this isn't fixed, it just isn't failing any more.")
});
