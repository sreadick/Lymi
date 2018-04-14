import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';
import ForumHeader from '../components/ForumHeader';
import SidebarMenu from '../components/patient/SidebarMenu';

// const AuthPatientRoute = ({ loggingIn, authenticated, account, component, sidebarToggled, showProfileBackgroundModel, showProfileImageModel, isForumPage, ...rest }) => {
class AuthPatientRoute extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const { loggingIn, authenticated, account, component, sidebarToggled, showProfileBackgroundModel, showProfileImageModel, ...rest } = this.props;
    return (
      <Route render={(props) => {
        return (
          !authenticated ?
            // <Redirect to="/login" />
            <Redirect to="/" />
          : account.type === 'doctor' ?
            <Redirect to="/doctor" />
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
              <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/>
              {/* {isForumPage ?
                <ForumHeader title="Lyme Share" accountType={account.type} {...rest} />
                : */}
              {/* <PrivateHeader title={!isForumPage ? 'LymeLog' : "Lyme Share" } accountType={account.type} isForumPage={isForumPage} {...rest} /> */}
              <PrivateHeader title='LymeLog' accountType={account.type} isForumPage={false} {...rest} />
              {/* } */}
              <div className='message__wrapper--dashboard'>
                <div
                  className='message--dashboard--success'
                  id='message--dashboard--success'
                  onTransitionEnd={() => {
                    setTimeout(() => {
                      document.getElementById('message--dashboard--success').classList.remove('active');
                    }, 4000);
                  }}>
                  <span>Thanks for checking in!</span>
                  <i className="material-icons right"
                    onClick={(e) => document.getElementById('message--dashboard--success').classList.remove('active')}>
                    close
                  </i>
                </div>
              </div>
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
  }
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
    // isForumPage: props.path.substring(0, 14) === '/patient/forum'
  }
}, AuthPatientRoute);
