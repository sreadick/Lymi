import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import moment from 'moment';
import { getAppointments } from '/imports/utils/utils';
import { Row, Col, Input, Button, Card } from 'react-materialize';

import Loader from '/imports/ui/components/Loader';

import DoctorSearch from '../DoctorSearch';
import AppointmentScheduler from '../AppointmentScheduler';

// Todo: don't save medical errors state in db, refactor methods

class MedicalInfo extends React.Component {
  constructor(props) {
    super(props);
    const { tickBorneDiseases, initialInfectionDate, appointments, height, weight, sex, otherComplications, otherTreatments, otherDoctors } = props.medicalInfo;

    this.state = {
      tickBorneDiseases,
      appointments,
      initialInfectionDate: {
        month: initialInfectionDate.month || undefined,
        day: initialInfectionDate.day || 0,
        year: initialInfectionDate.year || 0
      },
      height: {
        feet: (height && height.feet) || 0,
        inches: (height && height.inches) || 0
      },
      weight: {
        amount: (weight && weight.amount) || 0,
        measurement: (weight && weight.measurement) || 'pounds'
      },
      sex: sex || '',
      otherComplications: otherComplications || [''],
      otherTreatments: otherTreatments || [{
        name: '',
        dose: ''
      }],
      otherDoctors: otherDoctors || [{
        name: '',
        address: '',
        phone: ''
      }],
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleComplicationChange = this.handleComplicationChange.bind(this);
    this.handleOtherRxChange = this.handleOtherRxChange.bind(this);
    this.handleOtherDoctorChange = this.handleOtherDoctorChange.bind(this);
    this.handleDiagnosisChange = this.handleDiagnosisChange.bind(this);
    this.toggleTickBorneDisease = this.toggleTickBorneDisease.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleHeightChange(newValue, field) {
    if (field === 'feet' && (parseInt(newValue) < 0 || parseInt(newValue) > 9)) {
      return;
    } else if (field === 'inches' && (parseInt(newValue) < 0 || parseInt(newValue) > 12)) {
      return;
    } else {
      const height = Object.assign({}, this.state.height);
      height[field] = newValue;
      this.setState({height});
    }
  }
  handleWeightChange(newValue, field) {
    const weight = Object.assign({}, this.state.weight);
    weight[field] = newValue;
    this.setState({weight});
  }
  handleComplicationChange(newValue, index) {
    const otherComplications = this.state.otherComplications.slice();
    otherComplications[index] = newValue;
    this.setState({otherComplications});
  }
  handleOtherRxChange(newValue, field, index) {
    const otherTreatments = this.state.otherTreatments.slice();
    otherTreatments[index][field] = newValue;
    this.setState({otherTreatments});
  }
  handleOtherDoctorChange(newValue, field, index) {
    const otherDoctors = this.state.otherDoctors.slice();
    otherDoctors[index][field] = newValue;
    this.setState({otherDoctors});
  }
  handleDiagnosisChange(newValue, field) {
    const initialInfectionDate = Object.assign({}, this.state.initialInfectionDate);
    initialInfectionDate[field] = newValue;
    if (field === 'day' && newValue.length > 2) {
      return;
    } else if (field === 'year' && newValue.length > 4) {
      return;
    } else {
      this.setState({initialInfectionDate});
    }
  }
  toggleTickBorneDisease(e) {
    const tickBorneDiseases = this.state.tickBorneDiseases.slice();
    if (tickBorneDiseases.includes(e.target.value)) {
      tickBorneDiseases.splice(tickBorneDiseases.indexOf(e.target.value), 1)
    } else {
      tickBorneDiseases.push(e.target.value)
    }
    this.setState({
      tickBorneDiseases
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    if (this.state.initialInfectionDate.month) {
      if (!this.state.initialInfectionDate.day || this.state.initialInfectionDate.day.length < 2 || this.state.initialInfectionDate.day < 1 || this.state.initialInfectionDate.day > 31) {
        this.setState({errors: {initialInfectionDay: 'Invalid entry'}})
        return;
      } else if (!this.state.initialInfectionDate.year || this.state.initialInfectionDate.year.length < 4 || this.state.initialInfectionDate.year < 1900 || this.state.initialInfectionDate.year > 2018) {
        this.setState({errors: {initialInfectionYear: 'Invalid entry'}})
        return;
      }
    } else if (this.state.initialInfectionDate.day || this.state.initialInfectionDate.year) {
      this.setState({errors: {initialInfectionMonth: 'Please select a month'}})
      return;
    }

    this.setState({errors: {}});

    Object.entries(this.state).forEach(([key, value]) => {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          ['profile.medical.' + key]: value
        }
      });
    });

    this.refs.formSubmitResponse.classList.add('show');
    setTimeout(() => {
      this.refs.formSubmitResponse.classList.remove('show')
    }, 2000);
  }
  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className='account-info'>
        { this.props.showDoctorSearch && <DoctorSearch /> }
        { this.props.showAppointmentScheduler && <AppointmentScheduler currentAppt={this.props.userAppts.next} /> }

        <div className='account-info__heading'>Medical Info</div>
        <div className='account-info__subheading'>Lyme Practitioner</div>
        {!this.props.currentDoctor ?
          <div className='section'>
            <p>Your doctor is not currently linked</p>
            <span className='purple-text text-lighten-1 button--link' onClick={() => Session.set('showDoctorSearch', true)}>Search for your Doctor</span>
          </div>
        :
          <div className='section'>
            <div className='right'>
              <div className='right blue-text text-lighten-1 button--link' onClick={() => Session.set('showDoctorSearch', true)}>Change Doctors</div>
              <div className='red-text text-lighten-1 button--link' onClick={() => Meteor.call('users.updateLymeDoctor', undefined)}>Remove Current Doctor</div>
            </div>
            <p>{this.props.currentDoctorInfo.name}</p>
            <p>Address: {this.props.currentDoctorInfo.address}</p>
            <p>Phone #: {this.props.currentDoctorInfo.phone}</p>
            <p>Email: {this.props.currentDoctorInfo.email}</p>
            {this.props.userAppts.last &&
              <span>Last Appointment: {moment(this.props.userAppts.last).format('MM/DD/YY')}</span>
            }
            <div>
              <span>Next Appointment: </span>
              {this.props.userAppts.next
                ?
                  <span>
                    {moment(this.props.userAppts.next).format('MM/DD/YY (h:mm a)')}
                    <div>
                      <span className='blue-text text-darken-1 button--link' onClick={() => Session.set('showAppointmentScheduler', true)}>Change Date </span>
                      <span className='red-text text-darken-1 button--link' onClick={() => Meteor.call('users.appointments.removeLast')}> Remove</span>
                    </div>
                  </span>
                :
                  <span>
                    N/A
                    <div className='green-text text-darken-1 button--link' onClick={() => Session.set('showAppointmentScheduler', true)}>Set Appointment</div>
                  </span>
              }
            </div>
          </div>
        }
        <form className='' noValidate onSubmit={this.handleSubmit}>
          {/* <div className='account-info__subheading'>Height</div> */}
          <Row>
            <div className='col s4'>
              <Input s={12} type='select' name='sex' label='Sex' value={this.state.sex} onChange={this.handleChange}>
                <option value='' disabled></option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='transgender'>Transgender</option>
                <option value='notSpecified'>Rather Not Say</option>
              </Input>
              {/* {this.state.errors.initialInfectionMonth && <p className='red-text'>{this.state.errors.initialInfectionMonth}</p>} */}
            </div>
          </Row>
          <p>Height:</p>
          <Row>
            <div className='col s2 input-field'>
              <input type='number' id='height--feet' value={this.state.height.feet}  onChange={(e) => this.handleHeightChange(e.target.value, 'feet')}/>
              <label className='active' htmlFor='height--feet'>Feet</label>
              {/* {this.state.errors.initialInfectionDay && <p className='red-text'>{this.state.errors.initialInfectionDay}</p>} */}
            </div>
            <div className='col s2 input-field'>
              <input type='number' id='height--inches' value={this.state.height.inches}  onChange={(e) => this.handleHeightChange(e.target.value, 'inches')}/>
              <label className='active' htmlFor='height--inches'>Inches</label>
              {/* {this.state.errors.initialInfectionDay && <p className='red-text'>{this.state.errors.initialInfectionDay}</p>} */}
            </div>
          </Row>
          <p>Weight:</p>
          <Row>
            <div className='col s2 input-field'>
              <input type='number' id='weight--amount' value={this.state.weight.amount}  onChange={(e) => this.handleWeightChange(e.target.value, 'amount')}/>
              {/* <label className='active' htmlFor='weight--amount'>Inches</label> */}
              {/* {this.state.errors.initialInfectionDay && <p className='red-text'>{this.state.errors.initialInfectionDay}</p>} */}
            </div>
            <div className='col s4'>
              <Input s={12} type='select' value={this.state.weight.measurement} onChange={(e) => this.handleWeightChange(e.target.value, 'measurement')}>
                <option value='pounds'>pounds</option>
                <option value='kilograms'>kilograms</option>
              </Input>
              {/* {this.state.errors.initialInfectionMonth && <p className='red-text'>{this.state.errors.initialInfectionMonth}</p>} */}
            </div>
          </Row>

          <p className=''>Non-Lyme Complications/Symptoms</p>
          {this.state.otherComplications.map((complication, index, array) =>
            <Row key={index}>
              <input className='col s8' value={complication} placeholder='symptom/complication' onChange={(e) => this.handleComplicationChange(e.target.value, index)} />
              {index === array.length - 1 &&
                <i
                  className='right material-icons green-text'
                  onClick={() => {
                    const otherComplications = this.state.otherComplications.slice();
                    otherComplications.push('');
                    this.setState({otherComplications});
                  }}>
                  add
                </i>
              }
              {array.length > 1 &&
                <i
                  className='right material-icons red-text'
                  onClick={() => {
                    const otherComplications = this.state.otherComplications.slice();
                    otherComplications.splice(index, 1);
                    this.setState({otherComplications});
                  }}>
                  remove
                </i>
              }
            </Row>
          )}
          <p className=''>Non-Lyme Treatments</p>
          {this.state.otherTreatments.map((treatment, index, array) =>
            <Row key={index}>
              <input className='col s4' value={treatment.name} placeholder='name' onChange={(e) => this.handleOtherRxChange(e.target.value, 'name', index)} />
              <input className='col s2 offset-s1' value={treatment.dose} placeholder='dose' onChange={(e) => this.handleOtherRxChange(e.target.value, 'dose', index)} />
              {index === array.length - 1 &&
                <i
                  className='right material-icons green-text'
                  onClick={() => {
                    const otherTreatments = this.state.otherTreatments.slice();
                    otherTreatments.push({name: '', dose: ''});
                    this.setState({otherTreatments});
                  }}>
                  add
                </i>
              }
              {array.length > 1 &&
                <i
                  className='right material-icons red-text'
                  onClick={() => {
                    const otherTreatments = this.state.otherTreatments.slice();
                    otherTreatments.splice(index, 1);
                    this.setState({otherTreatments});
                  }}>
                  remove
                </i>
              }
            </Row>
          )}

          <p className=''>Other Physicians</p>
          {this.state.otherDoctors.map((doctor, index, array) =>
            <Row key={index}>
              <input className='col s3' value={doctor.name} placeholder='name' onChange={(e) => this.handleOtherDoctorChange(e.target.value, 'name', index)} />
              <input className='col s3 offset-s1' value={doctor.address} placeholder='address' onChange={(e) => this.handleOtherDoctorChange(e.target.value, 'address', index)} />
              <input className='col s2 offset-s1' value={doctor.phone} placeholder='phone' onChange={(e) => this.handleOtherDoctorChange(e.target.value, 'phone', index)} />
              {index === array.length - 1 &&
                <i
                  className='right material-icons green-text'
                  onClick={() => {
                    const otherDoctors = this.state.otherDoctors.slice();
                    otherDoctors.push({name: '', address: '', phone: ''});
                    this.setState({otherDoctors});
                  }}>
                  add
                </i>
              }
              {array.length > 1 &&
                <i
                  className='right material-icons red-text'
                  onClick={() => {
                    const otherDoctors = this.state.otherDoctors.slice();
                    otherDoctors.splice(index, 1);
                    this.setState({otherDoctors});
                  }}>
                  remove
                </i>
              }
            </Row>
          )}

          <div className='account-info__subheading'>Tick-Borne Diseases</div>
          <Row>
            <div className='section'></div>
            <div className='account-info__form-category left-align'>Diseases:</div>
            {['Lyme Disease', 'Bartonella', 'Babesia'].map(disease =>
              <Input key={disease} name='tickBorneDiseases' type='checkbox' label={disease} value={disease} defaultChecked={this.state.tickBorneDiseases.includes(disease)} onChange={this.toggleTickBorneDisease} />
            )}
          </Row>
          <div className='account-info__subheading'>Date of initial infection</div>
          <Row>
            {/* <Input s={4} name='initialInfectionDate' label='Date of initial infection' defaultValue={this.state.initialInfectionDate} placeholder='MM/YY' labelClassName='active' onChange={this.handleChange} /> */}
            {/* <Input s={2} label='Month' defaultValue={this.state.initialInfectionDate.month} labelClassName='active' onChange={(e) => this.handleDiagnosisChange(e.target.value, 'month')} /> */}
            <div className='col s4'>
              <Input s={12} type='select' label='Month' value={this.state.initialInfectionDate.month} onChange={(e) => this.handleDiagnosisChange(e.target.value, 'month')}>
                <option value=''></option>
                <option value='January'>January</option>
                <option value='February'>February</option>
                <option value='March'>March</option>
                <option value='April'>April</option>
                <option value='May'>May</option>
                <option value='June'>June</option>
                <option value='July'>July</option>
                <option value='August'>August</option>
                <option value='September'>September</option>
                <option value='October'>October</option>
                <option value='November'>November</option>
                <option value='December'>December</option>
              </Input>
              {this.state.errors.initialInfectionMonth && <p className='red-text'>{this.state.errors.initialInfectionMonth}</p>}
            </div>
            <div className='col s2 input-field'>
              <input type='number' id='initialInfectionDay' label='Day' value={this.state.initialInfectionDate.day} placeholder='DD' onChange={(e) => this.handleDiagnosisChange(e.target.value, 'day')} />
              <label className='active' htmlFor='initialInfectionDay'>Day</label>
              {this.state.errors.initialInfectionDay && <p className='red-text'>{this.state.errors.initialInfectionDay}</p>}
            </div>
            <div className='col s2 input-field'>
              <input type='number' id='initialInfectionYear' label='Year' value={this.state.initialInfectionDate.year} placeholder='YYYY' onChange={(e) => this.handleDiagnosisChange(e.target.value, 'year')} />
              <label className='active' htmlFor='initialInfectionYear'>Year</label>
              {this.state.errors.initialInfectionYear && <p className='red-text'>{this.state.errors.initialInfectionYear}</p>}
            </div>
            {/* <Input s={2} type='number' label='Day' value={this.state.initialInfectionDate.day} placeholder='DD' labelClassName='active' onChange={(e) => this.handleDiagnosisChange(e.target.value, 'day')} /> */}
            {/* <Input s={2} type='number' label='Year' value={this.state.initialInfectionDate.year} placeholder='YYYY' labelClassName='active' onChange={(e) => this.handleDiagnosisChange(e.target.value, 'year')} /> */}
          </Row>
          <div className='center-align'>
            <Button className='black' waves='light'>Save</Button>
            <p ref='formSubmitResponse' className='account-info__form-submit-response'>Saved</p>
          </div>
        </form>
      </div>
    );
  }
};

export default createContainer(props => {
  const userInfo = Meteor.user();
  // let nextAppt;
  // let prevAppt;
  // const userAppts = userInfo ? userInfo.profile.medical.appointments : undefined;
  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', userInfo && userInfo.doctorId);
  const currentDoctor = userInfo && Meteor.users.findOne({ 'account.type': 'doctor', _id: userInfo.doctorId });
  const currentDoctorInfo = {};

  if (currentDoctor && currentdDoctorHandle.ready()) {
    currentDoctorInfo.name = `${currentDoctor.profile.firstName} ${currentDoctor.profile.lastName}`;
    currentDoctorInfo.address = `${currentDoctor.profile.officeAddress}, ${currentDoctor.profile.city}, ${currentDoctor.profile.state} ${currentDoctor.profile.zip}`;
    currentDoctorInfo.phone = currentDoctor.profile.phone;
    currentDoctorInfo.email = currentDoctor.emails[0].address;
  }
  // if (userAppts) {
  //   const lastApptInArray = userAppts[userAppts.length - 1];
  //   if (lastApptInArray && moment(lastApptInArray).isAfter(moment())) {
  //     nextAppt = lastApptInArray;
  //     if (userAppts.length > 1) {
  //       prevAppt = userAppts[userAppts.length - 2]
  //     }
  //   } else if (lastApptInArray && moment(lastApptInArray).isBefore(moment())) {
  //     prevAppt = lastApptInArray;
  //   }
  // }
  return {
    currentDoctor,
    showDoctorSearch: Session.get('showDoctorSearch') || false,
    showAppointmentScheduler: Session.get('showAppointmentScheduler') || false,
    currentDoctorInfo,
    // nextAppt,
    // prevAppt,
    userAppts: userInfo ? getAppointments(userInfo.profile.medical.appointments) : {},
    isFetching: !userInfo || !currentdDoctorHandle.ready(),
  }
}, MedicalInfo)








// class MedicalInfo extends React.Component {
//   constructor(props) {
//     super(props);
//     const { tickBorneDiseases, initialInfectionDate } = props.medicalInfo;
//
//     this.state = {
//       tickBorneDiseases, initialInfectionDate,
//       searchDocFirstName: '',
//       searchDocLastName: '',
//       searchDocZip: '',
//       // searchedDocInfo: {}
//     };
//
//     this.handleChange = this.handleChange.bind(this);
//     this.toggleTickBorneDisease = this.toggleTickBorneDisease.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.findDoctor = this.findDoctor.bind(this);
//     this.linkToDcotor = this.linkToDcotor.bind(this);
//   }
//
//   handleChange(e) {
//     this.setState({
//       [e.target.name]: e.target.value
//     });
//   }
//
//   toggleTickBorneDisease(e) {
//     const tickBorneDiseases = this.state.tickBorneDiseases.slice();
//     if (tickBorneDiseases.includes(e.target.value)) {
//       tickBorneDiseases.splice(tickBorneDiseases.indexOf(e.target.value), 1)
//     } else {
//       tickBorneDiseases.push(e.target.value)
//     }
//     this.setState({
//       tickBorneDiseases
//     });
//   }
//
//   handleSubmit(e) {
//     Object.entries(this.state).forEach(([key, value]) => {
//       Meteor.users.update(Meteor.userId(), {
//         $set: {
//           ['profile.medical.' + key]: value
//         }
//       });
//     });
//
//     this.refs.formSubmitResponse.classList.add('show');
//     setTimeout(() => {
//       this.refs.formSubmitResponse.classList.remove('show')
//     }, 2000)
//
//     e.preventDefault();
//
//   }
//
//   findDoctor() {
//     // const sixCharKeyQuery = this.refs.doctorKey.state.value;
//     // Session.set('sixCharKeyQuery', sixCharKeyQuery);
//     const {searchDocFirstName, searchDocLastName, searchDocZip} = this.state;
//     if (searchDocFirstName.trim() && searchDocLastName.trim() && searchDocZip.trim()) {
//       const searchedDocInfo = {
//         firstName: searchDocFirstName,
//         lastName: searchDocLastName,
//         zip: searchDocZip
//       }
//       Session.set('searchedDocInfo', searchedDocInfo);
//     }
//     // const searchedDoctor = Meteor.users.findOne({ 'account.type': 'doctor', 'profile.firstName': this.state.searchDocFirstName, 'profile.lastName': this.state.searchDocLastName, 'profile.zip': this.state.searchDocZip});
//
//     // console.log(searchedDoctor);
//   }
//
//   linkToDcotor(doctorId) {
//     Meteor.call('users.updateLymeDoctor', doctorId, (err, res) => {
//       if (err) {
//         console.log(err);
//       } else {
//         // Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: doctorId});
//         Session.set('searchedDocInfo', undefined);
//       }
//     });
//   }
//
//   render() {
//     if (this.props.isFetching) {
//       return (
//         // <div className="progress">
//         //   <div className="indeterminate"></div>
//         // </div>
//         <Loader />
//       );
//     }
//     return (
//       <div className='account-info'>
//         <div className='account-info__heading'>Medical Info</div>
//         <div className='account-info__subheading'>Lyme Practitioner</div>
//         {!this.props.currentDoctor ?
//           <p>Not Specified</p>
//         :
//           <div>
//             <p>{this.props.currentDoctor.profile.firstName} {this.props.currentDoctor.profile.lastName}</p>
//           </div>
//         }
//         <Row className='section'>
//           <Col s={6} offset='s3'>
//             <Card title='Find You Doctor' className='center-align'>
//               {this.props.searchedDoctor ?
//                 <div>
//                   <Row>
//                     <p>Doctor Found:</p>
//                   </Row>
//                   <Row>
//                     <b>Dr {this.props.searchedDoctor.profile.firstName} {this.props.searchedDoctor.profile.lastName}</b>
//                   </Row>
//                   <Row>
//                     <Button className='green darken-2' onClick={() => this.linkToDcotor(this.props.searchedDoctor._id)}>Confirm</Button>
//                     <Button className='yellow darken-2' onClick={() => Session.set('searchedDocInfo', undefined)}>Search Again</Button>
//                   </Row>
//                 </div>
//               : Session.get('searchedDocInfo') ?
//                 <div>
//                   <div>Sorry, but that doctor is not in our system yet</div>
//                   <Button className='yellow darken-2' onClick={() => Session.set('searchedDocInfo', undefined)}>Search Again</Button>
//                 </div>
//               :
//                 <div>
//                   <Row>
//                     {/* <p>If you know your Lyme practitioner's 6 character id, enter it here</p> */}
//                     <p>To link accounts with your doctor, enter their name and office zip code.</p>
//                   </Row>
//                   <Row>
//                     {/* <Col s={8} offset='s2'> */}
//                     <Col s={10} offset='s1'>
//                       {/* <Input s={12} ref='doctorKey' label='id' /> */}
//                       <Input s={4} name='searchDocFirstName' label='First Name' onChange={this.handleChange} />
//                       <Input s={4} name='searchDocLastName' label='First Name' onChange={this.handleChange} />
//                       <Input s={4} name='searchDocZip' label='Zip' onChange={this.handleChange} />
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Button onClick={this.findDoctor}>Search</Button>
//                   </Row>
//                 </div>
//               }
//             </Card>
//           </Col>
//         </Row>
//         <form className='' noValidate onSubmit={this.handleSubmit}>
//           <div className='account-info__subheading'>Tick-Borne Diseases</div>
//           <Row>
//             <div className='section'></div>
//             <div className='account-info__form-category left-align'>Diseases:</div>
//             {['Lyme Disease', 'Bartonella', 'Babesia'].map(disease =>
//               <Input key={disease} name='tickBorneDiseases' type='checkbox' label={disease} value={disease} defaultChecked={this.state.tickBorneDiseases.includes(disease)} onChange={this.toggleTickBorneDisease} />
//             )}
//           </Row>
//           <Row>
//             <Input s={4} name='initialInfectionDate' label='Date of initial infection' defaultValue={this.state.initialInfectionDate} placeholder='MM/YY' labelClassName='active' onChange={this.handleChange} />
//           </Row>
//           <div className='center-align'>
//             <Button className='black' waves='light'>Save</Button>
//             <p ref='formSubmitResponse' className='account-info__form-submit-response'>Saved</p>
//           </div>
//         </form>
//       </div>
//     );
//   }
// };
//
// export default createContainer(props => {
//   // const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', Session.get('sixCharKeyQuery'));
//   let searchedDocInfo = Session.get('searchedDocInfo');
//   // console.log(searchedDocInfo);
//   const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', {
//     firstName: searchedDocInfo ? searchedDocInfo.firstName : '',
//     lastName: searchedDocInfo ? searchedDocInfo.lastName : '',
//     zip: searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//   const currentdDoctorHandle = Meteor.subscribe('currentDoctor', Meteor.user() && Meteor.user().doctorId);
//
//   const searchedDoctor = Meteor.users.findOne({
//     'account.type': 'doctor',
//     'profile.firstName': searchedDocInfo ? searchedDocInfo.firstName : '',
//     'profile.lastName': searchedDocInfo ? searchedDocInfo.lastName : '',
//     'profile.zip': searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//   const currentDoctor = Meteor.user() && Meteor.users.findOne({ 'account.type': 'doctor', _id: Meteor.user().doctorId });
//   // console.log('searchedDoctor:' , searchedDoctor);
//   // console.log('currentDoctor:' , currentDoctor);
//   return {
//     searchedDoctor,
//     currentDoctor,
//     isFetching: !Meteor.user() || !searchedDoctorHandle.ready() || !currentdDoctorHandle.ready(),
//   }
// }, MedicalInfo)
