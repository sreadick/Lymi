import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateHeader = (props) => {
  return (
    <div className="nav-header private">
      <div className="nav-header__content">
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
