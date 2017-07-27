import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { CheckinHistories } from '../../api/checkin-histories';

class SymptomsCheckin extends React.Component {
  renderSeveritySquares(symptom) {
    return (
      <div ref={`${symptom.name}_container`} className="severity_container">
        {[1,2,3,4,5].map((severityNumber) =>
          <div className={`severity_square ${severityNumber <= symptom.severity ? "selected" : ""}`} key={severityNumber}
            onClick={() => this.changeSeverity(symptom, severityNumber)}
            onMouseOver={() => this.handleMouseOver(symptom, severityNumber)}
            onMouseOut={() => this.handleMouseOut(symptom)}>
            {severityNumber}
          </div>
        )}
      </div>
    );
  }

  handleMouseOver(symptom, severity) {
    for (i = 0; i < severity; ++i) {
      this.refs[`${symptom.name}_container`].childNodes[i].classList.add('highlighted');
    }
  }

  handleMouseOut(symptom) {
    this.removeHighlight(symptom);
  }

  changeSeverity(symptom, severity) {
    Meteor.call('checkinHistories.symptom.update', symptom, severity, moment().format('MMMM Do YYYY'))
    this.removeHighlight(symptom);
  }

  removeHighlight(symptom) {
    this.refs[`${symptom.name}_container`].childNodes.forEach((node) => {
      node.classList.remove('highlighted');
    })
  }

  render() {
    if (this.props.symptomCheckinItems.length === 0) return <div>fetching...</div>
    return (
        <div className="ui container">
          <h4 className="ui center aligned large brown header">How were your symptoms today?</h4>
          <div className="symptom-checkin-item">
            {this.props.symptomCheckinItems.map((symptom) => (
              <div className="ui very padded container segment" key={symptom.name}>
                <h3 className="ui grey header">{symptom.name}</h3>
                {this.renderSeveritySquares(symptom)}
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
    symptomCheckinItems: checkinHandle.ready() ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate).symptoms : [],
  }
}, SymptomsCheckin)
