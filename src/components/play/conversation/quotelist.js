"use strict";

var React = require('react');
var QuoteItem = require('./quoteitem');

function _concatSame(quotelist) {
  var previousQuote;
  var dupToRemove = [];
  var concatSame = function concatSame(quote, index) {
    if(previousQuote && previousQuote.get('speaker') === quote.get('speaker')) {
      dupToRemove.push(index);
      var text = quotelist.getIn([index - 1, 'text']);
      text = text + ' ' + quote.get('text');
      quotelist = quotelist.setIn([index - 1, 'text'], text);
      previousQuote = quotelist.get(index - 1);
    }else{
      previousQuote = quote;
    }
  };

  quotelist.forEach(concatSame, this);

  dupToRemove.forEach(function(index) {
    quotelist = quotelist.delete(index);
  });

  return quotelist;
}

var QuoteList = React.createClass({
  propTypes: {
    quotelist: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]).isRequired
  },

  render: function() {
    var quotelist = _concatSame(this.props.quotelist);
    var createQuoteItem = function(quote){
      return (
        <QuoteItem key={quote.get('id')} quoteitem={quote} />
      );
    };

    return (
      <div>
        {quotelist.map(createQuoteItem, this)}
      </div>
    );
  }
});

module.exports = QuoteList;