"use strict";

//This file is mocking a web API by hitting hard coded data.
var orderStack = require('./stacks/orderstack').orderStack;
var workStack = require('./stacks/workstack').workStack;
var silenceStack = require('./stacks/silencestack').silenceStack;
var initialState = require('./initialstate').initialState;
var speakers = require('./speakers').speakers;
var Immutable = require('immutable');

var _speakers = Immutable.Map([]);
var _convoNodes = Immutable.Map([]);
var _quotes = Immutable.Map([]);
var _conversation = Immutable.Map({
  currentSpeaker: '',
  currentNode: Immutable.Map({}),
  currentChoices: Immutable.List([]),
  pathIdsStack: Immutable.Stack([]),
  convoStacks: Immutable.List([])
});

var _clone = function(item) {
  return JSON.parse(JSON.stringify(item)); //return cloned copy so that the item is passed by value instead of by reference
};

var _getOrderStack = function getOrderStack() {
  return _clone(orderStack);
};

var _getWorkStack = function getWorkStack() {
  return _clone(workStack);
};

var _getSilenceStack = function getSilenceStack() {
  return _clone(silenceStack);
};

var _getInitialState = function getInitialState() {
  return _clone(initialState);
};

var _getSpeakers = function _getSpeakers() {
  return _clone(speakers);
};

var _parseData = function _parseData() {
  var initialstate = _getInitialState();
  _conversation = _conversation.set(
    'currentSpeaker',
    initialstate.currentSpeaker);
  _conversation = _conversation.set(
    'currentNode', 
    Immutable.Map(initialstate.currentNode));

  _parseSpeakers(_getSpeakers());

  //will also populate _conversation.convoStacks;
  _parseStack(_getOrderStack());
  _parseStack(_getWorkStack());
  _parseStack(_getSilenceStack());
};

var _parseSpeakers = function _parseSpeakers(speakerArray) {
  speakerArray.forEach(_createSpeaker);
};

var _createSpeaker = function _createSpeaker(speaker) {
  var newSpeaker = Immutable.Map(speaker);
  _speakers = _speakers.set(speaker.id, newSpeaker);
};

var _parseStack = function _parseStack(stackArray) {
  stackArray.forEach(_createNode);
  var stack = Immutable.Stack(stackArray);
  _conversation = _conversation.updateIn(
    ['convoStacks'],
    function updater(val) {
      return val.push(stack);
  });
};

var _createNode = function _createNode(convoNode, index, stackArray) {
  if (convoNode.id && 
      _convoNodes.get(convoNode.id)) {
    return;
  }

  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  var newNode = Immutable.Map({
    id: id,
    entryBundles: Immutable.Map({}),
    mainBundle: Immutable.List([])
  });

  convoNode.entryBundles.forEach(_parseEntryBundle);
  function _parseEntryBundle(entryBundle) {
    var speakerId = entryBundle[0].speaker;
    entryBundle.forEach(_createQuote);

    var newEntryBundle = Immutable.List(entryBundle);
    newNode = newNode.setIn(['entryBundles', speakerId], newEntryBundle);
  }

  convoNode.mainBundle.forEach(_createQuote);
  newNode = newNode.set('mainBundle', Immutable.List(convoNode.mainBundle));
  _convoNodes = _convoNodes.set(id, newNode);

  stackArray[index] = id;
};

var _createQuote = function _createQuote(quote, index, bundle) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  var newQuote = Immutable.Map({
    id: id,
    speaker: quote.speaker,
    text: quote.text
  });
  _quotes = _quotes.set(id, newQuote);
  bundle[index] = id;
};

var StackApi = {
  initialize: function initialize() {
    _parseData();
  },

  getConversation: function getConversation() {
    return _conversation;
  },

  getConvoNodes: function getConvoNodes() {
    return _convoNodes;
  },

  getQuotes: function getQuotes() {
    return _quotes;
  },

  getSpeakers: function getSpeakers() {
    return _speakers;
  }
};

module.exports = StackApi;