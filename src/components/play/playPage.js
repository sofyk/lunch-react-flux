"use strict";

var React = require('react');
var Conversation = require('./conversation/conversation');

var Play = React.createClass({
  
  render: function () {
    return (
      <div className="col-xs-10 col-xs-offset-1">
        <img className="img-responsive img-rounded center-block"
             src="assets/images/Lunch_sm.png" />
        <Conversation />
      </div>
    ); 
  }
});

module.exports = Play;