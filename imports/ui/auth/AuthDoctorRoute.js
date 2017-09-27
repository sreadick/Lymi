import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
// import SidebarMenu from '../components/patient/SidebarMenu';

const AuthDoctorRoute = ({ loggingIn, authenticated, accountType, component, sidebarToggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        !authenticated ?
          <Redirect to="/login" />
        : accountType === 'doctor' ?
          <div className="page doctor">
            {/* <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/> */}
            <PrivateHeader title="Lymi-MD" accountType={accountType} />
            <div>
              {(React.createElement(component, {...props}))}
            </div>
          </div>
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
