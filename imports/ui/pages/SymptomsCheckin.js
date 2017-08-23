import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';


import { CheckinHistories } from '../../api/checkin-histories';

class SymptomsCheckin extends React.Component {
  renderSeveritySquares(symptom) {
    return (
      <div ref={`${symptom.name}_symptom_container`} className="checkin-item__answer-group">
        {[1,2,3,4,5].map((severityNumber) =>
          <div className={`severity checkin-item__answer-square ${severityNumber <= symptom.severity ? "selected" : ""}`} key={severityNumber}
            onClick={() => this.chooseSeverity(symptom, severityNumber)}
            onMouseOver={(e) => this.handleMouseOver(e, symptom, severityNumber)}
            onMouseOut={() => this.handleMouseOut(symptom)}>
            {severityNumber}
          </div>
        )}
      </div>
    );
  }

  handleMouseOver(e, symptom, severityNumber) {
    for (i = 0; i < severityNumber; ++i) {
      if (parseInt(e.target.innerHTML) !== symptom.severity) {
        this.refs[`${symptom.name}_symptom_container`].childNodes[i].classList.add('highlighted');
      }
    }
  }

  handleMouseOut(symptom) {
    this.removeHighlight(symptom);
  }

  chooseSeverity(symptom, severityNumber) {
    Meteor.call('checkinHistories.symptom.update', symptom, severityNumber, moment().format('MMMM Do YYYY'))
    this.removeHighlight(symptom);
  }

  removeHighlight(symptom) {
    const nodeArray = Array.from(this.refs[`${symptom.name}_symptom_container`].childNodes);
    nodeArray.forEach((node) => {
      node.classList.remove('highlighted');
    })
  }

  render() {
    if (this.props.symptomCheckinItems.length === 0) return <div></div>
    return (
      <div className="page-content">
        <h4 className="grey-text">Check in for {moment().format('MMMM Do YYYY')}</h4>
        <h5 className="black-text">How were your symptoms today?</h5>
        <div>
          {this.props.symptomCheckinItems.map((symptom) => (
            <div className="card section" key={symptom.name}>
              <p>{symptom.name}</p>
              {
                (this.props.yesterdaysCheckin && !!this.props.yesterdaysCheckin.symptoms.find((yesterdaysCheckinSymptom) => yesterdaysCheckinSymptom.name === symptom.name && yesterdaysCheckinSymptom.severity > 0))
                && <span>Yesterday: {this.props.yesterdaysCheckin.symptoms.find((yesterdaysCheckinSymptom) => yesterdaysCheckinSymptom.name === symptom.name).severity}</span>
              }
              {this.renderSeveritySquares(symptom)}
            </div>
          ))}
          <Link className={`black btn ${!this.props.symptomCheckinCompleted && 'disabled'}`}
            to={this.props.symptomCheckinCompleted ? "/home/checkin/treatments" : "#"}>
            Next
          </Link>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  const currentDate = moment().format('MMMM Do YYYY');
  const checkinItems = props.checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : {};

  return {
    symptomCheckinItems: checkinItems.symptoms || [],
    symptomCheckinCompleted: (props.checkinHistoryIsReady && checkinItems.symptoms.filter((symptom) => symptom.severity > 0).length === checkinItems.symptoms.length)
  }
}, SymptomsCheckin)
