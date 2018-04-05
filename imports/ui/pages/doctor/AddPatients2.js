import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Row, Col, Input, Icon } from 'react-materialize';
import { capitalize } from '../../../utils/utils';

import Loader from '/imports/ui/components/Loader';

import { Requests } from '../../../api/requests';

class AddPatients2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      ptSearchName: '',
      hasSearched: false
    };

    // this.handlePatientNameChange = this.handlePatientNameChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.searchPatients = this.searchPatients.bind(this);
  }

  handleNameChange(e) {
    this.setState({ptSearchName: e.target.value})
  }
  searchPatients(e) {
    e.preventDefault();
    const patientName = this.state.ptSearchName.trim();
    if (patientName) {
      const patientNameSplit = patientName.toLowerCase().split(' ').map(name => capitalize(name));
       if (patientNameSplit.length === 1) {
         const firstNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.firstName']: patientNameSplit[0]}).fetch();
         const lastNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.lastName']: patientNameSplit[0]}).fetch();
         const emailQueryResults = Meteor.users.find({'account.type': 'patient', ['emails.0.address']: patientNameSplit[0].toLowerCase()}).fetch();
         this.setState({
           patients: firstNameQueryResults.concat(lastNameQueryResults, emailQueryResults),
           hasSearched: true
         })
       } else if (patientNameSplit.length === 2) {
         const fullNameResults = Meteor.users.find({
           'account.type': 'patient',
           ['profile.firstName']: patientNameSplit[0],
           ['profile.lastName']: patientNameSplit[1]
         }).fetch();
         this.setState({
           patients: fullNameResults,
           hasSearched: true
         })
       }
     }
  }
  // handlePatientNameChange(e) {
  //   const patientNameSplit = e.target.value.trim().toLowerCase().split(' ').map(name => capitalize(name));
  //   if (patientNameSplit.length === 1) {
  //     const firstNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.firstName']: patientNameSplit[0]}).fetch();
  //     const lastNameQueryResults = Meteor.users.find({'account.type': 'patient', ['profile.lastName']: patientNameSplit[0]}).fetch();
  //     this.setState({
  //       patients: firstNameQueryResults.concat(lastNameQueryResults)
  //     })
  //   } else if (patientNameSplit.length === 2) {
  //     const fullNameResults = Meteor.users.find({
  //       'account.type': 'patient',
  //       ['profile.firstName']: patientNameSplit[0],
  //       ['profile.lastName']: patientNameSplit[1]
  //     }).fetch();
  //     this.setState({
  //       patients: fullNameResults
  //     })
  //   }
  // }
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
      <div className='page-content--pt-search'>
        <div className='pt-search__header'>
          <div className='pt-search__header--left'>
            <Link className='blue lighten-1 white-text btn btn-flat' to='/doctor/home'>Back</Link>
          </div>
          <h2>Find Your Patients</h2>
          <div className='pt-search__search-box'>
            <div className="input-field inline">
              <input type="text" placeholder='Name/Email' onChange={this.handleNameChange} />
            </div>
            <Link to='' onClick={this.searchPatients}>Search</Link>
          </div>
        </div>

        <div className='pt-search__results z-depth-2'>
          { !this.state.hasSearched ?
              <p className='pt-search__results__message'>After sending a request to link accounts, the patient will be notified and can accept the invitation at their discretion. You can search using first and/or last names as well as email address.</p>
            :
            this.state.patients.length === 0 ?
              <p className='pt-search__results__message'>Sorry, no users were found. Check for correct spelling or contact your patient to confirm they're registered.</p>
            :
            <div>
              <p className='pt-search__results__message--found'>{`${this.state.patients.length} ${this.state.patients.length === 1 ? 'user' : 'users'} found:`}</p>
              {this.state.patients.map((patient, index) =>
                  <div className='pt-search__item' key={patient._id}>
                    <div>
                      <div className='pt-search__item__avatar__wrapper'>
                        {patient.profile.userPhoto ?
                          <img
                            className='pt-search__item__avatar'
                            src={patient.profile.userPhoto}/>
                          :
                          <span
                            className='profile__avatar--inital pt-search__item__avatar--initial'>
                            {patient.profile.firstName.charAt(0)}
                          </span>
                        }
                      </div>
                      <div className='pt-search__item__info'>
                        <h5>{patient.profile.firstName} {patient.profile.lastName}</h5>
                        <h6>{patient.emails[0].address}</h6>
                        {patient.account.createdAt &&
                          <p>Joined {moment(patient.account.createdAt).format('MMMM DD, YYYY')}</p>
                        }
                      </div>
                    </div>
                    <div className='pt-search__item__action'>
                      {patient.doctorId === Meteor.userId() ?
                        <div className='pt-search__item__action--current-pt'>Current Patient</div>
                      :
                      this.props.requests.find(request => request.userId === patient._id) ?
                        <div>
                          <div>Pending Approval...</div>
                          <Button className='amber darken-2 white-text' flat waves='light' onClick={() => this.cancelRequest(patient)}>Cancel</Button>
                        </div>
                      :
                        <Button className='grey lighten-1 white-text' flat waves='light' onClick={() => this.sendRequestToPatient(patient)}>Send Request</Button>
                      }
                    </div>
                  </div>
                // <Row key={patient._id} style={{height: '50px'}}>
                //   {index !== 0 && <div className="divider"></div>}
                //   <div className="valign-wrapper section">
                //     <Col s={1}>
                //       {patient.profile.userPhoto && <img style={{height: '40px'}} src={patient.profile.userPhoto} />}
                //     </Col>
                //     <Col s={3}>
                //       <div>{patient.profile.lastName}, {patient.profile.firstName}</div>
                //     </Col>
                //     <Col s={3}>
                //       <div>{patient.emails[0].address}</div>
                //     </Col>
                //     <Col offset='s1' s={3}>
                //       {patient.doctorId === Meteor.userId() ?
                //         <div className='green-text'>Current Patient</div>
                //       :
                //       this.props.requests.find(request => request.userId === patient._id) ?
                //         <Button className='grey' waves='light' onClick={() => this.cancelRequest(patient)}>Cencel Request</Button>
                //       :
                //         <Button className='amber darken-2' waves='light' onClick={() => this.sendRequestToPatient(patient)}>Send Request</Button>
                //       }
                //     </Col>
                //   </div>
                // </Row>
              )}
            </div>
          }
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
}, AddPatients2);
