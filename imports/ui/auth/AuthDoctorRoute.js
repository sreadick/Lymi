import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';

// import SidebarMenu from '../components/patient/SidebarMenu';

const AuthDoctorRoute = ({ loggingIn, authenticated, account, component, sidebarToggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        !authenticated ?
          // <Redirect to="/login" />
          <Redirect to="/" />
        : account.type === 'doctor' ?
          <div className="page doctor" onClick={(e) => {
            const navHeaderProfileDropdown = document.getElementById('nav-header__dropdown--avatar');
            const navHeaderAvatarButton = document.getElementById('nav-header__button--avatar');
            if (navHeaderProfileDropdown.classList.contains('active') && !e.target.classList.contains('nav-header__profile-item')) {
              navHeaderAvatarButton.classList.remove('active')
              navHeaderProfileDropdown.classList.remove('active')
            }
          }}>
            {/* <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/> */}
            <PrivateHeader title="LymeLog-MD" accountType={account.type} />
            {/* Todo: Change className and refactor */}
            <div className='message__wrapper--dashboard'>
              <div
                className='message--dashboard--success'
                id='message--dr-message--success'
                onTransitionEnd={() => {
                  setTimeout(() => {
                    document.getElementById('message--dr-message--success').classList.remove('active');
                  }, 4000);
                }}>
                <span>Message successfully sent.</span>
                <i className="material-icons right"
                  onClick={(e) => document.getElementById('message--dr-message--success').classList.remove('active')}>
                  close
                </i>
              </div>
            </div>
            <div>
              {(React.createElement(component, {...props, ...rest}))}
            </div>
            <Footer />
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
