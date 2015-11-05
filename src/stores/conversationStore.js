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

function _getSpeakerChoice(nodeId, key, speaker) {
  var node = ConvoNodeStore.getConvoNodeById(nodeId);
  var enteryBundle = node.getIn(['entryBundles', speaker]);
  var quoteId;

  if(enteryBundle) {
    quoteId = enteryBundle.get(0);
  }else{
    quoteId = node.getIn(['mainBundle', 0]);
  }

  var choice = _replaceSpeakerId(
    QuoteStore.getQuoteById(quoteId),
    'speaker'
  );
  choice = choice.set('choiceIndex', key);

  return choice;
}

function _updateChoice(conversation) {
  conversation =
    conversation.set('currentChoices', Immutable.List([]));

  var convoStacks = conversation.get('convoStacks');
  var currentSpeaker = conversation.get('currentSpeaker');

  function _addChoice(stack, key) {
    conversation = conversation.updateIn(
      ['currentChoices'],
      function updater(val) {
        return val.push(
          _getSpeakerChoice(stack.first(), key, currentSpeaker)
        );
    });
  }

  convoStacks.forEach(_addChoice, this);

  return conversation;
}

function _choose(choiceIndex) {
  var conversation = _conversation;
  conversation = _pushCurrentNode(conversation);
  conversation = _updateCurrentNode(choiceIndex, conversation);

  return conversation;
}

function _pushCurrentNode(conversation) {
  var nodeId = conversation.getIn(['currentNode', 'id']);
  conversation = conversation.updateIn(
    ['pathIdsStack'],
    function updater(val) {
      return nodeId ? val.push(nodeId) : val;
    }
  );
  return conversation;
}

function _updateCurrentNode(choiceIndex, conversation) {
  var chosenStack =
    conversation.getIn(['convoStacks', choiceIndex]);
  var chosenNode =
    ConvoNodeStore.getConvoNodeById(chosenStack.first());
  conversation = conversation.set('currentNode', chosenNode);
  conversation = _populateCurrentNode(conversation);

  chosenStack = chosenStack.shift();
  conversation = conversation.setIn(
    ['convoStacks', choiceIndex],
    chosenStack
  );

  return conversation;
}

function _populateCurrentNode(conversation) {

  var nodeId = conversation.getIn(['currentNode', 'id']);
  var priviousSpeaker = conversation.getIn(['currentSpeaker', 'id']);
  var quoteList = conversation.getIn([
    'currentNode', 'entryBundles', priviousSpeaker]);
  var mainList = conversation.getIn(['currentNode', 'mainBundle']);
  quoteList = quoteList ?
    mainList.concat(quoteList) : mainList;

  quoteList = _replaceQuoteIds(quoteList);
  var currentSpeaker = quoteList.last().get('speaker');
  quoteList = _replaceSpeakerIds(quoteList);

  var populatedNode = Immutable.Map({
    id: nodeId,
    quoteList: quoteList
  });

  conversation = conversation.set('currentNode', populatedNode);
  conversation = conversation.set('currentSpeaker', currentSpeaker);

  return conversation;
}

function _replaceQuoteIds(quoteList) {
  var replaceQuoteId = function replaceQuoteId(quoteId, index) {
    var quote = QuoteStore.getQuoteById(quoteId);
    quoteList = quoteList.set(index, quote);
  };
  
  quoteList.forEach(replaceQuoteId, this); 

  return quoteList;
}

function _replaceSpeakerIds(quoteList) {
  var replaceSpeakerId = function replaceSpeakerId(quote, index) {
    quote = _replaceSpeakerId(quote, 'speaker');
    quoteList = quoteList.set(index, quote);
  };
  
  quoteList.forEach(replaceSpeakerId, this); 

  return quoteList;
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
      _conversation = _updateChoice(action.initialData.conversation);
      _conversation = _replaceSpeakerId(_conversation, 'currentSpeaker');
      ConversationStore.emitChange();
      break;

    case ActionTypes.CHOOSE_NODE:
      _conversation = _choose(action.payload.choiceIndex);
      _conversation = _updateChoice(_conversation);
      _conversation = _replaceSpeakerId(_conversation, 'currentSpeaker');
      ConversationStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = ConversationStore;