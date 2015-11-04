"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var ConversationActions = {
  chooseNode: function chooseNode(nodeId) {
    
    Dispatcher.dispatch({
      actionType: ActionTypes.CHOOSE_NODE,
      nodeId: nodeId
    });
  }
  // createAuthor: function(author) {
  //   var newAuthor = AuthorApi.saveAuthor(author);

  //   //Hey dispatcher, go tell all the stores that an author was just created.
  //   Dispatcher.dispatch({
  //     actionType: ActionTypes.CREATE_AUTHOR,
  //     author: newAuthor
  //   });
  // }
};

module.exports = ConversationActions;