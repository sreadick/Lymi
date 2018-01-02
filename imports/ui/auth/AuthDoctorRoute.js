import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
// import SidebarMenu from '../components/patient/SidebarMenu';

const AuthDoctorRoute = ({ loggingIn, authenticated, account, component, sidebarToggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        !authenticated ?
          // <Redirect to="/login" />
          <Redirect to="/" />
        : account.type === 'doctor' ?
          <div className="page doctor">
            {/* <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/> */}
            <PrivateHeader title="LymeLog-MD" accountType={account.type} />
            <div>
              {(React.createElement(component, {...props, ...rest}))}
            </div>
          </div>
        : account.type === 'admin' ?
          <Redirect to="/admin" />
        :
          <Redirect to="/patient" />
      );
    }}/>
  );
};

AuthDoctorRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default createContainer(() => {
  // const sidebarToggled = Session.get('sidebarToggled') || false
  // document.body.style.overflow = (sidebarToggled || showProfileBackgroundModel || showProfileImageModel) ? 'hidden' : 'auto';

  return {
    sidebarToggled: false,
  }
}, AuthDoctorRoute);
