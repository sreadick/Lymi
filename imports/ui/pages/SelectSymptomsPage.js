import React from 'react';
import { symptomsByCategory } from '../../public/resources/commonSymptoms';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { UserSymptoms } from '../../api/user-symptoms';
import { CheckinHistories } from '../../api/checkin-histories';

// import SymptomCheckbox from '../components/SymptomCheckbox';
import { SymptomGroup } from '../components/SymptomGroup';

class SelectSymptomsPage extends React.Component {

  renderCommonSymptomsList() {
    return symptomsByCategory.map((symptomGroup) => {
      return (
        <SymptomGroup
          key={symptomGroup.category}
          category={symptomGroup.category}
          symptoms={symptomGroup.symptoms}
          userSymptoms={this.props.userSymptoms}>
        </SymptomGroup>
      )
    });
  }

  showSelectedSymptoms() {
    return this.props.userSymptoms.map((symptom) => {
      return (
        <div key={symptom._id}>
          <h3 className="user-symptom" style={{color: symptom.color}}>{symptom.name}
            <span className="user-symptom__remove-icon"
              onClick={() => {
                Meteor.call('userSymptoms.remove', symptom.name);
              }}>
              <i className="remove right floated red icon"></i>
            </span>
          </h3>
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        {(this.props.checkinHistoryIsReady && this.props.checkinHistory.checkins.length === 0)
          && <div className="intro_message_container" ref="intro_message_container">
            <h1>Welcome to Lymi</h1>
            <p>To get started select your symptoms from the list below. If your symptom isn't listed you can enter it at the bottom of the page.</p>
            <p onClick={() => this.refs.intro_message_container.classList.add('closed')}><span>Got it</span></p>
          </div>
        }
        <div className="">
          <div className="page-content__main-heading">Common Symptoms</div>

          <div className="symptom-group__container">
            {this.renderCommonSymptomsList()}
            <div className="ui action input">
              <input ref="otherSymptom" type="text" placeholder="Other..." />
              <button className="ui button"
                onClick={() => {
                  const handledSymptom = this.refs.otherSymptom.value.charAt(0).toUpperCase() + this.refs.otherSymptom.value.slice(1).toLowerCase().trim();
                  if (handledSymptom.length > 0 && !this.props.userSymptoms.find(symptom => symptom.name.toLowerCase() === handledSymptom.toLowerCase())) {
                    Meteor.call('userSymptoms.insert', handledSymptom);
                  }
                }}>
                Add
              </button>
            </div>
          </div>


          <div className="page-content__user-selected-symptoms-container">
            <Link className={"ui large green right floated " + (this.props.userSymptoms.length > 0 ? "button" : "disabled button")}
              to={this.props.userSymptoms.length > 0 ? "/home/selecttreatments" : "#"}>
              Treatments
            </Link>
            <div className="page-content__subheading">Selected: </div>
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
  const symptomHandle = Meteor.subscribe('userSymptoms');
  const checkinHandle = Meteor.subscribe('checkinHistories');

  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();

  return {
    userSymptoms: UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch(),
    checkinHistory: CheckinHistories.findOne(),
    checkinHistoryIsReady
  }
}, SelectSymptomsPage);
