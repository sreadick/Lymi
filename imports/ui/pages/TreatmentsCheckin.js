import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../api/checkin-histories';

class SymptomCheckin extends React.Component {
  changeAnswer(treatment, answer) {
    Meteor.call('checkinHistories.treatment.update', treatment, answer, moment().format('MMMM Do YYYY'))
  }
  render() {
    if (this.props.treatmentCheckinItems.length === 0) return <div>fetching...</div>
    console.log(this.props.treatmentCheckinItems)
    return (
      <div>
        <h3>Did you take your medications today?</h3>
        <div>
          {this.props.treatmentCheckinItems.map((treatment) => (
            <div className="ui very padded container segment" key={treatment.name}>
              <h4>{treatment.name}</h4>
              <div>
                <div className="yes/no_square" onClick={() => this.changeAnswer(treatment, true)}>Yes</div>
                <div className="yes/no_square" onClick={() => this.changeAnswer(treatment, false)}>No</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const currentDate = moment().format('MMMM Do YYYY');
  const checkinHandle = Meteor.subscribe('checkinHistories');

  return {
    treatmentCheckinItems: checkinHandle.ready() ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate).treatments : [],
  }
}, SymptomCheckin)
