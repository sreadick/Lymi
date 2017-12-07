import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import PublicHeader from '../components/PublicHeader';

const PublicRoute = ({ loggingIn, authenticated, account, component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => {
      return (
        !authenticated ?
          <div>
            <PublicHeader />
            {(React.createElement(component, {...props}))}
          </div>
        : account.type === 'doctor' ?
          <Redirect to="/doctor" />
        :
          <Redirect to="/patient" />
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
