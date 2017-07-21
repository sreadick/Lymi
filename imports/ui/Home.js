import React from 'react';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import { UserSymptoms } from '../api/user-symptoms';
import { UserTreatments } from '../api/user-treatments';

import PrivateHeader from './PrivateHeader';
import SelectSymptomsPage from './SelectSymptomsPage';
import SelectTreatmentsPage from './SelectTreatmentsPage';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true
    };
  }
  componentDidUpdate() {
    if (this.props.UserSymptoms) {
      this.setState({
        isFetching: false
      });
    }
  }
  render() {
    return (
      <div>
        <PrivateHeader title='Lymi'/>
        {(!this.state.isFetching && this.props.userSymptoms.length === 0)
          ? <SelectSymptomsPage /> :
          <SelectTreatmentsPage />
        }
      </div>
    )
  }
};

export default createContainer(() => {
  Meteor.subscribe('userSymptoms');
  Meteor.subscribe('userTreatments');

  return {
    userSymptoms: UserSymptoms.find().fetch(),
    // userTreatments: UserTreatments.find().fetch(),
  };
}, Home);
