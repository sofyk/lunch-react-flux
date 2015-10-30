"use strict";

var React = require('react');
var Router = require('react-router');
var StackApi = require('../api/stackapi');
var Link = Router.Link;

var Home = React.createClass({
  render: function() {
		return (
			<div className="jumbotron">
				<h1>Pluralsight Administration</h1>
				<p>React, React Router, and Flux for ultra-responsive web apps.</p>
			</div>
		);
	}
});

module.exports = Home;