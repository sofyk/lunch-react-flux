"use strict";

var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;

var routes = (
  <Route name="app" path="/" handler={require('./components/app')}>
    <DefaultRoute handler={require('./components/homePage')} />
    <Route name="about" handler={require('./components/about/aboutPage')} />
    <Route name="play" handler={require('./components/play/playPage')} />
    <NotFoundRoute handler={require('./components/notFoundPage')} />
    <Redirect from="about/*" to="about" />
  </Route>
);

module.exports = routes;