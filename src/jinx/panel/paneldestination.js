var _ = require('underscore');

var PanelDestination = function() {

  this.evaluateDestination = function() {
    // fallback; possibly: by default, this is the same as a destination.end()
    return ""; // returns a name / passage link, replaced by config
  }

  // configuration functions
// the way I've written this is BAD, i just did it whil I was tired
  this.to = function setupLinearDestination(passageName) {
    this.evaluateDestination = function(){
      return passageName;
    }
  }

  this.var = function setupVariableDestination(propertyName) {
    this.evaluateDestination = function() {
      return this.state[propertyName]
    }
  }

  this.if = function setupBinaryDestination(check, truePassage, falsePassage) {
    if (typeof check === "string") {
      // get boolean value
    }
  }

  this.switch = function setupNonlinearDestination (opts) {
    const {check} = opts;
    const {routes} = cases;

  }

  this.freeform = function setupFunctionDestination(callback) {
    this.evaluateDestination = callback;
  }

  // actual destination determiner

  this.get = function getDestination() {
    return this.evaluateDestination();
  }
}

module.exports = PanelDestination;
