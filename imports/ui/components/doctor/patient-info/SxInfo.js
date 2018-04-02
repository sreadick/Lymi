import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase, sortSymptoms} from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import SymptomChart from '../../patient/SymptomChart';

class SxInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'symptoms',
      graphedSymptoms: [],
    };
  }

  render() {
    const {props} = this;

    return (
      <div className='pt-summary__section'>
        {/* <ScrollableAnchor id={'SxHeading'}>
          <div className='pt-summary__heading pt-summary__heading--symptoms'>Symptoms</div>
        </ScrollableAnchor> */}
        <div className='pt-summary__subsection' id='pt-summary__subsection--select-five'>
          <div className='pt-summary__subheading'>Select 5</div>
          <div className='card'>
            {props.patientSymptoms.map(symptom =>
              <Input
                key={symptom.name}
                type='checkbox'
                name='graphedSymptoms'
                value={symptom.name}
                label={symptom.name}
                defaultChecked={this.state.graphedSymptoms.includes(symptom.name)}
                disabled={this.state.graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
                onChange={() => {
                  const graphedSymptoms = this.state.graphedSymptoms.slice();
                  if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
                    const symptomIndex = graphedSymptoms.indexOf(symptom)
                    graphedSymptoms.splice(symptomIndex, 1);
                  } else {
                    graphedSymptoms.push(symptom)
                  }
                  this.setState({graphedSymptoms})
                }}
              />
            )}
            <SymptomChart
              symptomNames={this.state.graphedSymptoms.map(symptom => symptom.name)}
              symptomColors={this.state.graphedSymptoms.map(symptom => symptom.color)}
              checkins={props.checkins}
              // currentSymptomNames={this.props.currentSymptomNames}
              // startDate={this.props.startDate}
              // endDate={this.props.endDate}
              height={120}
              padding={{top: 30, right: 30, bottom: 10, left: 0}}
            />
          </div>
        </div>

        <div className='pt-summary__subsection'>
          <div className='pt-summary__subheading'>By System</div>
          {props.patientSxSystems.map((system, index) =>
            <div key={index} className='card'>
              <h3 className='symptom-history__title--system'>{system}</h3>

              {props.patientSymptoms.filter(symptom => symptom.system === system).map(symptom => (
                <div key={symptom._id}>
                  <span
                    // className={`checkin-symptom-item ${!this.props.currentSymptomNames.find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
                    className={`checkin-symptom-item}`}
                    style={{
                      color: symptom.color,
                    }}>
                    {capitalizePhrase(symptom.name)}
                  </span>
                </div>
              ))}
              <SymptomChart
                // maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
                symptomNames={props.patientSymptoms.filter(symptom => symptom.system === system).map(symptom => symptom.name)}
                symptomColors={props.patientSymptoms.filter(symptom => symptom.system === system).map(symptom => symptom.color)}
                checkins={props.checkins}
                // currentSymptomNames={props.currentSymptomNames}
                padding={{top: 30, right: 30, bottom: 10, left: 0}}
              />
            </div>
          )}
        </div>

      </div>
    );
  }
}

export default createContainer((props) => {
  console.log(sortSymptoms(props.patientSymptoms, props.checkins, props.checkins[0].date, props.checkins[props.checkins.length - 1].date));

  return {

  };

}, SxInfo);
