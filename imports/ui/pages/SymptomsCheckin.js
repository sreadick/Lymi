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
    this.refs[`${symptom.name}_symptom_container`].childNodes.forEach((node) => {
      node.classList.remove('highlighted');
    })
  }

  render() {
    if (this.props.symptomCheckinItems.length === 0) return <div></div>
    return (
      <div className="ui container">
        <h4 className="ui center aligned large grey header">How were your symptoms today?</h4>
        <div>
          {this.props.symptomCheckinItems.map((symptom) => (
            <div className="ui very padded container segment" key={symptom.name}>
              <h3 className="ui grey header">{symptom.name}</h3>
              {this.renderSeveritySquares(symptom)}
            </div>
          ))}
          <Link className={`ui black button ${!this.props.symptomCheckinCompleted && 'disabled'}`}
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
  // const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinItems = props.checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : {};

  return {
    symptomCheckinItems: checkinItems.symptoms || [],
    symptomCheckinCompleted: (props.checkinHistoryIsReady && checkinItems.symptoms.filter((symptom) => symptom.severity > 0).length === checkinItems.symptoms.length)
  }
}, SymptomsCheckin)
