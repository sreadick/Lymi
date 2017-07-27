import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import AuthenticatedRoute from '../auth/AuthenticatedRoute';
import PublicRoute from '../auth/PublicRoute';

import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Home from '../pages/Home';
import SelectSymptomsPage from '../pages/SelectSymptomsPage';
import SelectTreatmentsPage from '../pages/SelectTreatmentsPage';
import Dashboard from '../pages/Dashboard';
import Checkin from '../pages/Checkin';
// import SymptomCheckin from '../components/SymptomCheckin';
import NotFound from '../pages/NotFound';


const App = appProps => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <PublicRoute path="/login" component={Login} {...appProps} />
      <PublicRoute path="/signup" component={Signup} {...appProps} />
      <AuthenticatedRoute exact path="/home" component={Home} {...appProps} />
      <AuthenticatedRoute exact path="/home/selectsymptoms" component={SelectSymptomsPage} {...appProps} />
      <AuthenticatedRoute exact path="/home/selecttreatments" component={SelectTreatmentsPage} {...appProps} />
      <AuthenticatedRoute exact path="/home/dashboard" component={Dashboard} {...appProps} />
      <AuthenticatedRoute path="/home/checkin" component={Checkin} {...appProps} />
      {/* <AuthenticatedRoute exact path="/home/checkin/symptoms" component={SymptomCheckin} {...appProps} /> */}
      <Route path="*" component={NotFound}/>
    </Switch>
  </Router>
);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  return {
    loggingIn,
    authenticated: !!Meteor.userId()
  };
}, App);