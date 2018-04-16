import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import PublicHeader from '../components/PublicHeader';

class PublicRoute extends React.Component {
  componentDidMount(prevProps) {
    window.scrollTo(0, 0)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      window.scrollTo(0, 0)
    }
  }
  render() {
    const { loggingIn, authenticated, account, component, ...rest } = this.props;
    return (
      <Route {...rest} render={(props) => {
        return (
          !authenticated ?
            <div>
              <PublicHeader currentPath={props.location.pathname} />
              {(React.createElement(component, {...props}))}
            </div>
          : account.type === 'doctor' ?
            <Redirect to="/doctor" />
          : account.type === 'admin' ?
            <Redirect to="/admin" />
          :
            <Redirect to="/patient" />
        );
      }}/>
    );
  }
};

PublicRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func
}

export default PublicRoute;
