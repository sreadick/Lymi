import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';
import SidebarMenu from '../components/SidebarMenu';

// ToDo
// create high level container for subscriptions

const AuthenticatedRoute = ({ loggingIn, authenticated, component, toggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        authenticated ?
          <div className="page">
            <SidebarMenu currentPath={props.location.pathname} toggled={toggled}/>
            <PrivateHeader title="Lymi"/>
            <div className='page-content'>
              {toggled &&
                <div className='page-content--overlay' onClick={() => Session.set('toggled', false)}></div>
              }
              <div>
                {(React.createElement(component, {...props}))}
              </div>
            </div>
          </div>
        : <Redirect to="/login" />
      );
    }}/>
  );
};

AuthenticatedRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default createContainer(() => {
  const toggled = Session.get('toggled') || false
  document.body.style.overflow = toggled ? 'hidden' : 'auto';
  return {
    toggled
  }
}, AuthenticatedRoute);
