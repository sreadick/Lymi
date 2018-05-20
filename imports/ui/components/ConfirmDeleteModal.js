import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import { Session } from 'meteor/session';

export default class ConfirmDeleteModal extends React.Component {
  removeItem() {
    if (this.props.itemType === 'symptom') {
      Meteor.call('userSymptoms.remove', this.props.itemName, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.hideModal();
        }
      });
    } else {
      Meteor.call('userTreatments.remove', this.props.itemId, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.hideModal();
        }
      });
    }
  }
  hideModal() {
    Session.set({
      showConfirmDeleteModal: false,
      itemName: "",
      itemId: ''
    });
  }
  render() {
    return (
      <div className='boxed-view__modal-overlay'>
        <div className='boxed-view__modal--confirm-delete'>
          <h5>Are you sure you want to delete "{this.props.itemName}" from your {this.props.itemType} list</h5>
          <div>
            <Button
              className='blue white-text'
              onClick={() => this.removeItem()}>
              Confirm
            </Button>
            <Button
              className='grey white-text'
              onClick={() => this.hideModal()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

// export default createContainer(props => {
//   let searchedDocInfo = Session.get('searchedDocInfo');
//   // console.log(searchedDocInfo);
//   const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', {
//     firstName: searchedDocInfo ? searchedDocInfo.firstName : '',
//     lastName: searchedDocInfo ? searchedDocInfo.lastName : '',
//     zip: searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//
//   const searchedDoctor = Meteor.users.findOne({
//     'account.type': 'doctor',
//     'profile.firstName': searchedDocInfo ? searchedDocInfo.firstName : '',
//     'profile.lastName': searchedDocInfo ? searchedDocInfo.lastName : '',
//     'profile.zip': searchedDocInfo ? searchedDocInfo.zip : ''
//   });
//   // console.log('searchedDoctor:' , searchedDoctor);
//   const isDocLinked = Session.get('isDocLinked') || false;
//   return {
//     searchedDoctor,
//     searchedDocInfo,
//     isDocLinked,
//     isFetching: !Meteor.user() || !searchedDoctorHandle.ready(),
//   }
// }, AppointmentScheduler)
