import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button, Card } from 'react-materialize';

class MedicalInfo extends React.Component {
  constructor(props) {
    super(props);
    const { tickBorneDiseases, initialInfectionDate } = props.medicalInfo;

    this.state = {
      tickBorneDiseases, initialInfectionDate
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleTickBorneDisease = this.toggleTickBorneDisease.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findDoctor = this.findDoctor.bind(this);
    this.linkToDcotor = this.linkToDcotor.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
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
    }, 2000)

    e.preventDefault();

  }

  findDoctor() {
    const sixCharKeyQuery = this.refs.doctorKey.state.value;
    Session.set('sixCharKeyQuery', sixCharKeyQuery);
  }

  linkToDcotor(doctorId) {
    Meteor.call('users.updateLymeDoctor', doctorId, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: doctorId});
        Session.set('sixCharKeyQuery', '');
      }
    });
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
      <div className='account-info'>
        <div className='account-info__heading'>Medical Info</div>
        <div className='account-info__subheading'>Lyme Practitioner</div>
        {!this.props.currentDoctor ?
          <p>Not Specified</p>
        :
          <div>
            <h3>{this.props.currentDoctor.profile.firstName} {this.props.currentDoctor.profile.lastName}</h3>
          </div>
        }
        <Row className='section'>
          <Col s={6} offset='s3'>
            <Card title='Find You Doctor' className='center-align'>
              {this.props.searchedDoctor ?
                <div>
                  <Row>
                    <p>Doctor Found:</p>
                  </Row>
                  <Row>
                    <b>Dr {this.props.searchedDoctor.profile.firstName} {this.props.searchedDoctor.profile.lastName}</b>
                  </Row>
                  <Row>
                    <Button className='green darken-2' onClick={() => this.linkToDcotor(this.props.searchedDoctor._id)}>Confirm</Button>
                    <Button className='yellow darken-2' onClick={() => Session.set('sixCharKeyQuery', '')}>Search Again</Button>
                  </Row>
                </div>
              :
                <div>
                  <Row>
                    <p>If you know your Lyme practitioner's 6 character id, enter it here</p>
                  </Row>
                  <Row>
                    <Col s={8} offset='s2'>
                      <Input s={12} ref='doctorKey' label='id' />
                    </Col>
                  </Row>
                  <Row>
                    <Button onClick={this.findDoctor}>Search</Button>
                  </Row>
                </div>
              }
            </Card>
          </Col>
        </Row>
        <form className='' noValidate onSubmit={this.handleSubmit}>
          <div className='account-info__subheading'>Tick-Borne Diseases</div>
          <Row>
            <div className='section'></div>
            <div className='account-info__form-category left-align'>Diseases:</div>
            {['Lyme Disease', 'Bartonella', 'Babesia'].map(disease =>
              <Input key={disease} name='tickBorneDiseases' type='checkbox' label={disease} value={disease} defaultChecked={this.state.tickBorneDiseases.includes(disease)} onChange={this.toggleTickBorneDisease} />
            )}
          </Row>
          <Row>
            <Input s={4} name='initialInfectionDate' label='Date of initial infection' defaultValue={this.state.initialInfectionDate} placeholder='MM/YY' labelClassName='active' onChange={this.handleChange} />
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
  const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', Session.get('sixCharKeyQuery'));
  const currentdDoctorHandle = Meteor.subscribe('currentDoctor', Meteor.user() && Meteor.user().doctorId);

  const searchedDoctor = Meteor.users.findOne({ 'account.type': 'doctor', sixCharKey: Session.get('sixCharKeyQuery')});
  const currentDoctor = Meteor.user() && Meteor.users.findOne({ 'account.type': 'doctor', _id: Meteor.user().doctorId });
  // console.log('searchedDoctor:' , searchedDoctor);
  // console.log('currentDoctor:' , currentDoctor);
  return {
    searchedDoctor,
    currentDoctor,
    isFetching: !Meteor.user() || !searchedDoctorHandle.ready() || !currentdDoctorHandle.ready(),
  }
}, MedicalInfo)
