var _ = require('underscore');

var StepCreator = function(panelSequence){
  this.seq = panelSequence;

  this.create = function(){
    this.seq.addStep.apply(this.seq, [...arguments]);
    /* note:
        in 0.7, we're going to start to think of
        step.create as an abdridged way of creating
        a step like this:

        startCreatingStep()
        addBeats()
        endCreatingStep()
    */
  }

  this.transition = function() {
    // all this is hack
    const steps = [...arguments];
    const lastBeat = steps[steps.length-1];
    lastBeat.flow = "end-transition";

    this.create.apply(this, steps);
    /* later: will automate creating a step which
       automatically advances the panel when it
       is finished playing its animation.
    */
  }

  // MOCKUP:
  this.enter = function(callback) {
    // executes some code every time the panel starts
    this.create({
      code: callback,
      flow: "on" // so it flows to next created step
    })
  }
}

module.exports = StepCreator
