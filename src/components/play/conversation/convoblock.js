"use strict";

var React = require('react');

var ConvoBlock = React.createClass({
  propTypes: {
    //convostate: React.PropTypes.array.isRequired
  },

  render: function() {

    return (
      <div>
        <QuoteList />
      </div>
    );
  }
});

module.exports = ConvoBlock;