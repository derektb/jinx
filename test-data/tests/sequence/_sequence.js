var Sequence = require("Sequence");
var Twize = require("Twize");

var seq, twize;

QUnit.module("Sequence Tests | Main",
{
  beforeEach: function() {
    twize = window.twize = new Twize();
    seq = new Sequence();
  },
  afterEach: function() {
    twize = window.twize = null;
  }
},

function() {
  QUnit.test( "Sequence object exists", function( assert ) {
    seq = new Sequence();

    assert.ok(seq, "Sequence constructor creates a sequence.");

    assert.ok(seq.pos, "Sequence.pos | Default position tracker 'pos' is created.");
    assert.equal(seq.pos.index, '0', "Sequence.pos | Initial index is 0");
    assert.equal(seq.pos.track, 'default', "Sequence.pos | Default track is 'default'");

    assert.ok(seq.getTrack('default'), "Sequence.tracks | Default track is created...")
    assert.equal(seq.getTrack('default').length, 0, "Sequence.tracks | ...and is by default empty.")
  });

  QUnit.test("Sequence.getTrack() is able to get tracks from the sequence.", function(assert) {
    seq.addStep({a: "foo", l: "bar"}, {a: "foo", l: "bar", flow: "up yours"});
    var track = seq.getTrack('default');
    assert.deepEqual(track, seq.tracks.default, "Correct track is gotten.");
    assert.throws(function(){ seq.getTrack('nonexistant') }, Error, "Sequence recognizes when a nonexistant track is requested and throws and error.")
  })

  QUnit.test("Sequence.addStep() adds Seqels en masse to default track", function(assert){
    try {
      seq.addStep({a: "foo", l: "bar"}, {a: "foo", l: "bar", flow: "up yours"});
    } catch (e) {
      throw new Error("Seqel constructor is trying to access getDefault from Twize, but no Twize exists.");
    }
    assert.equal(seq.getTrack("default").length, 2, "addStep results in Seqel creation with in the default track.");
    assert.equal(seq.getTrack("default")[1].flow, "stop", "the final Seqel created in addStep is automatically given a 'stop' flow property.");

    seq.addStep({a: "foo", l: "bar"}, {a: "foo", l: "bar"});
    assert.equal(seq.getTrack("default").length, 4, "addStep results in Seqel creation with in the default track.");

  });

  QUnit.test("Sequence.addStepTo() adds Seqels en masse to a user-defined track.", function(assert){
    var customTrack = "foo bar baz";

    seq.addStepTo(customTrack, {a: "foo", l: "bar"}, {a: "baz", l: "bar"});
    assert.equal(seq.tracks[customTrack].length, 2, "addStepTo results in addStep creation within a user-defined track called '"+customTrack+"'.");
  });

  QUnit.test("Sequence.updatePos() allows the sequence's position tracker to be updated by itself and others.", function(assert) {
    assert.deepEqual(seq.pos, {index: 0, track: 'default'}, "Sequence.pos starts out normally");
    seq.updatePos(1)
    assert.deepEqual(seq.pos, {index: 1, track: 'default'}, "With one argument, Sequence.updatePos(1) changes the index only.");
    seq.updatePos(2, 'foo');
    assert.deepEqual(seq.pos, {index: 2, track: 'foo'}, "With two argument, Sequence.updatePos(2, 'foo') changes both the index and the current track.");
    assert.throws(function(){ seq.updatePos() }, Error, "With no arguments, Sequence.updatePos() throws an error.")
  });
});
