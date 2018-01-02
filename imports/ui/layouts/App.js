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
import WelcomePage from '../pages/patient/WelcomePage';
import SelectSymptomsPage from '../pages/patient/SelectSymptomsPage';
import SelectTreatmentsPage from '../pages/patient/SelectTreatmentsPage';
import SelectTreatmentsPage2 from '../pages/patient/SelectTreatmentsPage2';
import SelectTreatmentsPage3 from '../pages/patient/SelectTreatmentsPage3';
import Dashboard from '../pages/patient/Dashboard';
import Checkin from '../pages/patient/Checkin';
import SymptomsHistory from '../pages/patient/SymptomsHistory';
import SymptomsHistory2 from '../pages/patient/SymptomsHistory2';
import TreatmentsHistory from '../pages/patient/TreatmentsHistory';
import Account from '../pages/patient/Account';
import ForumHome from '../pages/patient/ForumHome';
import ForumPost from '../pages/patient/ForumPost';

import Doctor from './Doctor';
import DoctorHomepage from '../pages/doctor/Home';
import AddPatients from '../pages/doctor/AddPatients';
import PatientSummary from '../pages/doctor/PatientSummary';
import PendingPage from '../pages/doctor/PendingPage';

import Admin from './Admin';

// ToDo
// Replace materialize frameworks with Material-UI
// Optimize performance
// Consider creating high level container for front end collections

const App = appProps => {
  if (appProps.authenticated && !appProps.account) {
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
        <AuthPatientRoute exact path="/patient/welcomepage" component={WelcomePage} {...appProps} />
        <AuthPatientRoute exact path="/patient/selectsymptoms" component={SelectSymptomsPage} {...appProps} />
        <AuthPatientRoute exact path="/patient/selecttreatments" component={SelectTreatmentsPage} {...appProps} />
        <AuthPatientRoute exact path="/patient/selecttreatments2" component={SelectTreatmentsPage2} {...appProps} />
        <AuthPatientRoute exact path="/patient/selecttreatments2/:treatmentId" component={SelectTreatmentsPage2} {...appProps} />
        <AuthPatientRoute exact path="/patient/selecttreatments3" component={SelectTreatmentsPage3} {...appProps} />
        <AuthPatientRoute exact path="/patient/dashboard" component={Dashboard} {...appProps} />
        <AuthPatientRoute exact path="/patient/checkin" component={Checkin} {...appProps} />
        <AuthPatientRoute exact path="/patient/history/symptoms" component={SymptomsHistory} {...appProps} />
        <AuthPatientRoute exact path="/patient/history/symptoms2" component={SymptomsHistory2} {...appProps} />
        <AuthPatientRoute exact path="/patient/history/treatments" component={TreatmentsHistory} {...appProps} />
        <AuthPatientRoute exact path="/patient/account" component={Account} {...appProps} />
        <AuthPatientRoute exact path="/patient/forum/home" component={ForumHome} {...appProps} />
        <AuthPatientRoute path="/patient/forum/post/:postId" component={ForumPost} {...appProps} />

        <AuthDoctorRoute exact path="/doctor" component={Doctor} {...appProps} />
        <AuthDoctorRoute exact path="/doctor/home" component={DoctorHomepage} {...appProps} />
        <AuthDoctorRoute exact path="/doctor/addpatients" component={AddPatients} {...appProps} />
        <AuthDoctorRoute path="/doctor/patientsummary/:patientId" component={PatientSummary} {...appProps} />
        <AuthDoctorRoute exact path="/doctor/pending" component={PendingPage} {...appProps} />

        <Route exact path="/admin" component={Admin}/>
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
    account: (userDataHandle.ready() && Meteor.userId()) ? Meteor.users.findOne(Meteor.userId()).account : undefined
  };

}, App);
