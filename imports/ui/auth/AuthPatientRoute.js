import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import SidebarMenu from '../components/patient/SidebarMenu';

const AuthPatientRoute = ({ loggingIn, authenticated, accountType, component, sidebarToggled, showProfileBackgroundModel, showProfileImageModel, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        !authenticated ?
          // <Redirect to="/login" />
          <Redirect to="/" />
        : accountType === 'doctor' ?
          <Redirect to="/doctor" />
        : accountType === 'admin' ?
          <Redirect to="/admin" />
        :
          <div className="page">
            <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/>
            <PrivateHeader title="LymeLog" accountType={accountType} />
            {(sidebarToggled || showProfileBackgroundModel || showProfileImageModel) &&
              <div className='page-content--overlay' onClick={() => {
                Session.set('sidebarToggled', false);
                Session.set('showProfileBackgroundModel', false);
                Session.set('showProfileImageModel', false);
              }}></div>
            }
            <div>
              {(React.createElement(component, {...props, ...rest}))}
            </div>
          </div>
      );
    }}/>
  );
};

AuthPatientRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default createContainer(() => {
  const sidebarToggled = Session.get('sidebarToggled') || false
  const showProfileBackgroundModel = Session.get('showProfileBackgroundModel') || false;
  const showProfileImageModel = Session.get('showProfileImageModel') || false;
  document.body.style.overflow = (sidebarToggled || showProfileBackgroundModel || showProfileImageModel) ? 'hidden' : 'auto';

  return {
    sidebarToggled,
    showProfileBackgroundModel,
    showProfileImageModel
  }
}, AuthPatientRoute);
