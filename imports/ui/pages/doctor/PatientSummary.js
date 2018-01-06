import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col } from 'react-materialize';

import { CheckinHistories } from '../../../api/checkin-histories';
import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';

import Loader from '/imports/ui/components/Loader';
import SymptomChart from '../../components/patient/SymptomChart';
import TreatmentChart from '../../components/patient/TreatmentChart';

const PatientSummary = (props) => {
  if (props.isFetching) {
    return (
      <Loader />
    );
  } else if (!props.patient) {
    return (
      <div className='page-content doctor'>
        <h2>Patient Not Found</h2>
        <Link className='blue btn' to='/doctor/home'>Go Back</Link>
      </div>
    )
  }
  return (
    <div className='page-content doctor'>
      <div className='white darken-1 patients-box__wrapper'>
        <div className='black-text patients-box__title'>{props.patient.profile.firstName} {props.patient.profile.lastName}</div>
        <Link className='blue btn' to='/doctor/home'>Back</Link>
        <div>
          <ol className='collection with-header z-depth-2'>
            <li className="collection-header"><h5>Symptoms:</h5></li>
            {props.patientSymptoms.map((symptom) => {
              return (
                <li className="collection-item" key={symptom._id} style={{background: symptom.color, color: 'white'}}>
                  <span className="">
                    {symptom.name}
                  </span>
                </li>
              );
            })}
          </ol>
          {props.patientCheckinHistory.checkins.length > 0 &&
            <div>
              <SymptomChart
                symptomNames={props.patientSymptoms.map(symptom => symptom.name)}
                checkins={props.patientCheckinHistory.checkins}
                symptomColors={props.patientSymptoms.map(symptom => symptom.color)}
                height={120}
                padding={{top: 40, right: 30, bottom: 20, left: 0}}
              />
            </div>
          }
          <ol className='collection with-header z-depth-2'>
            <li className="collection-header"><h5>Treatments:</h5></li>
            {props.patientTreatments.map((treatment) => {
              return (
                <li className="collection-item" key={treatment._id}>
                  <span className="">
                    {treatment.name}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className='treatment-chart__wrapper'>
            {props.patientCheckinHistory.checkins.length > 0 &&
              <TreatmentChart
                treatments={props.patientTreatments}
                checkins={props.patientCheckinHistory.checkins}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
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

  return {
    patient: Meteor.users.findOne({_id: patientId}),
    patientSymptoms,
    patientTreatments,
    patientCheckinHistory,
    isFetching: !currentPatientsHandle.ready() || !patientCheckinHistoriesHandle.ready() || !patientSymptomsHandle.ready() || !patientTreatmentsHandle.ready()
  };
}, PatientSummary);
