"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventTypes = require('../constants/eventtypes');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var _speakers = Immutable.Map();

var SpeakerStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EventTypes.change, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.change, callback);
  },

  emitChange: function() {
    this.emit(EventTypes.change);
  },

  getAllSpeakers: function() {
    return _speakers;
  },

  getSpeakerById: function(id) {
    return _speakers.get(id, null);
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIALIZE:
      _speakers = action.initialData.speakers;
      SpeakerStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = SpeakerStore;