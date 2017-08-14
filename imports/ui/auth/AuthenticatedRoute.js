import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';

// ToDo
// create high level container for subscriptions

const AuthenticatedRoute = ({ loggingIn, authenticated, component, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        authenticated ?
          <div className="page">
            <PrivateHeader title="Lymi"/>
            <div className="page-content">
            {(React.createElement(component, {...props}))}
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

export default AuthenticatedRoute;
