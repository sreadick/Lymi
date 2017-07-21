import { Meteor } from 'meteor/meteor';
import React from 'react';
// import { Router, Route, browserHistory } from 'react-router';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Signup from '../ui/Signup';
import Login from '../ui/Login';
import Home from '../ui/Home';
import NotFound from '../ui/NotFound';

const history = createBrowserHistory();

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/home'];

export const onAuthChange = (isAuthenticated) => {
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isUnauthenticatedPage && isAuthenticated) {
    history.replace('/home');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    history.replace('/');
  }
};
export const routes = (
  <Router history={history}>
    <Switch>
      <Route exact path="/" render={() => {
        return Meteor.userId() ? <Redirect to="/home" /> : <Login/>
      }} />
      <Route path="/signup" render={() => {
        return Meteor.userId() ? <Redirect to="/home" /> : <Signup/>
      }} />
      <Route path="/home" component={Home} />
      <Route path="*" component={NotFound}/>
    </Switch>
  </Router>
);
