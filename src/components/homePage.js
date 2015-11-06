"use strict";

var React = require('react');
var Router = require('react-router');
var StackApi = require('../api/stackapi');
var Link = Router.Link;

var Home = React.createClass({
  render: function() {
		return (
			<div className="jumbotron">
				<h1>Lunch</h1>
				<p>An interactive fiction game that lets the player stroll through the conversation a couple is having at a restaurant.</p>
			  <Link className='btn btn-default' to="play">Play it Now :)</Link>
      </div>
		);
	}
});

module.exports = Home;