import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Row, Col, Input, Icon } from 'react-materialize';
import { capitalize } from '../../../utils/utils';

import Loader from '/imports/ui/components/Loader';

import { Requests } from '../../../api/requests';

class AddPatients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: []
    };

    this.handlePatientNameChange = this.handlePatientNameChange.bind(this);
  }
  handlePatientNameChange(e) {
    const patientNameSplit = e.target.value.trim().toLowerCase().split(' ').map(name => capitalize(name));
    if (patientNameSplit.length === 1) {
      const firstNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.firstName']: patientNameSplit[0]}).fetch();
      const lastNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.lastName']: patientNameSplit[0]}).fetch();
      this.setState({
        patients: firstNameQueryResults.concat(lastNameQueryResults)
      })
    } else if (patientNameSplit.length === 2) {
      const fullNameResults = Meteor.users.find({
        'account.type': 'patient',
        ['profile.firstName']: patientNameSplit[0],
        ['profile.lastName']: patientNameSplit[1]
      }).fetch();
      this.setState({
        patients: fullNameResults
      })
    }
  }
  sendRequestToPatient(patient) {
    Meteor.call('requests.insert', patient._id);
  }
  cancelRequest(patient) {
    Meteor.call('requests.remove', {patientId: patient._id, doctorId: Meteor.userId()});
  }

  render() {
    if (this.props.isFetching) {
      return (
        <Loader />
      );
    }
    return (
      <div className='page-content doctor'>
        <div className='grey darken-2 patients-box__wrapper z-depth-2'>
          <div className='patients-box__title'>
            <Link className='left' to='/doctor/home'><Icon small>keyboard_arrow_left</Icon></Link>
            Add Patients
          </div>
          <Row>
            <Col s={4} offset='s4'>
              <Input className='white-text' s={12} placeholder='Patient Name' onChange={this.handlePatientNameChange}/>
            </Col>
          </Row>
          <div className='patients-box'>
            {this.state.patients.map((patient, index) =>
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
  const allPatients = Meteor.users.find({'account.type': 'patient'}).fetch();
  const requestsHandle = Meteor.subscribe('requestsFromDoctor');
  const requests = Requests.find().fetch();
  return {
    allPatients,
    requests,
    isFetching: !allPatientsHandle.ready() && !requestsHandle.ready(),
  };
}, AddPatients);
