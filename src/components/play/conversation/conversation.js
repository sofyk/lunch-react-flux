"use strict";

var React = require('react');
var ConvoBlock = require('./convoblock');
var ChoiceList = require('./choicelist');
var ConversationStore = require('../../../stores/conversationStore');

var Conversation = React.createClass({
  getInitialState: function() {
    return {
      conversation: ConversationStore.getConversation()
    };
  },

  componentWillMount: function() {
    ConversationStore.addChangeListener(this._onChange);
  },

  //Clean up when this component is unmounted
  componentWillUnmount: function() {
    ConversationStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({ conversation: ConversationStore.getConversation() });
  },

  render: function() {
    var currentSpeaker = this.state.conversation.get('currentSpeaker');
    var currentNode = this.state.conversation.get('currentNode');
    var currentChoices = this.state.conversation.get('currentChoices');

    return (
      <div>
        <ConvoBlock
          currentspeaker={currentSpeaker}
          currentnode={currentNode} />
        <ChoiceList
          currentspeaker={currentSpeaker}
          currentchoices={currentChoices} />
      </div>
    );
  }
});

module.exports = Conversation;