"use strict";

var React = require('react');
var ChoiceItem = require('./choiceitem');

var ChoiceList = React.createClass({
  propTypes: {
    currentspeaker: React.PropTypes.object,
    currentchoices: React.PropTypes.object
  },

  render: function() {
    var createChoiceItem = function(choice){
      return (
        <ChoiceItem key={choice.get('id')} choiceitem={choice} />
      );
    };

    var currentspeaker = this.props.currentspeaker ?
      this.props.currentspeaker.get('name') : '';

    return (
        <div>
          <div className='col-xs-3 text-right'>
            <b>{currentspeaker}</b>
          </div>
          <div className='col-xs-9 text-left choicelist-body'>
            {this.props.currentchoices.map(createChoiceItem, this)}
          </div>
        </div>
    );
  }
});

module.exports = ChoiceList;