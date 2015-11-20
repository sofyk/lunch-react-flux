"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var ConversationActions = {
  chooseNode: function chooseNode(choiceIndex) {
    Dispatcher.dispatch({
      actionType: ActionTypes.CHOOSE_NODE,
      payload: {
        choiceIndex: choiceIndex
      }
    });
  },

  stepBack: function stepBack() {
    Dispatcher.dispatch({
      actionType: ActionTypes.STEP_BACK
    });
  }
};

module.exports = ConversationActions;