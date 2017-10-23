import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicHeader = (props) => (
  <div className="nav-header public">
    <div className="nav-header__content">
      <Link className="nav-header__link--title public" to="/">{props.title}</Link>
      <Link className="nav-header__link public" to="/login">Login</Link>
    </div>
  </div>
);

PublicHeader.propTypes = {
  title: PropTypes.string.isRequired
};

PublicHeader.defaultProps = {
  title: 'LymeLog'
};

export default PublicHeader;
