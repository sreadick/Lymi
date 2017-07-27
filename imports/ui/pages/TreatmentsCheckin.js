import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../api/checkin-histories';

class TreatmentCheckin extends React.Component {
  renderAnswerSquares(treatment) {
    return (
      <div className="checkin-item__answer-group">
        {['Yes', 'No'].map((answer) =>
          <div className={`${answer} checkin-item__answer-square ${answer === treatment.compliance ? "selected" : ""}`} key={answer}
            onClick={(e) => this.chooseAnswer(e, treatment, answer)}
            onMouseOver={(e) => this.handleMouseOver(e)}
            onMouseOut={(e) => this.handleMouseOut(e)}>
            {answer}
          </div>
        )}
      </div>
    );
  }

  handleMouseOver(e) {
    if (!e.target.className.includes("selected")) {
      e.target.classList.add("highlighted")
    }
  }

  handleMouseOut(e) {
    e.target.classList.remove("highlighted")
  }

  chooseAnswer(e, treatment, answer) {
    Meteor.call('checkinHistories.treatment.update', treatment, answer, moment().format('MMMM Do YYYY'));
    e.target.classList.remove("highlighted")
  }
  render() {
    if (this.props.treatmentCheckinItems.length === 0) return <div>fetching...</div>
    return (
      <div className="ui container">
        <h4 className="ui center aligned large brown header">Did you take your medications?</h4>
        <div className="checkin-item__container">
          {this.props.treatmentCheckinItems.map((treatment) => (
            <div className="ui very padded container segment" key={treatment.name}>
              <h3 className="ui grey header">{treatment.name}</h3>
              {this.renderAnswerSquares(treatment)}
            </div>
          ))}
        </div>
        <button className={`ui basic green button ${!this.props.treatmentCheckinCompleted && 'disabled'}`}
          onClick={() => {
            if (this.props.treatmentCheckinCompleted) {
              Meteor.call('checkinHistories.dailyCompleted.update')
              this.props.history.replace("/home/dashboard");
            }
          }}>Finish
        </button>
      </div>
    );
  }
};

export default createContainer(() => {
  const currentDate = moment().format('MMMM Do YYYY');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinItems = checkinHandle.ready() ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : {};

  return {
    treatmentCheckinItems: checkinItems.treatments || [],
    treatmentCheckinCompleted: (checkinHandle.ready() && checkinItems.treatments.filter((treatment) => treatment.compliance !== null).length === checkinItems.treatments.length)
  }
}, TreatmentCheckin)
