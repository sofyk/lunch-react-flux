"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventTypes = require('../constants/eventtypes');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var _convoNodes = Immutable.Map();

var ConvoNodeStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EventTypes.change, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.change, callback);
  },

  emitChange: function() {
    this.emit(EventTypes.change);
  },

  getAllConvoNodes: function() {
    return _convoNodes;
  },

  getConvoNodeById: function(id) {
    return _convoNodes.get(id, null);
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIALIZE:
      _convoNodes = action.initialData.convoNodes;
      ConvoNodeStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ConvoNodeStore;