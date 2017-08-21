import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SidebarToggle } from './SidebarToggle';

const PrivateHeader = (props) => {
  return (
    <div className="nav-header private z-depth-1">
      <div className="nav-header__content">
        <div className="nav-header__content--left">
          <SidebarToggle />
          <Link className="nav-header__link--title" to="/">{props.title}</Link>
        </div>
        <div className="nav-header__content--right">
          {Meteor.user() && <span>{Meteor.user().emails[0].address}</span>}
          <Link className="nav-header__link" to="#" onClick={() => Accounts.logout()}>Logout</Link>
        </div>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default PrivateHeader;
