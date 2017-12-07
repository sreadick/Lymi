import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../../api/checkin-histories';

class NotableEventsCheckin extends React.Component {
  eventMessageChange(e) {
    Meteor.call('checkinHistories.notableEvents.update', e.target.value, this.props.targetDate);
  }

  render() {
    // if (this.props.treatmentCheckinItems.length === 0) return <div></div>
    return (
      <div className="page-content">
        <div className="checkin-item__container">
          {/* <h4 className="grey-text">Check in for {moment().format('MMMM Do YYYY')}</h4> */}
          {/* <Link className="blue btn" to="/home/checkin/symptoms">Back to symptoms</Link> */}
          {this.props.trackedItems.includes('treatments') &&
            <button
              className='blue btn'
              onClick={() => this.props.navigateToComponent("treatments")}>
              Back to treatments
            </button>
          }
          <button
            className='blue btn'
            onClick={() => this.props.navigateToComponent("symptoms")}>
            Back to symptoms
          </button>

          <h5 className="black-text">Notable Events</h5>
          <div className="row">
            <div className="input-field col s12">
              <textarea id="textarea1" className="materialize-textarea" value={this.props.notableEventsMessage} onChange={this.eventMessageChange.bind(this)}></textarea>
              <label htmlFor="textarea1" className='active'>Anything unusual happen today?</label>
            </div>
          </div>

          <button className={`black btn disabled'}`}
            onClick={() => this.props.navigateToComponent("dashboard")}>
            Finish!
          </button>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  const currentDate = moment().format('MMMM Do YYYY');

  return {
    // treatmentCheckinItems: checkinItems.treatments || [],
  }
}, NotableEventsCheckin)
