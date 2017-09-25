import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import AuthPatientRoute from '../auth/AuthPatientRoute';
import AuthDoctorRoute from '../auth/AuthDoctorRoute';
import PublicRoute from '../auth/PublicRoute';

import Landing from '../pages/Landing';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

import Patient from './Patient';
import SelectSymptomsPage from '../pages/patient/SelectSymptomsPage';
import SelectTreatmentsPage from '../pages/patient/SelectTreatmentsPage';
import Dashboard from '../pages/patient/Dashboard';
import Checkin from '../pages/patient/Checkin';
import SymptomsHistory from '../pages/patient/SymptomsHistory';
import TreatmentsHistory from '../pages/patient/TreatmentsHistory';
import Account from '../pages/patient/Account';

import Doctor from './Doctor';
import DoctorHomepage from '../pages/doctor/Home';

const App = appProps => {
  if (appProps.authenticated && !appProps.accountType) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Switch>
        <PublicRoute exact path="/" component={Landing} {...appProps} />
        <PublicRoute path="/login" component={Login} {...appProps} />
        <PublicRoute path="/signup" component={Signup} {...appProps} />

        <AuthPatientRoute exact path="/patient" component={Patient} {...appProps} />
        <AuthPatientRoute exact path="/patient/selectsymptoms" component={SelectSymptomsPage} {...appProps} />
        <AuthPatientRoute exact path="/patient/selecttreatments" component={SelectTreatmentsPage} {...appProps} />
        <AuthPatientRoute exact path="/patient/dashboard" component={Dashboard} {...appProps} />
        <AuthPatientRoute exact path="/patient/checkin" component={Checkin} {...appProps} />
        <AuthPatientRoute exact path="/patient/history/symptoms" component={SymptomsHistory} {...appProps} />
        <AuthPatientRoute exact path="/patient/history/treatments" component={TreatmentsHistory} {...appProps} />
        <AuthPatientRoute exact path="/patient/account" component={Account} {...appProps} />

        <AuthDoctorRoute exact path="/doctor" component={Doctor} {...appProps} />
        <AuthDoctorRoute exact path="/doctor/home" component={DoctorHomepage} {...appProps} />

        <Route path="*" component={NotFound}/>
      </Switch>
    </Router>
  );
};

export default createContainer(() => {
  const userDataHandle = Meteor.subscribe('userData');
  const loggingIn = Meteor.loggingIn();
  return {
    loggingIn,
    authenticated: !!Meteor.userId(),
    accountType: (userDataHandle.ready() && Meteor.userId()) ? Meteor.users.findOne(Meteor.userId()).accountType : undefined
  };

}, App);
