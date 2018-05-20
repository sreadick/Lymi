import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import {capitalizePhrase} from '/imports/utils/utils';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import { CheckinHistories } from '../../../api/checkin-histories';
import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';

import Loader from '/imports/ui/components/Loader';
import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart';

import PtInfoSideNav from '../../components/doctor/PtInfoSideNav';

configureAnchors({offset: -120, scrollDuration: 800});

class PatientSummary extends React.Component {
  constructor() {
    super();

    this.state = {
      activeLink: 'symptoms',
      graphedSymptoms: [],
    };
  }
  componentDidMount() {
    // const navHeader = document.querySelector('.pt-summary__header');
    const symptomAnchorTopPosition = document.querySelector('.pt-summary__heading--symptoms').getBoundingClientRect().top;
    const treatmentAnchorTopPosition = document.querySelector('.pt-summary__heading--treatments').getBoundingClientRect().top;
    const infoAnchorTopPosition = document.querySelector('.pt-summary__heading--info').getBoundingClientRect().top;
    const header1height = document.querySelector('.nav-header.private.doctor').getBoundingClientRect().height;
    const header2height = document.querySelector('.pt-summary__header__wrapper').getBoundingClientRect().height;
    const headerHeights = header1height + header2height;

    document.addEventListener('scroll', () => {
      if (window.scrollY + headerHeights >= Math.floor(infoAnchorTopPosition)) {
        // console.log(1);
        this.setState({activeLink: 'info'})
      } else if (window.scrollY + headerHeights >= Math.floor(treatmentAnchorTopPosition)) {
        // console.log(2);
        this.setState({activeLink: 'treatments'})
      } else {
        // console.log(3);
        this.setState({activeLink: 'symptoms'})
      }
    })
  }

  render() {
    const {props} = this;

    // if (props.isFetching) {
    //   return (
    //     <Loader />
    //   );
    // } else if (!props.patient) {
    //   return (
    //     <div className='page-content doctor'>
    //       <h2>Patient Not Found</h2>
    //       <Link className='blue btn' to='/doctor/home'>Go Back</Link>
    //     </div>
    //   )
    // }
    return (
      <div className='page-content--pt-summary'>
        <div className='pt-summary__header__wrapper'>
          {props.patient &&
            <div className='pt-summary__header'>
              <div>
                <span className='pt-summary__header__pt-name'>{props.patient.profile.firstName} {props.patient.profile.lastName}</span>
                <span className='pt-summary__header__link'>Symptoms</span>
                <span className='pt-summary__header__link'>Treatments</span>
                <span className='pt-summary__header__link'>Noteable Events</span>
                <span className='pt-summary__header__link'>User Info</span>
              </div>
              <button
                className='btn right red darken-2'
                onClick={() => alert("This feature is not yet implemented. It would allow doctors to send app related notifcations, such as a request to provide more in-app information (e.g. 'please fill out medical information'). This message system will be one-way (doctor to patient) so as not to inundate doctor's accounts with messages from all their patients'. Notifications will be displayed on the 'Notifcation Sidebar' on the Pt Dashboard page as well as the 'Notifcation Dropdown' on the top nav-bar. It will take 2 days tops to complete, let me know if you see the value and want me to procede")}>
                Send Message
              </button>
            </div>
          }
        </div>

        <div className='pt-summary__flex-wrapper'>
          <div className='pt-summary__content'>


            <div className='pt-summary__section'>
              <ScrollableAnchor id={'SxHeading'}>
                <div className='pt-summary__heading pt-summary__heading--symptoms'>Symptoms</div>
              </ScrollableAnchor>
              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>Select 5</div>
                

                {!props.isFetching &&
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
                      checkins={props.patientCheckinHistory.checkins}
                      currentSymptomNames={this.props.currentSymptomNames}
                      // startDate={this.props.startDate}
                      // endDate={this.props.endDate}
                      height={120}
                      padding={{top: 30, right: 30, bottom: 10, left: 0}}
                    />
                  </div>
                }
              </div>

              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>By System</div>
                {!props.isFetching &&
                  props.patientSxSystems.map((system, index) =>
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
                        checkins={props.patientCheckinHistory.checkins}
                        // currentSymptomNames={props.currentSymptomNames}
                        padding={{top: 30, right: 30, bottom: 10, left: 0}}
                      />
                    </div>
                  )
                }
              </div>


            </div>

            <div className='pt-summary__section'>
              <ScrollableAnchor id={'RxHeading'}>
                <div className='pt-summary__heading pt-summary__heading--treatments'>Treatments</div>
              </ScrollableAnchor>
              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>Rx1</div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Current Treatments</span>
                  <ul className='pt-summary__item__list'>
                    <li>Med1</li>
                    <li>Med2</li>
                    <li>Med3</li>
                    <li>Med4</li>
                    <li>Med5</li>
                    <li>Med6</li>
                    <li>Med7</li>
                    <li>Med8</li>
                    <li>Med9</li>
                    <li>Med10</li>
                  </ul>
                </div>
              </div>
            </div>


            <div className='pt-summary__section'>
              <ScrollableAnchor id={'InfoHeading'}>
                <div className='pt-summary__heading pt-summary__heading--info'>Patient Info</div>
              </ScrollableAnchor>
              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>Personal</div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Birthday: </span>
                  <span className='pt-summary__item__response'>September 28th 1983</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Address: </span>
                  <span className='pt-summary__item__response'>123 Fake St. Apt 2F, New York, NY 10018</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Email: </span>
                  <span className='pt-summary__item__response'>dannyash@gmail.com</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Home Phone: </span>
                  <span className='pt-summary__item__response'>Not Listed</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Cell Phone: </span>
                  <span className='pt-summary__item__response'>(555)-123-4567</span>
                </div>
              </div>

              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>Medical</div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Tick-Borne Infections: </span>
                  <span className='pt-summary__item__response'>Lyme, Bartonella, Babesia</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Initial Diagnosis: </span>
                  <span className='pt-summary__item__response'>June 11th 2017</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Height: </span>
                  <span className='pt-summary__item__response'>5'10"</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Weight: </span>
                  <span className='pt-summary__item__response'>185lbs</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Sex: </span>
                  <span className='pt-summary__item__response'>M</span>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Non-Lyme Complications: </span>
                  <ul className='pt-summary__item__list'>
                    <li>Diabetes (Type 1)</li>
                    <li>Hypertension</li>
                  </ul>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Other Physicians: </span>
                  <ul className='pt-summary__item__list'>
                    <li>Oliver Katz (PCP) - phone: (555)-444-3333</li>
                  </ul>
                </div>
              </div>

              <div className='pt-summary__subsection'>
                <div className='pt-summary__subheading'>Appointments</div>
                <div className='pt-summary__item'>
                  {/* <span className='pt-summary__item__label'>Other Physicians: </span> */}
                  <ul className='pt-summary__item__list'>
                    <li>07/09/17</li>
                    <li>
                      09/17/17
                      <span>-Notes: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>

                    </li>
                    <li>12/28/17</li>
                    <li>
                      03/22/18
                      <span>-Notes: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </li>
                  </ul>
                </div>
                <div className='pt-summary__item'>
                  <span className='pt-summary__item__label'>Next Visit: </span>
                  <span className='pt-summary__item__response'>06/13/18</span>
                </div>
              </div>
            </div>

          </div>

          <div className='pt-summary__navbar__wrapper'>
            <PtInfoSideNav activeLink={this.state.activeLink}/>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const patientId = props.computedMatch.params.patientId;
  const currentPatientsHandle = Meteor.subscribe('currentPatients');
  const patientSymptomsHandle = Meteor.subscribe('patientSymptoms', patientId);
  const patientTreatmentsHandle = Meteor.subscribe('patientTreatments', patientId);
  const patientCheckinHistoriesHandle = Meteor.subscribe('patientCheckinHistories', patientId);

  const patientSymptoms = UserSymptoms.find().fetch();
  const patientTreatments = UserTreatments.find().fetch();
  const patientCheckinHistory = CheckinHistories.findOne();

  // REDO: Optimize
  let patientSxSystems = [];
  patientSymptoms.forEach((symptom) => {
    if (!patientSxSystems.includes(symptom.system)) {
      patientSxSystems.push(symptom.system);
    }
  })
  console.log(patientSxSystems);
  return {
    patient: Meteor.users.findOne({_id: patientId}),
    patientSymptoms,
    patientTreatments,
    patientCheckinHistory,
    patientSxSystems,
    isFetching: !currentPatientsHandle.ready() || !patientCheckinHistoriesHandle.ready() || !patientSymptomsHandle.ready() || !patientTreatmentsHandle.ready()
  };
}, PatientSummary);


// {/* <div className='page-content doctor'>
//   <div className='white darken-1 patients-box__wrapper'>
//     <div className='black-text patients-box__title'>{props.patient.profile.firstName} {props.patient.profile.lastName}</div>
//     <Link className='blue btn' to='/doctor/home'>Back</Link>
//     <div>
//       <ol className='collection with-header z-depth-2'>
//         <li className="collection-header"><h5>Symptoms:</h5></li>
//         {props.patientSymptoms.map((symptom) => {
//           return (
//             <li className="collection-item" key={symptom._id} style={{background: symptom.color, color: 'white'}}>
//               <span className="">
//                 {symptom.name}
//               </span>
//             </li>
//           );
//         })}
//       </ol>
//       {props.patientCheckinHistory.checkins.length > 0 &&
//         <div>
//           <SymptomChart
//             symptomNames={props.patientSymptoms.map(symptom => symptom.name)}
//             checkins={props.patientCheckinHistory.checkins}
//             symptomColors={props.patientSymptoms.map(symptom => symptom.color)}
//             height={120}
//             padding={{top: 40, right: 30, bottom: 20, left: 0}}
//           />
//         </div>
//       }
//       <ol className='collection with-header z-depth-2'>
//         <li className="collection-header"><h5>Treatments:</h5></li>
//         {props.patientTreatments.map((treatment) => {
//           return (
//             <li className="collection-item" key={treatment._id}>
//               <span className="">
//                 {treatment.name}
//               </span>
//             </li>
//           );
//         })}
//       </ol>
//       <div className='treatment-chart__wrapper'>
//         {props.patientCheckinHistory.checkins.length > 0 &&
//           <TreatmentChart
//             treatments={props.patientTreatments}
//             checkins={props.patientCheckinHistory.checkins}
//           />
//         }
//       </div>
//     </div>
//   </div>
// </div> */}
