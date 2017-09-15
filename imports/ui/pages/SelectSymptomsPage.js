import React from 'react';
import { symptomsByCategory } from '../../public/resources/commonSymptoms';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import FlipMove from 'react-flip-move';
import { getNextColor } from '../../utils/utils';

import { UserSymptoms } from '../../api/user-symptoms';
import { CheckinHistories } from '../../api/checkin-histories';

import { SymptomGroup } from '../components/SymptomGroup';

class SelectSymptomsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      otherSymptomResponse: {}
    };
  }

  renderCommonSymptomsList() {
    return symptomsByCategory.map((symptomGroup) => {
      return (
        <SymptomGroup
          key={symptomGroup.category}
          category={symptomGroup.category}
          symptoms={symptomGroup.symptoms}
          userSymptoms={this.props.userSymptoms}
          nextColor={this.props.nextColor}>
        </SymptomGroup>
      )
    });
  }
  showSelectedSymptoms() {
    return this.props.userSymptoms.map((symptom) => {
      return (
        <li className="collection-item user-symptom" key={symptom._id} style={{background: symptom.color, color: 'white'}}>
          <div>
            {symptom.name}
            <span className="user-symptom__remove-icon">
              <a className='secondary-content' onClick={() => {
                Meteor.call('userSymptoms.remove', symptom.name);
              }}>
                <i className="material-icons" style={{color: '#777'}}>delete_forever</i>
              </a>
            </span>
          </div>
        </li>
      )
    });
  }

  render() {
    return (
      <div className="page-content">
        {(this.props.checkinHistoryIsReady && this.props.checkinHistory.checkins.length === 0)
          && <div className="intro_message_container" ref="intro_message_container">
            <h1>Welcome to Lymi</h1>
            <p>To get started select your symptoms from the list below. If your symptom isn't listed you can enter it at the bottom of the page.</p>
            <p onClick={() => this.refs.intro_message_container.classList.add('closed')}><span>Got it</span></p>
          </div>
        }
        <div className="">
          <div className="page-content__main-heading">Common Symptoms</div>

          <div className="z-depth-2 symptom-group__container">
            {this.renderCommonSymptomsList()}
            <div className='row otherSymptom'>
              <div className='col s12'>
                <div className="input-field">
                  <input type="text" id='otherSymptom' ref="otherSymptom" />
                  <label htmlFor='otherSymptom'>Other Symptom</label>
                  <div className={`input-response ${this.state.otherSymptomResponse.success ? 'light-green-text text-darken-2' : 'red-text text-darken-2'}`}
                    ref='otherSymptomResponseMessage'>
                    {this.state.otherSymptomResponse.message}
                  </div>
                </div>
              </div>
              <div className='col s12 center-align'>
                <button className="waves-effect waves-light btn black"
                  onClick={() => {
                    const symptomName = this.refs.otherSymptom.value.trim();
                    const uppercaseSymptomName = symptomName.charAt(0).toUpperCase() + symptomName.slice(1).toLowerCase();
                    if (uppercaseSymptomName.length >= 3 && uppercaseSymptomName.length <= 50 && !this.props.userSymptoms.find(symptom => symptom.name.toLowerCase() === uppercaseSymptomName.toLowerCase())) {
                      Meteor.call('userSymptoms.insert', {
                        name: uppercaseSymptomName,
                        color: this.props.nextColor
                      });
                      this.setState({
                        otherSymptomResponse: {
                          success: true,
                          message: `Added '${symptomName}'`
                        }
                      })
                      this.refs.otherSymptom.value = '';
                    } else if (uppercaseSymptomName.length < 3 || uppercaseSymptomName.length > 50) {
                      this.setState({
                        otherSymptomResponse: {
                          success: false,
                          message: `Must be between 3 and 50 characters`
                        }
                      })
                    } else {
                      this.setState({
                        otherSymptomResponse: {
                          success: false,
                          message: `'${symptomName}' already exists`
                        }
                      })
                    }
                    setTimeout(() => {
                      if (this.mounted === true) {
                        this.setState({
                          otherSymptomResponse: {
                            message: ''
                          }
                        });
                      }
                    }, 3000);
                  }}>
                  Add
                </button>
              </div>
            </div>
          </div>


          {/* <div className="page-content__user-selected-symptoms-container"> */}
            {/* <div className="page-content__subheading">Selected: </div> */}

          <ul className="collection with-header">
            <li className="collection-header"><h5>{this.props.userSymptoms.length > 0 ? 'Selected' : 'No symptoms are currently selected. Add at least one before moving on.'}</h5></li>
            <FlipMove duration={700} easing="ease-out">
              {this.showSelectedSymptoms()}
            </FlipMove>
          </ul>
        </div>
        <div className='row right-align'>
          {/* <div className='col m4'> */}
            <Link className={`waves-effect waves-light ${this.props.userSymptoms.length > 0 ? "btn-large" : "btn-large disabled"} green right`}
              to={this.props.userSymptoms.length > 0 ? "/home/selecttreatments" : "#"}>
              Next: Treatments
            </Link>
          {/* </div> */}
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const symptomHandle = Meteor.subscribe('userSymptoms');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
  const userSymptoms = UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch();
  return {
    userSymptoms,
    checkinHistory: CheckinHistories.findOne(),
    checkinHistoryIsReady,
    nextColor: userSymptoms.length > 0 ? getNextColor(userSymptoms.length) : getNextColor(0)
  }
}, SelectSymptomsPage);
