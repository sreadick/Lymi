import React from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

const PublicHeader = (props) => (
  <div className={`nav-header public ${props.currentPath === '/signup' ? 'signup z-depth-1' : 'landing'}`}>
    <div className="nav-header__content">
      <div>
        <Link
          className={`nav-header__link--title public ${props.currentPath === '/clinicians' && 'nav-header__link--title--doctor'}`}
          to="/">
          {props.currentPath === '/clinicians' ?
            <span>LymeLog<sup>MD</sup></span> : props.title
          }
        </Link>
        {(props.currentPath === '/faq' || props.isMobileDevice) ?
          undefined
        :
          props.currentPath === '/clinicians' ?
          <Link className="nav-header__link public" to="/">Patients</Link>
        :
          <Link className="nav-header__link public" to="/clinicians">Clinicians</Link>
        }
        {(props.currentPath !== '/faq' && !props.isMobileDevice) &&
          <Link className="nav-header__link public" to="#">About Us</Link>
        }
        {(props.currentPath !== '/faq' && !props.isMobileDevice) &&
          <Link className="nav-header__link public" to="/faq">FAQs</Link>
        }
      </div>

      {/* <Link className="nav-header__link public" to="/login">Login</Link> */}
      <div>
        <Link className="nav-header__link public" to="#" onClick={() => Session.set('showLogin', true)}>Sign In</Link>
        <Link className="nav-header__link nav-header__link--signup public" to="/signup">Sign Up</Link>
      </div>
    </div>
  </div>
);

PublicHeader.propTypes = {
  title: PropTypes.string.isRequired
};

PublicHeader.defaultProps = {
  title: 'LymeLog'
};

// export default PublicHeader;
export default createContainer(props => {
  return {
    isMobileDevice: document.documentElement.clientWidth < 768
  }
}, PublicHeader);
