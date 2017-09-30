import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
// import { Button } from 'react-materialize';

const Home = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div className='page-content doctor'>
      <div className='black patients-box__wrapper'>
        <div className='right grey-text'>My Key: {props.sixCharKey}</div>
        <div className='patients-box__title'>
          My Patients
          {/* <Link className='btn-floating waves-effect waves-light green' to='/doctor/addpatients'> */}
          <Link to='/doctor/addpatients'>
            <i className="material-icons button--icon green-text">add</i>
          </Link>
        </div>
        <div className='patients-box'>
          { props.currentPatients.length > 0
            ?
              props.currentPatients.map(patient =>
                <div key={patient._id}>
                  <Link to={`/doctor/patientsummary/${patient._id}`}>
                    {patient.profile.firstName} {patient.profile.lastName}
                  </Link>
                  {patient.emails[0].address}
                </div>
              )
            :
              <div className='center-align'>
                <div>You have no Lymi patients</div>
                <Link className='btn waves-effect waves-light' to='/doctor/addpatients'>Add Patients</Link>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default createContainer(() => {
  const currentPatientsHandle = Meteor.subscribe('currentPatients');
  const currentPatients = Meteor.users.find({accountType: 'patient'}).fetch();
  return {
    currentPatients,
    sixCharKey: Meteor.user() ? Meteor.user().sixCharKey : '',
    isFetching: !currentPatientsHandle.ready()
  };
}, Home);
