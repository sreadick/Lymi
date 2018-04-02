import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Button } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';

import Loader from '/imports/ui/components/Loader';

const Home = (props) => {
  if (props.isFetching) {
    return (
      <Loader />
    );
  }
  return (
    <div className='page-content doctor'>
      <div className='black patients-box__wrapper z-depth-2'>
        <div className='patients-box__title'>
          My Patients
          {/* <Link className='btn-floating waves-effect waves-light green' to='/doctor/addpatients'> */}
          {/* <Link to='/doctor/addpatients'>
            <i className="material-icons button--icon green-text">add</i>
          </Link> */}
        </div>
        <div className='patients-box'>
          { props.currentPatients.length > 0
            ?
              <table className="patients-box__table highlight centered responsive-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Account Created</th>
                  </tr>
                </thead>
                <tbody>
                  {props.currentPatients.map(patient =>
                    <tr
                      key={patient._id}
                      onClick={() => {
                        props.history.push(`/doctor/patientsummary/${patient._id}`);
                      }}>
                      <td>
                        {patient.profile.firstName} {patient.profile.lastName}
                      </td>
                      <td>
                        {patient.emails[0].address}
                      </td>
                      <td>
                        {moment(patient.createdAt).fromNow()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            :
              <div className='center-align'>
                <div>You have no Lymi patients</div>
                <Link className='btn waves-effect waves-light' to='/doctor/addpatients'>Add Patients</Link>
              </div>
          }
        </div>
        {/* <div className='right grey-text'>My Key: {props.sixCharKey}</div> */}
      </div>

      <Link to='/doctor/addpatients'>
        {/* <i className="material-icons button--icon green-text">add</i> */}
        <Button floating fab='vertical' icon='add' className='green' large style={{bottom: '45px', right: '24px'}} />
      </Link>

    </div>
  );
};

export default createContainer((props) => {
  const currentPatientsHandle = Meteor.subscribe('currentPatients');
  // const currentPatients = Meteor.users.find({'account.type': 'patient'}, {sort: {createdAt: -1}}).fetch();
  const currentPatients = Meteor.users.find({'account.type': 'patient'}, {sort: {'profile.lastName': 1}}).fetch();
  console.log(props);
  return {
    currentPatients,
    sixCharKey: Meteor.user() ? Meteor.user().sixCharKey : '',
    isFetching: !currentPatientsHandle.ready()
  };
}, Home);
