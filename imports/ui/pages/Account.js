import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Tabs, Tab, Row, Input } from 'react-materialize';


class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      birthMonth: ''
    };

    this.handleBirthMonthChange = this.handleBirthMonthChange.bind(this)
  }

  handleBirthMonthChange(e) {
    console.log(this);
    this.setState({ birthMonth: e.target.value })
  }

  render() {
    if (!Meteor.user()) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    }
    return (
      <div className="page-content">
        <div className="page-content__main-heading">Account</div>
        <Tabs className='z-depth-1'>
      		<Tab className='col s3' title="User Info" active>
            <form className='section' noValidate>
              <Row>
                <Input s={6} ref='firstName' label='First Name' defaultValue={Meteor.user().profile.firstName} />
                <Input s={6} ref='lastName' label='Last Name' defaultValue={Meteor.user().profile.lastName} />

                <Input s={2} type='select' ref='birthMonth' label='Date of birth' value={this.state.birthMonth} onChange={this.handleBirthMonthChange}>
                  <option value='' disabled>Month</option>
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
                <Input s={2} type='select' ref='birthDay' disabled={!this.state.birthMonth}>
                  <option value='' disabled>Day</option>
                  {this.state.birthMonth ?
                    Array.from(Array(moment('2017-'+ moment().month(this.state.birthMonth).format('M'), 'YYYY-M').daysInMonth()).keys()).map((dayOfMonthIndex) => {
                      const dayOfMonth = dayOfMonthIndex + 1;
                      return <option key={dayOfMonth} value={dayOfMonth}>{dayOfMonth}</option>
                    })
                    :
                    <option></option>
                  }
                </Input>
                <Input s={2} type='select' ref='birthYear' disabled={!this.state.birthMonth}>
                  <option value='' disabled>Year</option>
                  {this.state.birthMonth ?
                    Array.from(Array(moment().diff(moment([1900, 0, 20]), 'years') + 1).keys()).map((yearOffset) => {
                      const year = moment().year() - yearOffset;
                      return <option key={year} value={year}>{year}</option>
                    })
                    :
                    <option></option>
                  }
                </Input>
              </Row>

            </form>
          </Tab>
      		<Tab className='col s3' title="Test 2">2</Tab>
      		<Tab className='col s3' title="Test 3">Test 3</Tab>
      		<Tab className='col s3' title="Test 4">Test 4</Tab>
        </Tabs>
      </div>
    );
  }
}

export default createContainer(props => {
  return {
    isFetching: !Meteor.user()
  }
}, Account)
