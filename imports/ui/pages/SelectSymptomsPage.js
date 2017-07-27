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
          <h3 className="user-symptom">{symptom.name}
            <span className="user-symptom__remove-icon"
              onClick={() => {
                Meteor.call('userSymptoms.remove', symptom.name);
              }}>
              <i className="remove large right floated red icon"></i>
            </span>
          </h3>
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
                  <input ref="otherSymptom" type="text" placeholder="Other..." />
                </div>
                <div className="ui padded container">
                  <button className="ui basic black button"
                    onClick={() => {
                      if (this.refs.otherSymptom.value.trim().length > 0) {
                        Meteor.call('userSymptoms.insert', this.refs.otherSymptom.value.trim());
                      }
                    }}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-content__segment">
          <div className="ui container">
            <div className="ui vertical stripe segment">
              <h2 className="ui header">Selected: </h2>
              <Link className={"ui large green right floated " + (this.props.userSymptoms.length > 0 ? "button" : "disabled button")}
                to={this.props.userSymptoms.length > 0 ? "/home/selecttreatments" : "#"}>
                Next
              </Link>
              <div className="ui container">
                {this.showSelectedSymptoms()}
              </div>
            </div>
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
