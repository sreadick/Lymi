import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';


import PrivateHeader from '../components/PrivateHeader';
import SidebarMenu from '../components/SidebarMenu';

// ToDo
// create high level container for subscriptions

const AuthenticatedRoute = ({ loggingIn, authenticated, component, sidebarToggled, showProfileBackgroundModel, ...rest }) => {

  return (
    <Route render={(props) => {
      return (
        authenticated ?
          <div className="page">
            <SidebarMenu currentPath={props.location.pathname} sidebarToggled={sidebarToggled}/>
            <PrivateHeader title="Lymi"/>
            {(sidebarToggled || showProfileBackgroundModel) &&
              <div className='page-content--overlay' onClick={() => {
                Session.set('sidebarToggled', false);
                Session.set('showProfileBackgroundModel', false);
              }}></div>
            }
            <div>
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

export default createContainer(() => {
  const sidebarToggled = Session.get('sidebarToggled') || false
  const showProfileBackgroundModel = Session.get('showProfileBackgroundModel') || false;
  document.body.style.overflow = (sidebarToggled || showProfileBackgroundModel) ? 'hidden' : 'auto';

  // const checkinHandle = Meteor.subscribe('checkinHistories');
  // const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  // const currentDate = moment().format('MMMM Do YYYY');
  //
  // const todaysCheckin = checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : undefined;

  // let dailyCheckinStatus = undefined;
  // if (checkinHistoryIsReady) {
  //   if (!todaysCheckin) {
  //     dailyCheckinStatus = 'incomplete';
  //   } else if (todaysCheckin.symptoms.some((symptomCheckin) => symptomCheckin.severity > 0)) {
  //     dailyCheckinStatus = 'partially complete';
  //   } else if (todaysCheckin.symptoms.every((symptomCheckin) => symptomCheckin.severity > 0) && todaysCheckin.treatments.every((treatmentCheckin) => treatmentCheckin.compliance !== null)) {
  //     dailyCheckinStatus = 'complete';
  //   }
  // }


  return {
    sidebarToggled,
    showProfileBackgroundModel
    // dailyCheckinStatus
  }
}, AuthenticatedRoute);
