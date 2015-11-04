"use strict";

var React = require('react');

var ChoiceItem = React.createClass({
  propTypes: {
    choiceitem: React.PropTypes.object.isRequired
  },

  render: function() {

    return (
      <div className='row'>
        <div className='btn btn-link'>
          <b>[&nbsp;{this.props.choiceitem.get('text')}&nbsp;]</b>
        </div>
      </div>
    );
  }
});

module.exports = ChoiceItem;