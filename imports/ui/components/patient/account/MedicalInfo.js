import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button } from 'react-materialize';

export default class MedicalInfo extends React.Component {
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

  }

  linkToDcotor() {

  }

  render() {
    return (
      <div className='account-info'>
        <div className='account-info__heading'>Medical Info</div>
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
        <div className='account-info__subheading'>Lyme Practitioner</div>
        <div className='section'>
          <Row>
            <Col s={4} offset='s4' className='s4'>
              <p>If you know your lyme practitioner's 6 digit id, enter it here to link accounts</p>
              <Row>
                <Col s={8} className='s4'>
                  <Input label='id' />
                </Col>
                <Col s={4} className='s4'>
                  <Button onClick={this.findDoctor}>Enter</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
};
