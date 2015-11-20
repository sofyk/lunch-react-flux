"use strict";

var React = require('react');
var ConversationActions = require('../../../actions/conversationActions');

var StepBack = React.createClass({

  stepBack: function() {
    event.preventDefault();
    ConversationActions.stepBack();
  },

  render: function() {

    return (
      <div className='row'>
        <div className='col-xs-9 col-xs-offset-3'>
          <button
            className='btn-link text-left'
            onClick={this.stepBack}>
            <b>[&nbsp;&lt;&lt;&nbsp;]</b>
          </button>
        </div>
      </div>
    );
  }
});

module.exports = StepBack;