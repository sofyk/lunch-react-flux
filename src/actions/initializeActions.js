"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var StackApi = require('../api/stackapi');

var InitializeActions = {
	initApp: function() {
    StackApi.initialize();

		Dispatcher.dispatch({
			actionType: ActionTypes.INITIALIZE,
			initialData: {
				conversation: StackApi.getConversation(),
        convoNodes: StackApi.getConvoNodes(),
        quotes: StackApi.getQuotes(),
        speakers: StackApi.getSpeakers()
			}
		});
	}
};

module.exports = InitializeActions;