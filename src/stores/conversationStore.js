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

var _getCurrentChoices;
var _init;
var _chooseNode;
var _stepBack;

// TODO: conversation should only contain nodeId,
// not the whole node.
var _conversation = Immutable.Map({
  startingSpeaker: '',
  currentSpeaker: '',
  currentNode: Immutable.Map({}),
  pathIdsStack: Immutable.Stack([]),
  convoStacks: Immutable.List([])
});

_init = function _init(conversation) {
  var imConversation = Immutable.Map({
    startingSpeaker: '',
    currentSpeaker: '',
    currentNode: '',
    pathIdsStack: Immutable.Stack([]),
    convoStacks: Immutable.List([])
  });
  imConversation = imConversation.set(
    'startingSpeaker',
    conversation.startingSpeaker
  );
  imConversation = imConversation.set(
    'currentSpeaker',
    conversation.currentSpeaker
  );
  
  imConversation = imConversation.set(
    'currentNode',
    conversation.currentNode
  );
  var convoStacks = Immutable.List([]);
  conversation.convoStacks.forEach(function pushStack(stack, index) {
    var imStack = Immutable.Stack(stack);
    convoStacks = convoStacks.set(index, imStack);
  });
  
  return imConversation;
};

_chooseNode = function _chooseNode(index){
  var imConversation = _conversation;
  
  imConversation = _pushStateToStack(index, imConversation);
  imConversation = _updateSpeakers(imConversation);
  imConversation = _popNode(index, imConversation);
  
  return imConversation;
};

function _pushStateToStack(index, imConversation) {
  var stateString;
  
  stateString = imConversation.get('startingSpeaker');
  stateString += '-' + imConversation.get('currentSpeaker');
  stateString += '-' + imConversation.get('currentNode');
  stateString += '-' + index;
  
  imConversation = imConversation.updateIn(
    ['pathIdsStack'],
    function updater(val) {
      return val.push(stateString);
    });
  
  return imConversation;
}

function _updateSpeakers(imConversation) {
  var currentSpeaker = imConversation.get('currentSpeaker');
  var currentNodeId = imConversation.get('currentNode');
  var currentNode = ConvoNodeStore.getConvoNodeById(currentNodeId);
  var nextSpeaker = currentNode.get('nextSpeaker');
  
  imConversation = imConversation.set('staringSpeaker', currentSpeaker);
  imConversation = imConversation.set('currentSpeaker', nextSpeaker);
  
  return imConversation;
}

function _popNode(index, imConversation) {
  var chosenStack =
    imConversation.getIn(['convoStacks', index]);
  var chosenNode =
    ConvoNodeStore.getConvoNodeById(chosenStack.first());
  imConversation = imConversation.set(
    'currentNode',
    chosenNode.get('id')
  );

  chosenStack = chosenStack.shift();
  imConversation = imConversation.setIn(
    ['convoStacks', index],
    chosenStack
  );
  
  return imConversation;
}

var ConversationStore = assign({}, EventEmitter.prototype, {
  // TODO: add listeners to other stores
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
  },
  
  getCurrentChoices: _getCurrentChoices
  
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIALIZE:
      _conversation = _init(action.initialData.conversation);
      ConversationStore.emitChange();
      break;

    case ActionTypes.CHOOSE_NODE:
      _conversation = _chooseNode(action.payload.choiceIndex);
      ConversationStore.emitChange();
      break;
    
    case ActionTypes.STEP_BACK:
      _conversation = _stepBack();
      ConversationStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ConversationStore;