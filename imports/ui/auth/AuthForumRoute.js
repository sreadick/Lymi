import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';

// import SidebarMenu from '../components/patient/SidebarMenu';

const AuthForumRoute = ({ loggingIn, authenticated, account, component, sidebarToggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        !authenticated ?
          // <Redirect to="/login" />
          <Redirect to="/" />
        : account.type === 'admin' ?
          <Redirect to="/admin" />
        :
          <div className="page" onClick={(e) => {
            const navHeaderProfileDropdown = document.getElementById('nav-header__dropdown--avatar');
            const navHeaderAvatarButton = document.getElementById('nav-header__button--avatar');
            const navHeaderNotificationsDropdown = document.getElementById('nav-header__dropdown--notifications');
            const navHeaderNotificationsButton = document.getElementById('nav-header__button--notifications');
            if (navHeaderProfileDropdown.classList.contains('active') && !e.target.classList.contains('nav-header__profile-item')) {
              navHeaderAvatarButton.classList.remove('active')
              navHeaderProfileDropdown.classList.remove('active')
            } else if (navHeaderNotificationsDropdown && navHeaderNotificationsDropdown.classList.contains('active') && !e.target.classList.contains('nav-header__notifications-item')) {
              navHeaderNotificationsButton.classList.remove('active')
              navHeaderNotificationsDropdown.classList.remove('active')
            }
          }}>
            {/* <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/> */}
            <PrivateHeader title='Lyme Share' accountType={account.type} isForumPage={true} {...rest} />
            <div>
              {(React.createElement(component, {...props, ...rest}))}
            </div>
            <Footer />
          </div>
      );
    }}/>
  );
};

AuthForumRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default createContainer(() => {
  // const sidebarToggled = Session.get('sidebarToggled') || false
  // document.body.style.overflow = (sidebarToggled || showProfileBackgroundModel || showProfileImageModel) ? 'hidden' : 'auto';

  return {
    // sidebarToggled: false,
  }
}, AuthForumRoute);
