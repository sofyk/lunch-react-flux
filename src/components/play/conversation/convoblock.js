"use strict";

var React = require('react');
var QuoteList = require('./quotelist');

var ConvoBlock = React.createClass({
  propTypes: {
    currentspeaker: React.PropTypes.object.isRequired,
    currentnode: React.PropTypes.object.isRequired
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