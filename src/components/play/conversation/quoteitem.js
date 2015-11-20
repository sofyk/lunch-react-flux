"use strict";

var React = require('react');

var QuoteItem = React.createClass({
  propTypes: {
    quoteitem: React.PropTypes.object.isRequired
  },

  render: function() {

    return (
      <div>
        <div className='col-xs-3 text-right'>
          <b>{this.props.quoteitem.getIn(['speaker', 'name'])}</b>
        </div>
        <div className='col-xs-9 text-left'dangerouslySetInnerHTML={{
            __html: this.props.quoteitem.get('text') 
        }} />
      </div>
    );
  }
});

module.exports = QuoteItem;