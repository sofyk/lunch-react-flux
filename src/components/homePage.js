"use strict";

var React = require('react');
var Router = require('react-router');
var StackApi = require('../api/stackapi');
var Link = Router.Link;

var Home = React.createClass({
  render: function() {
		return (
			<div className="jumbotron">
				<h1>Lunch*</h1>
				<p>An interactive fiction game that lets you stroll through the conversation a couple is having at a restaurant.</p>
        <Link className='btn btn-default' to="play">Play it Now</Link>
        <p><i><small>*Beware: the game is in an early development stage.</small></i></p>
      </div>
		);
	}
});

module.exports = Home;