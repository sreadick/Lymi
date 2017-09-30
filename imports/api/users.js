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
        fields: { accountType: 1, doctorId: 1, sixCharKey: 1 }
      });
    } else {
      this.ready();
    }
  });

  Meteor.publish('currentPatients', function() {
    if (this.userId && Meteor.users.findOne(this.userId).accountType === 'doctor') {
      return Meteor.users.find({accountType: 'patient', doctorId: this.userId});
    } else {
      this.ready();
    }
  });

  Meteor.publish('allPatients', function() {
    if (this.userId && Meteor.users.findOne(this.userId).accountType === 'doctor') {
      return Meteor.users.find({accountType: 'patient'});
    } else {
      this.ready();
    }
  });

  Meteor.publish('currentDoctor', function(doctorId) {
    if (this.userId) {
      return Meteor.users.find({accountType: 'doctor', _id: doctorId});
    } else {
      return this.ready();
    }
  });

  Meteor.publish('searchedDoctor', function(sixCharKeyQuery) {
    if (this.userId) {
      return Meteor.users.find({accountType: 'doctor', sixCharKey: sixCharKeyQuery}, {
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

  user.accountType = options.accountType;

  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;

  if (options.accountType === 'doctor') {
    user.sixCharKey = Random.id(6);
  } else if (options.accountType === 'patient') {
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
  }
})
