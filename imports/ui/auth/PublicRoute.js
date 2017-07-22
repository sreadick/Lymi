import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicRoute = ({ loggingIn, authenticated, component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => {
      // if (loggingIn) {
      //   return (React.createElement('div', null, 'Please wait...'));
      // }
      return (
        !authenticated ? (React.createElement(component, {...props}))
        : <Redirect to="/home" />
      );
    }}/>
  );
};

PublicRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default PublicRoute;
