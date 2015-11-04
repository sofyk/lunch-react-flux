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

function _replaceSpeakerId(map, key) {
  var speaker = 
    SpeakerStore.getSpeakerById(map.get(key));

  return map.set(key, speaker);
}

function _getSpeakerChoice(nodeId, speaker) {
  var node = ConvoNodeStore.getConvoNodeById(nodeId);
  var enteryBundle = node.getIn(['entryBundles', speaker]);
  var quoteId;

  if(enteryBundle) {
    quoteId = enteryBundle.get(0);
  }else{
    quoteId = node.getIn(['mainBundle', 0]);
  }

  var quote = _replaceSpeakerId(
    QuoteStore.getQuoteById(quoteId),
    'speaker'
  );

  return quote;
}

function _updateChoice(conversation) {
  var convoStacks = conversation.get('convoStacks');
  var currentSpeaker = conversation.get('currentSpeaker');

  function _addChoice(stack) {
    conversation = conversation.updateIn(
      ['currentChoices'],
      function updater(val) {
        return val.push(
          _getSpeakerChoice(stack.first(), currentSpeaker)
        );
    });
  }

  convoStacks.forEach(_addChoice, this);

  return conversation;
}

function _update(conversation) {
  conversation = _updateChoice(conversation);
  conversation =
    _replaceSpeakerId(conversation, 'currentSpeaker');

  return conversation;
}

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
      _conversation = 
        _update(action.initialData.conversation);
      ConversationStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = ConversationStore;