"use strict";

const global = self;
global.CommentsPlus = {};


global.Promise = global.Promise || global.Plite;

// adapted from https://developer.mozilla.org/en/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
  Element.prototype.matches = 
    Element.prototype.matchesSelector || 
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector || 
    Element.prototype.oMatchesSelector || 
    Element.prototype.webkitMatchesSelector ||
    function (selector) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(selector);
        for (var i = 0; i < matches.length; i++) {
          if (matches.item(i) === this) return true;
        }
        return false;
    };
}