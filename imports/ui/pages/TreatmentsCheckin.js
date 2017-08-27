import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../api/checkin-histories';

class TreatmentCheckin extends React.Component {
  renderAnswerSquares(treatment) {
    return (
      <div className="checkin-item__container">
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
    // if (this.props.treatmentCheckinItems.length === 0) return <div></div>
    return (
      <div className="page-content">
        <div className="checkin-item__container">
          <h4 className="grey-text">Check in for {moment().format('MMMM Do YYYY')}</h4>
          <h5 className="black-text">Did you take your medications?</h5>
          <Link className="blue btn" to="/home/checkin/symptoms">Back to symptoms</Link>
          {this.props.treatmentCheckinItems.map((treatment) => (
            <div className="card section" key={treatment.name}>
              <p>{treatment.name}</p>
              {this.renderAnswerSquares(treatment)}
            </div>
          ))}

          <button className={`black btn ${!this.props.treatmentCheckinCompleted && 'disabled'}`}
            onClick={() => {
              if (this.props.treatmentCheckinCompleted) {
                // Meteor.call('checkinHistories.dailyCompleted.update', "yes")
                this.props.history.replace("/home/dashboard");
              }
            }}>Finish!
          </button>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  const currentDate = moment().format('MMMM Do YYYY');
  const checkinItems = props.checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : {};

  return {
    treatmentCheckinItems: checkinItems.treatments || [],
    treatmentCheckinCompleted: (props.checkinHistoryIsReady && checkinItems.treatments.filter((treatment) => treatment.compliance !== null).length === checkinItems.treatments.length)
  }
}, TreatmentCheckin)
