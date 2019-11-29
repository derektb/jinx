var _ = require('underscore');

/*
  Note:
  Destinations are evaluated as late as possible.  This is to permit
  interactivity functionality potentially changing the destination of a
  panel mid-animation.  Expect it to be evaluated immediately before the
  transition happens, when a completed panel is clicked.
*/

var PanelDestination = function() {
  this.evaluateDestination = function() {
    /*
      this is overwritten by config functions.
      empty function here as placeholder and to
      prevent anything from falling apart.
    */
  }

  // configuration functions
  this.to = function setupLinearDestination(passageName) {
    this.evaluateDestination = function(){
      return passageName;
    }
  }

  this.var = function setupVariableDestination(propertyName) {
    const dest = window.story.state[propertyName]

    this.evaluateDestination = function() {
      return dest;
    }
  }

  this.if = function setupBinaryDestination(check, truePassage, falsePassage) {
    let bool = check;
    if (typeof check === "string") {
      bool = window.story.state[check];
    }

    this.evaluateDestination = function() {
      if (bool) {
        return truePassage;
      } else {
        return falsePassage;
      }
    }
  }

  /*
  this.switch = function setupNonlinearDestination (opts, cases) {
    // const {check} = opts;
    // const {routes} = cases;
  }
  */

  this.freeform = function setupFunctionDestination(callback) {
    this.evaluateDestination = callback;
  }

  this.end = function setupEndDestination() {
    this.evaluateDestination = function(){
      return -1;
      /*
        in general, wand gets destination when a completed panel has been
        clicked.  a completed panel which is the last panel of a comic
        should not reactivate for clicking, since that click would do nothing
        but deactivate the wand.

        if a panel gets to the end of its animation, it detects whether it's
        complete.  probably a panel should notify the wand that it doesn't
        have a destination, so the wand doesn't reactivate in anticipation
        of transitioning to another panel.
      */
    }
  }

  this.get = function getDestination() {
    if (this.main) return this.main // regression
    return this.evaluateDestination();
  }

  // default: if none specified, then panel will end
  this.end()
}

module.exports = PanelDestination;
