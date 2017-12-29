import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';

import SymptomChart from '../SymptomChart';

export default class SymptomSelectGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphedSymptoms: [],
    }
    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange(e) {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // }

  render() {
    return (
      <div className='symptom-history__graph-view'>
        <div className='card'>
          <p>Select up to 5 symptoms to graph:</p>
          {this.props.symptoms.map(symptom =>
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
            checkins={this.props.checkins}
            currentSymptomNames={this.props.currentSymptomNames}
            padding={{top: 30, right: 30, bottom: 10, left: 0}}
          />
        </div>
      </div>
    );
  }
};
