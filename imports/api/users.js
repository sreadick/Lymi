import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'

import { CheckinHistories } from './checkin-histories';
import { backgroundImages } from '../public/resources/backgroundImages';

if (Meteor.isServer) {
  Meteor.publish('userData', function() {
    if (this.userId) {
      return Meteor.users.find(this.userId, {
        fields: { account: 1, doctorId: 1, sixCharKey: 1 }
      });
    } else {
      this.ready();
    }
  });

  Meteor.publish('currentPatients', function() {
    // console.log(1);
    if (this.userId && Meteor.users.findOne(this.userId).account.type === 'doctor') {
      console.log(2);
      console.log(Meteor.users.find({'account.type': 'patient', doctorId: this.userId}).fetch());
      return Meteor.users.find({'account.type': 'patient', doctorId: this.userId});
    } else {
      console.log(3);
      this.ready();
    }
  });

  Meteor.publish('allPatients', function() {
    if (this.userId && Meteor.users.findOne(this.userId).account.type === 'doctor') {
      return Meteor.users.find({'account.type': 'patient'});
    } else {
      this.ready();
    }
  });

  Meteor.publish('currentDoctor', function(doctorId) {
    if (this.userId) {
      return Meteor.users.find({'account.type': 'doctor', _id: doctorId});
    } else {
      return this.ready();
    }
  });

  Meteor.publish('searchedDoctor', function(sixCharKeyQuery) {
    if (this.userId) {
      return Meteor.users.find({'account.type': 'doctor', sixCharKey: sixCharKeyQuery}, {
        fields: { emails: 0 }
      });
    } else {
      return this.ready();
      // return {}
    }
  });
}


Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;

  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validate({ email });

  return true;
});

Accounts.onCreateUser((options, user) => {

  // user.accountType = options.accountType;
  user.account = {
    type: options.accountType
  };

  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;

  if (user.account.type === 'doctor') {
    user.sixCharKey = Random.id(6);
    user.account.status = 'pending approval'
  } else if (user.account.type === 'patient') {
    user.account.status = 'initializing'
    user.profile.middleInitial = '';

    user.profile.birthMonth = '';
    user.profile.birthDay = '';
    user.profile.birthYear = '';

    user.profile.street = '';
    user.profile.apartment = '';
    user.profile.city = '';
    user.profile.state = '';
    user.profile.zip = '';

    user.profile.homePhone = '';
    user.profile.cellPhone = '';

    user.profile.medical = {
      tickBorneDiseases: [],
      initialInfectionDate: '',
    }

    user.profile.settings = {
      trackedItems: ['symptoms', 'treatments', 'notable events']
    }

    user.profile.backgroundURL = backgroundImages[Math.floor(Math.random() * backgroundImages.length)]

    CheckinHistories.insert({
      userId: user._id,
      lastCheckin: undefined,
      checkins: []
    });
  }

  return user;
})

Meteor.methods({
  'users.updateLymeDoctor'(doctorId) {
    Meteor.users.update(this.userId, {
      $set: {
        doctorId
      }
    });
  },
  'users.updateAccountStatus'(status) {
    Meteor.users.update(this.userId, {
      $set: {
        'account.status': status
      }
    })
  }
})
