const Jinx = require("Jinx");
const Panel = require("Panel");
const StepAnimation = require('StepAnimation');
const _ = require("underscore");

var jinx, panel;
var stepData, stepAnimation, step, newPosIndex, isFinalStep;

QUnit.module("Panel Advance",
  {
    beforeEach: function() {
      jinx = window.jinx = new Jinx();
      panel = new Panel("test");
      panel.addArtAssets(
        ['bg','bg.png']

        , ['char1','foo.png']
        , ['char2','bar.png']
        , ['char3','baz.png']

        , ['speech1','fizz.png']
        , ['speech2','buzz.png']
      );
      panel.addLayers(
          'bg'
        , 'char'
        , 'speech'
      );
      panel.step.create(
        {a: 'bg', l: 'bg', u: 500}
        , {a: 'char1', l: 'char', s: 'after', d: 500, u: 500}
        , {a: 'speech1', l: 'speech', s: 'after', d: 500, u: 500}
      );

      panel.step.create(
        {a: 'speech2', l: 'speech'}
        , {a: 'char2', l: 'char', p: 'replace'}
      );
    },
    afterEach: function() {
      jinx = window.jinx = null;
      panel = null;
    }
  },

  function() {
    QUnit.test("initial panel is set up properly",function(assert){
      assert.equal(panel.seq.tracks.default.length, 5, "Sequence has the right number of seqels")
    })

    QUnit.test("Panel.advance --- getStepData", function(assert) {
      stepData = panel.seq.getStepData();
        step = stepData.step;
        newPosIndex = stepData.data.lastIndex + 1;
        isFinalStep = stepData.data.isFinalStep;

      assert.equal(step.length, 3, "Gotten step is correct length.")
      assert.equal(newPosIndex, 3, "New position index is returned")
      assert.notOk(isFinalStep, "This step is not the final step in this panel's sequence.")
    })

    QUnit.test("Panel.advance --- createStepAnimation", function(assert){
      var assets, shadowPanel, timing;
      step = panel.seq.getStepData().step;
      stepAnimation = panel.renderer.createStepAnimation(step);
        assets = stepAnimation.assets;
        shadowPanel = stepAnimation.panel;
        timing = stepAnimation.timing;
      assert.ok(stepAnimation instanceof StepAnimation, "A StepAnimation is returned")

      assert.equal(assets.length, 3, "Three asset sequences have been created.")

      assert.ok(shadowPanel.layer("bg"), "BG layer has been added");
        assert.ok(shadowPanel.layer("char"), "char layer has been added");
        assert.ok(shadowPanel.layer("speech"), "speech layer has been added");

      assert.ok(shadowPanel.layer("bg").asset("bg"), "BG asset has been added");
        assert.ok(shadowPanel.layer("char").asset("char1"), "character asset has been added");
        assert.ok(shadowPanel.layer("speech").asset("speech1"), "speech asset has been added");

      assert.equal(timing.endTime, 2500, "StepAnimation ends at expected time");
      assert.equal(stepAnimation.getAssetAnimation(shadowPanel.asset('bg').id).beats[0].startTime, 0, "first asset starts at expected time");
      assert.equal(stepAnimation.getAssetAnimation(shadowPanel.asset('char1').id).beats[0].startTime, 1000, "second asset starts at expected time");
      assert.equal(stepAnimation.getAssetAnimation(shadowPanel.asset('speech1').id).beats[0].startTime, 2000, "third asset starts at expected time");
  })
});
