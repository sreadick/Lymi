import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicHeader = (props) => (
  <div className="nav-header">
    <div className="nav-header__content">
      <Link className="nav-header__link--title" to="/">{props.title}</Link>
      <Link className="nav-header__link" to="/login">Login</Link>
    </div>
  </div>
);

PublicHeader.propTypes = {
  title: PropTypes.string.isRequired
};

PublicHeader.defaultProps = {
  title: 'Lymi'
};

export default PublicHeader;
