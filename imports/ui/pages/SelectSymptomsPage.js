import React from 'react';
import { symptomsByCategory } from '../../public/resources/commonSymptoms';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { UserSymptoms } from '../../api/user-symptoms';

import SymptomCheckbox from '../components/SymptomCheckbox';

class SelectSymptomsPage extends React.Component {
  renderCommonSymptomsList() {
    return symptomsByCategory.map((symptomGroup) => {
      return (
        <div>
          <h3>{ symptomGroup.category }</h3>
          {symptomGroup.symptoms.map((symptom) =>
            <SymptomCheckbox
              key={symptom}
              symptom={symptom}
              isChecked={this.props.userSymptomNames.includes(symptom)}
            />
          )}
        </div>
      )
    });
  }

  showSelectedSymptoms() {
    Meteor.subscribe('userSymptoms');
    return this.props.userSymptoms.map((symptom) => {
      return <p key={symptom._id}>{symptom.name}</p>
    });
  }

  render() {
    return (
      <div>
        <div className="page-content">
          <h1>Common Symptoms</h1>
          <div>
            {this.renderCommonSymptomsList()}
          </div>
          <div>
            <h2>Selected: </h2>
            <div>
              {this.showSelectedSymptoms()}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {

  return {
    userSymptoms: UserSymptoms.find().fetch(),
    userSymptomNames: UserSymptoms.find().fetch().map((symptom) => symptom.name)
  }
}, SelectSymptomsPage);
