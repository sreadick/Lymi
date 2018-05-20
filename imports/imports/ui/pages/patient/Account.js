import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { Tabs, Tab } from 'react-materialize';

import Loader from '/imports/ui/components/Loader';

import Settings from '../../components/patient/account/Settings';
// import Preferences from '../../components/patient/account/Preferences';
import Practitioner from '../../components/patient/account/Practitioner';
import PersonalInfo from '../../components/patient/account/PersonalInfo';
import MedicalInfo from '../../components/patient/account/MedicalInfo';


class Account extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.userInfo && !Object.is(this.props.userInfo, nextProps.userInfo)) {
      return false;
    }
    return true;
  }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="page-content">
        <div className="page-content__main-heading">Account</div>
        <Tabs className='z-depth-1'>
          <Tab className='col s3' title="Settings" active={!this.props.location.state || !this.props.location.state.activeTab}>
            <Settings settingsInfo={this.props.userInfo.profile.settings}/>
          </Tab>
          <Tab className='col s3' title="Lyme Practitioner" active={this.props.location.state && this.props.location.state.activeTab === 'practitioner'}>
            <Practitioner userInfo={this.props.userInfo}/>
          </Tab>
          {/* <Tab className='col s3' title="Preferences" active={this.props.location.state && this.props.location.state.activeTab === 'preferences'}>
            <Preferences userInfo={this.props.userInfo}/>
          </Tab> */}
      		<Tab className='col s3' title="Personal Info" active={this.props.location.state && this.props.location.state.activeTab === 'personalInfo'}>
            <PersonalInfo userInfo={this.props.userInfo}/>
          </Tab>
      		<Tab className='col s3' title="Medical Info" active={this.props.location.state && this.props.location.state.activeTab === 'medicalInfo'}>
            <MedicalInfo medicalInfo={this.props.userInfo.profile.medical} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default createContainer(props => {
  return {
    userInfo: Meteor.user(),
    isFetching: !Meteor.user(),
  }
}, Account)
