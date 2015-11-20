"use strict";

var React = require('react');
var ConversationActions = require('../../../actions/conversationActions');

var ChoiceItem = React.createClass({
  propTypes: {
    choiceitem: React.PropTypes.object.isRequired
  },

  chooseNode: function(choiceIndex, event) {
    event.preventDefault();
    ConversationActions.chooseNode(choiceIndex);
  },

  render: function() {

    return (
      <div className='row'>
        <button
          className='btn-link text-left choice-link'
          onClick={this.chooseNode.bind(
            this,
            this.props.choiceitem.get('choiceIndex'))}
          dangerouslySetInnerHTML={{
            __html: '<b>[&nbsp;' + this.props.choiceitem.get('text') + '&nbsp;]</b>'}} />
      </div>
    );
  }
});

module.exports = ChoiceItem;