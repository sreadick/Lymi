import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import PrivateHeader from '../components/PrivateHeader';

const AuthenticatedRoute = ({ loggingIn, authenticated, component }) => {
  return (
    <Route render={(props) => {
      // if (loggingIn) {
      //   return (React.createElement('div', null, 'Please wait...'));
      // }
      return (
        authenticated ?
        <div>
          <PrivateHeader title="Lymi"/>
          {(React.createElement(component, {...props}))}
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
