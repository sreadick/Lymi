import React from 'react';
import { symptomsByCategory } from '../../public/resources/commonSymptoms';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { UserSymptoms } from '../../api/user-symptoms';
import { CheckinHistories } from '../../api/checkin-histories';

import SymptomCheckbox from '../components/SymptomCheckbox';

class SelectSymptomsPage extends React.Component {

  renderCommonSymptomsList() {
    const userSymptomNames = this.props.userSymptoms.map((us) => us.name);

    return symptomsByCategory.map((symptomGroup) => {
      return (
        <div className="symptom-group" key={symptomGroup.category}>
          <h4 className="symptom-group__category">{ symptomGroup.category }</h4>
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
      <div>
        {(this.props.checkinHistoryIsReady && this.props.checkinHistory.checkins.length === 0)
          && <div className="intro_message_container" ref="intro_message_container">
            <h1>Welcome to Lymi</h1>
            <p>To get started select your symptoms from the list below. If your symptom isn't listed you can enter it at the botom of the page.</p>
            <p onClick={() => this.refs.intro_message_container.classList.add('closed')}><span>Got it</span></p>
          </div>
        }
        <div className="ui container">
          <div className="page-content__main-heading">Common Symptoms</div>

          <div className="symptom-group__container">
            {this.renderCommonSymptomsList()}
          </div>

            <div className="ui padded container">
              <div className="ui large action input">
                <input ref="otherSymptom" type="text" placeholder="Other..." />
                <button className="ui black button"
                  onClick={() => {
                    const handledSymptom = this.refs.otherSymptom.value.charAt(0).toUpperCase() + this.refs.otherSymptom.value.slice(1).toLowerCase().trim();
                    console.log(handledSymptom)
                    if (handledSymptom.length > 0 && !this.props.userSymptoms.find(symptom => symptom.name.toLowerCase() === handledSymptom.toLowerCase())) {
                      Meteor.call('userSymptoms.insert', handledSymptom);
                    }
                  }}>
                  Add
                </button>
              </div>
            </div>
          <div className="page-content__user-selected-symptoms-container">
            <div className="ui container">
              <div className="ui vertical segment">
                <h2 className="ui header">Selected: </h2>
                <Link className={"ui large green right floated " + (this.props.userSymptoms.length > 0 ? "button" : "disabled button")}
                  to={this.props.userSymptoms.length > 0 ? "/home/selecttreatments" : "#"}>
                  Next
                </Link>
                <div>
                  {this.showSelectedSymptoms()}
                </div>
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
  const checkinHandle = Meteor.subscribe('checkinHistories')

  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();


  return {
    userSymptoms: UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch(),
    checkinHistory: CheckinHistories.findOne(),
    checkinHistoryIsReady
  }
}, SelectSymptomsPage);
