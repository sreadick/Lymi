import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default AuthAdminRoute = ({ loggingIn, authenticated, account, component, sidebarToggled, ...rest }) => {
  return (
    <Route render={(props) => {
      return (
        (!authenticated || account.type !== 'admin') ?
          <Redirect to="/" />
        :
          React.createElement(component, {...props})
      );
    }}/>
  );
};

AuthAdminRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}
