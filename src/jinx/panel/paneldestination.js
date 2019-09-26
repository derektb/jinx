var _ = require('underscore');

var PanelDestination = function() {

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

  this.end = function setupEndDestination() {
    // this panel ends here
  }

  this.get = function getDestination() {
    return this.evaluateDestination();
  }

  // default: if none specified, then panel ends

  this.end()
}

module.exports = PanelDestination;
