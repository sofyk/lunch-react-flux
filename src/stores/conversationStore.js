"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventTypes = require('../constants/eventtypes');
var SpeakerStore = require('./speakerStore');
var QuoteStore = require('./quoteStore');
var ConvoNodeStore = require('./convoNodeStore');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var _conversation = Immutable.Map();

var ConversationStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EventTypes.change, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.change, callback);
  },

  emitChange: function() {
    this.emit(EventTypes.change);
  },

  getConversation: function() {
    return _conversation;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIALIZE:
      _conversation = action.initialData.conversation;
      ConversationStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = ConversationStore;