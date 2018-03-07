import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';
import ForumHeader from '../components/ForumHeader';
import SidebarMenu from '../components/patient/SidebarMenu';

const AuthPatientRoute = ({ loggingIn, authenticated, accountType, component, sidebarToggled, showProfileBackgroundModel, showProfileImageModel, isForumPage, ...rest }) => {
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
          <div className="page" onClick={(e) => {
            const navHeaderProfileDropdown = document.getElementById('nav-header__dropdown--avatar');
            const navHeaderAvatarButton = document.getElementById('nav-header__button--avatar');
            if (navHeaderProfileDropdown.classList.contains('active') && !e.target.classList.contains('nav-header__profile-item')) {
              navHeaderAvatarButton.classList.remove('active')
              navHeaderProfileDropdown.classList.remove('active')
            }
          }}>
            <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/>
            {isForumPage ?
              <ForumHeader title="Lyme Share" accountType={accountType} {...rest} />
              :
              <PrivateHeader title="LymeLog" accountType={accountType} {...rest} />
            }
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
            <Footer />
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

export default createContainer((props) => {
  const sidebarToggled = Session.get('sidebarToggled') || false
  const showProfileBackgroundModel = Session.get('showProfileBackgroundModel') || false;
  const showProfileImageModel = Session.get('showProfileImageModel') || false;
  document.body.style.overflow = (sidebarToggled || showProfileBackgroundModel || showProfileImageModel) ? 'hidden' : 'auto';
  return {
    sidebarToggled,
    showProfileBackgroundModel,
    showProfileImageModel,
    isForumPage: props.path.substring(0, 14) === '/patient/forum'
  }
}, AuthPatientRoute);
