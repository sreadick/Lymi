import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';

const PrivateHeader = (props) => {
  if (window.innerWidth > 768) {
    return (
      <div className={`nav-header private z-depth-1 ${props.accountType === 'doctor' ? 'doctor' : 'patient'}`} >
        <div className="nav-header__content">
          <div className="nav-header__content--left">
            <span
              className="nav-header__sidebar-icon"
              onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
              <i className='material-icons'>{Session.get('sidebarToggled') === true ? "clear" : "menu"}</i>
            </span>
            <Link className={`nav-header__link--title ${props.accountType === 'doctor' ? 'doctor' : 'patient'}`} to="/">{props.title}</Link>
          </div>
          <div className="nav-header__content--right">
            {Meteor.user() && <span className='nav-header__user-email'>{Meteor.user().emails[0].address}</span>}
            <Link className="nav-header__link" to="#" onClick={() => Accounts.logout()}>Logout</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="nav-header private z-depth-1">
      <div className="nav-header__content">
        <span
          className="nav-header__sidebar-icon"
          onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
          <i className='material-icons'>{Session.get('sidebarToggled') === true ? "clear" : "menu"}</i>
        </span>
        <Link className="nav-header__link--title" to="/">{props.title}</Link>
        <Link className="nav-header__link" to="#" onClick={() => Accounts.logout()}>Logout</Link>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default PrivateHeader;
