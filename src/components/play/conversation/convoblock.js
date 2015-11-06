"use strict";

var React = require('react');
var QuoteList = require('./quotelist');

var ConvoBlock = React.createClass({
  propTypes: {
    currentnode: React.PropTypes.object.isRequired
  },

  render: function() {
    var quoteList = this.props.currentnode.get('quoteList');
    
    return (
      <div>
        <QuoteList quotelist={quoteList} />
      </div>
    );
  }
});

module.exports = ConvoBlock;