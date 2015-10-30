"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventTypes = require('../constants/eventtypes');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var _quotes = Immutable.Map();

var QuoteStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EventTypes.change, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.change, callback);
  },

  emitChange: function() {
    this.emit(EventTypes.change);
  },

  getAllQuotes: function() {
    return _quotes;
  },

  getQuoteById: function(id) {
    return _quotes.get(id, null);
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIALIZE:
      _quotes = action.initialData.quotes;
      QuoteStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = QuoteStore;