import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { capitalizePhrase } from '../../../utils/utils';

// import { CheckinHistories } from '../../api/checkin-histories';

class SymptomsCheckin extends React.Component {
  renderSeveritySquares(symptom) {
    return (
      <div ref={`${symptom.name}_symptom_container`} className="checkin-item__answer-group">
        {[1,2,3,4,5,6,7].map((severityNumber) =>
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
    Meteor.call('checkinHistories.symptom.update', symptom, severityNumber, this.props.targetDate)
    this.removeHighlight(symptom);
  }

  removeHighlight(symptom) {
    const nodeArray = Array.from(this.refs[`${symptom.name}_symptom_container`].childNodes);
    nodeArray.forEach((node) => {
      node.classList.remove('highlighted');
    })
  }

  componentDidMount() {
    // if (this.props.fromTreatmentsCheckin === false && this.props.symptomCheckinCompleted && this.props.treatmentCheckinItems.length > 0 && !!this.props.treatmentCheckinItems.find((treatment) => treatment.compliance === null)) {
    //   this.props.history.push('/home/checkin/treatments')
    // }
  }

  render() {
    if (this.props.symptomCheckinItems.length === 0) return <div></div>
    return (
      <div className="">
        <div className="checkin-item__container">

          {/* <h4 className="grey-text">Check in for {moment().format('MMMM Do YYYY')}</h4> */}
          <h5>How were your symptoms today?</h5>
          <div>
            {this.props.symptomCheckinItems.map((symptom) => (
              <div className="card section grey lighten-3" key={symptom.name}>
                <p>{capitalizePhrase(symptom.name)}</p>
                {
                  (this.props.yesterdaysCheckin && !!this.props.yesterdaysCheckin.symptoms.find((yesterdaysCheckinSymptom) => yesterdaysCheckinSymptom.name === symptom.name && yesterdaysCheckinSymptom.severity > 0))
                  && <em className='grey-text'>Yesterday: {this.props.yesterdaysCheckin.symptoms.find((yesterdaysCheckinSymptom) => yesterdaysCheckinSymptom.name === symptom.name).severity}</em>
                }
                {this.renderSeveritySquares(symptom)}
              </div>
            ))}
            {/* <Link className={`black btn ${!this.props.symptomCheckinCompleted && 'disabled'}`}
              to={this.props.symptomCheckinCompleted ?
                this.props.treatmentCheckinItems.length === 0 ? "/home/dashboard" : "/home/checkin/treatments"
                : "#"
              }>
              {this.props.treatmentCheckinItems.length === 0 ? 'Finish' : 'Next'}
            </Link> */}
            <button
              // className={`black btn ${!this.props.symptomCheckinCompleted && 'disabled'}`}
              className={`${!this.props.symptomCheckinCompleted ? 'disabled' : this.props.trackedItems.length > 1 ? 'blue-grey lighten-1' : 'indigo darken-3'} btn`}
              onClick={() => {
                this.props.trackedItems.includes('treatments') ? this.props.navigateToComponent('treatments') :
                this.props.trackedItems.includes('notable events') ? this.props.navigateToComponent('notable events') :
                this.props.navigateToComponent('dashboard')
              }}>
              {
                this.props.trackedItems.includes('treatments') ? 'Treatments' :
                this.props.trackedItems.includes('notable events') ? 'Notable Events' :
                "Finish!"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  // const currentDate = moment().format('MMMM Do YYYY');
  // const checkinItems = props.checkinHistoryIsReady ? CheckinHistories.findOne().checkins.find((checkin) => checkin.date === currentDate) : {};
  return {
    // symptomCheckinItems: checkinItems.symptoms || [],
    // treatmentCheckinItems: checkinItems.treatments || [],
    // symptomCheckinCompleted: (props.symptomCheckinItems.filter((symptom) => symptom.severity > 0).length === props.symptomCheckinItems.length)
  }
}, SymptomsCheckin)
