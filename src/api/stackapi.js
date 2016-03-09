"use strict";

//This file is mocking a web API by hitting hard coded data.
var orderStack = require('./stacks/orderstack').orderStack;
var workStack = require('./stacks/workstack').workStack;
var silenceStack = require('./stacks/silencestack').silenceStack;
var initialState = require('./initialstate').initialState;
var speakers = require('./speakers').speakers;
var Immutable = require('immutable');

var _speakers = [];
var _convoNodes = [];
var _quotes = [];
var _conversation = {
  startingSpeaker: '',
  currentSpeaker: '',
  currentNode: {},
  pathIdStack: [],
  convoStacks: []
};

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
  _conversation.currentSpeaker = initialstate.currentSpeaker;
  _createNode(initialstate.currentNode);
  _conversation.currentNode = initialstate.currentNode.id;

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
  var newSpeaker = {
    id: speaker.id,
    name: speaker.name
  };
  _speakers.push(newSpeaker);
};

var _parseStack = function _parseStack(stackArray) {
  stackArray.forEach(_createNode);
  _conversation.convoStacks = stackArray;
};

var _createNode = function _createNode(convoNode, index, stackArray) {
  var id = convoNode.id;
  
  if (!id) {
    id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  }
  
  var newNode = {
    id: id,
    entryBundles: {},
    mainBundle: [],
    nextSpeaker: ''
  };

  convoNode.entryBundles.forEach(_parseEntryBundle);
  
  function _parseEntryBundle(entryBundle) {
    var speakerId = entryBundle[0].speaker;
    entryBundle.forEach(_createQuote);
    
    newNode.entryBundles[speakerId] = entryBundle;
  }

  convoNode.mainBundle.forEach(_createQuote);
  newNode.mainBundle = convoNode.mainBundle;
  _convoNodes.push(newNode);

  if(stackArray){
    stackArray[index] = id;
  }
};

var _createQuote = function _createQuote(quote, index, bundle) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  var newQuote = {
    id: id,
    speaker: quote.speaker,
    text: quote.text
  };
  _quotes.push(newQuote);
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