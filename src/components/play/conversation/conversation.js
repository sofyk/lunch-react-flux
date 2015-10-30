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

    return (
      <div>
        <ConvoBlock currentnode={this.state.conversation.currentNode} />
        <ChoiceList 
          currentspeaker={this.state.conversation.currentSpeaker}
          currentchoices={this.state.conversation.currentChoices} />
      </div>
    );
  }
});

module.exports = Conversation;