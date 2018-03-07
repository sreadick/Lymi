import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

const PrivateHeader = (props) => {
  // if (window.innerWidth > 768) {
  if (!props.isfetching) {
    return (
      <div className={`nav-header private z-depth-1 ${props.accountType === 'doctor' ? 'doctor' : 'patient'}`} >
        <div className="nav-header__content--private">
          <div className="nav-header__content--left">
            {/* <div
              className="nav-header__sidebar-icon"
              onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
              <i className='material-icons'>{Session.get('sidebarToggled') === true ? "clear" : "menu"}</i>
            </div> */}

            <i
              className='nav-header__icon--menu material-icons'
              onClick={() => Session.set('sidebarToggled', !props.sidebarToggled) }>
              {props.sidebarToggled ? "clear" : "menu"}
            </i>
            <Link className={`nav-header__link--title ${props.accountType === 'doctor' ? 'doctor' : 'patient'}`} to="/">{props.title}</Link>
          </div>
          <div className="nav-header__content--right">
            {/* {Meteor.user() && <span className='nav-header__user-email'>{Meteor.user().emails[0].address}</span>} */}
            {/* <Link className="nav-header__link" to="#" onClick={() => Accounts.logout()}>Logout</Link> */}
            <div className='nav-header__icon__wrapper' onClick={() => alert('FAQ Page Coming Soon!')}>
              <i className='nav-header__icon--help material-icons'>help</i>
            </div>
            {props.path !== '/patient/account' &&
              <Link className='nav-header__icon__wrapper' to='/patient/account'>
                <i className='nav-header__icon--settings material-icons'>settings</i>
              </Link>
            }
            <div className='nav-header__icon__wrapper nav-header__profile-item' id='nav-header__button--avatar' onClick={(e) => {
              e.target.classList.add('active');
              const navHeaderProfileDropdown = document.getElementById('nav-header__dropdown--avatar');
              navHeaderProfileDropdown.classList.add('active');
            }}>
              {Meteor.user().profile.userPhoto ?
                <img src={Meteor.user().profile.userPhoto} className='nav-header__avatar nav-header__profile-item' onClick={() => document.getElementById('nav-header__button--avatar').classList.add('active')} />
              :
                <div className='nav-header__avatar--initial nav-header__profile-item' onClick={() => document.getElementById('nav-header__button--avatar').classList.add('active')}>
                  {Meteor.user().profile.firstName.charAt(0)}
                </div>
              }
              <div className='nav-header__dropdown--avatar nav-header__profile-item z-depth-4' id='nav-header__dropdown--avatar'>
                <div className='nav-header__dropdown--avatar__top-row'>
                  <div className='nav-header__dropdown--avatar__top-row__left'>
                    {Meteor.user().profile.userPhoto ?
                      <img src={Meteor.user().profile.userPhoto} className='nav-header__avatar' />
                      :
                      <div className='nav-header__avatar--initial'> {Meteor.user().profile.firstName.charAt(0)}</div>
                    }
                  </div>
                  <div className='nav-header__dropdown--avatar__top-row__right'>
                    <div className='nav-header__dropdown--avatar__text'>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</div>
                    <div className='nav-header__dropdown--avatar__text--email'>{Meteor.user().emails[0].address}</div>
                    <Link className="btn blue" to="/patient/profile">My Profile</Link>
                  </div>
                </div>
                <div className='nav-header__dropdown--avatar__bottom-row'>
                  <Link className="" to="#" onClick={() => Accounts.logout()}>Logout</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // return (
  //   <div className="nav-header private z-depth-1">
  //     <div className="nav-header__content">
  //       <span
  //         className="nav-header__sidebar-icon"
  //         onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
  //         <i className='material-icons'>{Session.get('sidebarToggled') === true ? "clear" : "menu"}</i>
  //       </span>
  //       <Link className="nav-header__link--title" to="/">{props.title}</Link>
  //       <Link className="nav-header__link" to="#" onClick={() => Accounts.logout()}>Logout</Link>
  //     </div>
  //   </div>
  // );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired
}


export default createContainer(props => {
  return {
    sidebarToggled: Session.get('sidebarToggled') || false,
    showProfileDropdown: Session.get('showProfileDropdown') || false,
    showAccountDropdown: Session.get('showAccountDropdown') || false,
    isfetching: !Meteor.user()
  }
}, PrivateHeader)
// export default PrivateHeader;
