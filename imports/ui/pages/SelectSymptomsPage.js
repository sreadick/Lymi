import React from 'react';
import { symptomsByCategory } from '../../public/resources/commonSymptoms';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { UserSymptoms } from '../../api/user-symptoms';

import SymptomCheckbox from '../components/SymptomCheckbox';

class SelectSymptomsPage extends React.Component {

  renderCommonSymptomsList() {
    const userSymptomNames = this.props.userSymptoms.map((us) => us.name);

    return symptomsByCategory.map((symptomGroup) => {
      return (
        <div className="four wide column" key={symptomGroup.category}>
          <h4 className="category">{ symptomGroup.category }</h4>
          <div className=''>
            {symptomGroup.symptoms.map((symptom) => {
              return (
                <SymptomCheckbox
                  key={symptom}
                  symptom={symptom}
                  isChecked={userSymptomNames.includes(symptom)}
                />
              )
            })}
          </div>
        </div>
      )
    });
  }

  showSelectedSymptoms() {

    return this.props.userSymptoms.map((symptom) => {
      return (
        <div key={symptom._id}>
          <h3>{symptom.name}</h3>
        </div>
      )
    });
  }

  render() {
    return (
      <div className="page-content">
        <h1 className="ui center aligned header">Common Symptoms</h1>
        <div className="page-content__segment">
          <div className="ui padded segment">
            <div className="ui stackable centered grid container">
              {this.renderCommonSymptomsList()}
              <div className="ui padded container">
                <div className="ui large input">
                  <input type="text" placeholder="Other..." />
                </div>
                <button className="ui green button">Add</button>
              </div>
            </div>
          </div>
        </div>
        <div className="page-content__segment">
          <div className="ui container">
            <div>
              <h2>Selected: </h2>
              <div>
                {this.showSelectedSymptoms()}
              </div>
            </div>
            <Link className={"ui purple left floated " + (this.props.userSymptoms.length > 0 ? "button" : "disabled button")}
              to={this.props.userSymptoms.length > 0 ? "/home/selecttreatments" : "#"}>
              Next
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  Meteor.subscribe('userSymptoms');
  return {
    userSymptoms: UserSymptoms.find().fetch(),
    // userSymptomNames: UserSymptoms.find().fetch().map((symptom) => symptom.name)
  }
}, SelectSymptomsPage);
