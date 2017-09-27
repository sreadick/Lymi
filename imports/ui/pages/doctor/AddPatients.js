import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Row, Col } from 'react-materialize';

import { Requests } from '../../../api/requests';

class AddPatients extends React.Component {
  sendRequestToPatient(patient) {
    Meteor.call('requests.insert', patient._id);
  }
  cancelRequest(patient) {
    Meteor.call('requests.remove', {patientId: patient._id, doctorId: Meteor.userId()});
  }

  render() {
    if (this.props.isFetching) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    }
    return (
      <div className='page-content doctor'>
        <div className='blue darken-1 patients-box__wrapper'>
          <div className='patients-box__title'>Add Patients</div>
          <div className='patients-box'>
            {this.props.allPatients.map((patient, index) =>
              <Row key={patient._id} style={{height: '50px'}}>
                {index !== 0 && <div className="divider"></div>}
                <div className="valign-wrapper section">
                  <Col s={1}>
                    {patient.profile.userPhoto && <img style={{height: '40px'}} src={patient.profile.userPhoto} />}
                  </Col>
                  <Col s={3}>
                    <div>{patient.profile.firstName} {patient.profile.lastName}</div>
                  </Col>
                  <Col s={3}>
                    <div>{patient.emails[0].address}</div>
                  </Col>
                  <Col offset='s1' s={3}>
                    {patient.doctorId === Meteor.userId() ?
                      <div className='green-text'>Current Patient</div>
                    :
                    this.props.requests.find(request => request.userId === patient._id) ?
                      <Button className='grey' waves='light' onClick={() => this.cancelRequest(patient)}>Cencel Request</Button>
                    :
                      <Button className='amber darken-2' waves='light' onClick={() => this.sendRequestToPatient(patient)}>Send Request</Button>
                    }
                  </Col>
                </div>
              </Row>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const allPatientsHandle = Meteor.subscribe('allPatients');
  const allPatients = Meteor.users.find({accountType: 'patient'}).fetch();
  const requestsHandle = Meteor.subscribe('requestsFromDoctor');
  const requests = Requests.find().fetch();
  return {
    allPatients,
    requests,
    isFetching: !allPatientsHandle.ready() && !requestsHandle.ready(),
  };
}, AddPatients);
