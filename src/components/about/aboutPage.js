"use strict";

var React = require('react');

var About = React.createClass({
	render: function () {
		return (
			<div className='col-xs-10 col-xs-offset-1'>
				<h1>About</h1>
				<p>
					Lunch a game about a couple that is having an argument that is entirely unrelated to the actual issues troubling the relationship. It is about two people reading into things, yet never stating their mind. At least not during that lunch. It will be up to the player to figure out what actually troubles the relationship.
				</p>
				<p>
					Lunch is developed and written by me, Sofy K. I am a software developer by day, a short story writer by night, and a game designer by daydreams. I am fascinated by interactive narrative, and i plan t hone this skill with endless practice.
				</p>
			</div>
		); 
	}
});

module.exports = About;