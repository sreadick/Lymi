import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import {capitalizePhrase, getColor} from '/imports/utils/utils';
import { Row, Input, Button } from 'react-materialize';

import SymptomChart from '../SymptomChart';

// Todo: fix include symptom checkbox glitch //

export default class SymptomSelectGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphedSymptoms: [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.includeDeletedSymptoms === true && this.props.includeDeletedSymptoms === false) {
      const graphedSymptoms = this.state.graphedSymptoms.slice();
      // const deletedSymptoms = prevProps.symptoms.filter(symptom => !prevProps.currentSymptomNames.includes(symptom.name))
      const currentGraphedSymptoms = graphedSymptoms.filter(symptom => prevProps.currentSymptomNames.includes(symptom.name))
      // deletedSymptoms.forEach((deletedSymptom) => {
      //   if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(deletedSymptom.name)) {
      //     const deletedSymptomIndex = graphedSymptoms.indexOf(deletedSymptom);
      //     graphedSymptoms.splice(deletedSymptomIndex, 1);
      //   }
      // });
      // console.log(graphedSymptoms);
      // console.log(currentGraphedSymptoms);
      this.setState({graphedSymptoms: currentGraphedSymptoms});
    }
  }

  render() {
    return (
      <div className='symptom-history__wrapper--select-five'>
        <div className='symptom-history__symptom-list--select-five'>
          {this.props.symptoms.map(symptom => {
            const graphedSymptoms = this.state.graphedSymptoms.slice();
            const isChecked = graphedSymptoms.includes(symptom);
            return (
              <Input
                key={symptom.name}
                type='checkbox'
                name='graphedSymptoms'
                value={symptom.name}
                // label={capitalizePhrase(symptom.name)}
                label={
                  <span
                    style={{
                      color: isChecked ? getColor(graphedSymptoms.indexOf(symptom)) : 'grey',
                      textDecoration: !this.props.currentSymptomNames.find(symptomName => symptomName === symptom.name) ? 'line-through' : 'normal'
                    }}>
                    {capitalizePhrase(symptom.name)}
                  </span>
                }
                isChecked={graphedSymptoms.includes(symptom.name)}
                disabled={graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
                onChange={() => {
                  // const graphedSymptoms = this.state.graphedSymptoms.slice();
                  if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
                    const symptomIndex = graphedSymptoms.indexOf(symptom)
                    graphedSymptoms.splice(symptomIndex, 1);
                  } else {
                    graphedSymptoms.push(symptom)
                  }
                  this.setState({graphedSymptoms})
                }}
              />
            );
          })}
        </div>
        <div className='symptom-history__chart-wrapper--select-five'>
          <SymptomChart
            symptomNames={this.state.graphedSymptoms.map(symptom => symptom.name)}
            symptomColors={this.state.graphedSymptoms.map((symptom, index) => getColor(index))}
            checkins={this.props.checkins}
            currentSymptomNames={this.props.currentSymptomNames}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            padding={{top: 30, right: 30, bottom: 10, left: 0}}
            height={150}
          />
        </div>
      </div>
    );
  }
};
