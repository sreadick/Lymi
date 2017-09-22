import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';

export default class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    const { firstName, middleInitial, lastName, birthMonth, birthDay, birthYear, street, apartment, city, state, zip, homePhone, cellPhone } = props.userInfo.profile;

    this.state = {
      firstName, middleInitial, lastName, birthMonth, birthDay, birthYear, street, apartment, city, state, zip, homePhone, cellPhone
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    Object.entries(this.state).forEach(([key, value]) => {
      Meteor.users.update(this.props.userInfo._id, {
        $set: {
          ['profile.' + key]: value
        }
      });
    });

    this.refs.formSubmitResponse.classList.add('show');
    setTimeout(() => {
      this.refs.formSubmitResponse.classList.remove('show')
    }, 2000)

    e.preventDefault();
  }

  render() {
    return (
      <div className='account-info'>
        <div className='account-info__heading'>Personal Info</div>
        <form className='center-align section' noValidate onSubmit={this.handleSubmit}>
          <Row>
            <div className='account-info__form-category left-align'>Name:</div>
            <Input s={5} name='firstName' label='First' defaultValue={this.state.firstName} onChange={this.handleChange}/>
            <Input s={2} name='middleInitial' label='MI' defaultValue={this.state.middleInitial} onChange={this.handleChange} />
            <Input s={5} name='lastName' label='Last' defaultValue={this.state.lastName} onChange={this.handleChange} />
          </Row>
          <Row>
            <div className='account-info__form-category left-align'>Date of Birth:</div>
            <Input s={4} type='select' name='birthMonth' label='Month' value={this.state.birthMonth} onChange={this.handleChange}>
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
            <Input s={4} type='select' name='birthDay' label='Day' value={this.state.birthDay} onChange={this.handleChange}>
              <option value=''></option>
              {Array.from(Array(this.state.birthMonth ? moment('2017-'+ moment().month(this.state.birthMonth).format('M'), 'YYYY-M').daysInMonth() : 31).keys()).map((dayOfMonthIndex) => {
                const dayOfMonth = dayOfMonthIndex + 1;
                return <option key={dayOfMonth} value={dayOfMonth}>{dayOfMonth}</option>
              })}
            </Input>
            <Input s={4} type='select' name='birthYear' label='Year' value={this.state.birthYear} onChange={this.handleChange}>
              <option value=''></option>
              {Array.from(Array(moment().diff(moment([1900, 0, 20]), 'years') + 1).keys()).map((yearOffset) => {
                const year = moment().year() - yearOffset;
                return <option key={year} value={year}>{year}</option>
              })}
            </Input>
          </Row>
          <Row>
            <div className='account-info__form-category left-align'>Address:</div>
            <Input s={9} name='street' label='Street' defaultValue={this.state.street} onChange={this.handleChange} />
            <Input s={3} name='apartment' label='Apt #' defaultValue={this.state.apartment} onChange={this.handleChange} />
            <Input s={4} name='city' label='City' defaultValue={this.state.city} onChange={this.handleChange} />
            <Input s={4} type='select' name='state' label='State' defaultValue={this.state.state} onChange={this.handleChange}>
              <option value=""></option>
              <option value="AL">Alabama</option>
            	<option value="AK">Alaska</option>
            	<option value="AZ">Arizona</option>
            	<option value="AR">Arkansas</option>
            	<option value="CA">California</option>
            	<option value="CO">Colorado</option>
            	<option value="CT">Connecticut</option>
            	<option value="DE">Delaware</option>
            	<option value="DC">District Of Columbia</option>
            	<option value="FL">Florida</option>
            	<option value="GA">Georgia</option>
            	<option value="HI">Hawaii</option>
            	<option value="ID">Idaho</option>
            	<option value="IL">Illinois</option>
            	<option value="IN">Indiana</option>
            	<option value="IA">Iowa</option>
            	<option value="KS">Kansas</option>
            	<option value="KY">Kentucky</option>
            	<option value="LA">Louisiana</option>
            	<option value="ME">Maine</option>
            	<option value="MD">Maryland</option>
            	<option value="MA">Massachusetts</option>
            	<option value="MI">Michigan</option>
            	<option value="MN">Minnesota</option>
            	<option value="MS">Mississippi</option>
            	<option value="MO">Missouri</option>
            	<option value="MT">Montana</option>
            	<option value="NE">Nebraska</option>
            	<option value="NV">Nevada</option>
            	<option value="NH">New Hampshire</option>
            	<option value="NJ">New Jersey</option>
            	<option value="NM">New Mexico</option>
            	<option value="NY">New York</option>
            	<option value="NC">North Carolina</option>
            	<option value="ND">North Dakota</option>
            	<option value="OH">Ohio</option>
            	<option value="OK">Oklahoma</option>
            	<option value="OR">Oregon</option>
            	<option value="PA">Pennsylvania</option>
            	<option value="RI">Rhode Island</option>
            	<option value="SC">South Carolina</option>
            	<option value="SD">South Dakota</option>
            	<option value="TN">Tennessee</option>
            	<option value="TX">Texas</option>
            	<option value="UT">Utah</option>
            	<option value="VT">Vermont</option>
            	<option value="VA">Virginia</option>
            	<option value="WA">Washington</option>
            	<option value="WV">West Virginia</option>
            	<option value="WI">Wisconsin</option>
            	<option value="WY">Wyoming</option>
            </Input>
            <Input s={4} name='zip' label='Zip' defaultValue={this.state.zip} onChange={this.handleChange} />
          </Row>
          <Row>
            <div className='account-info__form-category left-align'>Contact:</div>
            <Input s={4} name='homePhone' label='Phone (home)' defaultValue={this.state.homePhone} onChange={this.handleChange}/>
            <Input s={4} name='cellPhone' label='Phone (cell)' defaultValue={this.state.cellPhone} onChange={this.handleChange}/>
            <Input s={4} label='Email' disabled defaultValue={this.props.userInfo.emails[0].address} onChange={this.handleChange}/>
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
