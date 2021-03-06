import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../../api/checkin-histories';

class NotableEventsCheckin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventMessage: props.notableEventsMessage || ''
    }
  }

  eventMessageChange(e) {
    this.setState({eventMessage: e.target.value});
  }

  render() {
    // if (this.props.treatmentCheckinItems.length === 0) return <div></div>
    return (
      <div className="">
        <div className="checkin-item__container">
          {/* <h4 className="grey-text">Check in for {moment().format('MMMM Do YYYY')}</h4> */}
          {/* <Link className="blue btn" to="/home/checkin/symptoms">Back to symptoms</Link> */}
          {/* {this.props.trackedItems.includes('treatments') &&
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
          </button> */}

          <h5>Notable Events</h5>
          <div className="checkin-item__textarea row">
            <div className="input-field col s12">
              <textarea id="textarea1" className="materialize-textarea" value={this.state.eventMessage} onChange={this.eventMessageChange.bind(this)}></textarea>
              {/* <label htmlFor="textarea1" className='active'>Anything unusual happen today?</label> */}
            </div>
          </div>

          <button className={`indigo darken-3 btn disabled'}`}
            onClick={() => {
              Meteor.call('checkinHistories.notableEvents.update', this.state.eventMessage.trim(), this.props.targetDate);
              this.props.navigateToComponent("dashboard");
            }}>
            Save Notes and Finish!
          </button>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  // const currentDate = moment().format('MMMM Do YYYY');

  return {
    // treatmentCheckinItems: checkinItems.treatments || [],
  }
}, NotableEventsCheckin)
