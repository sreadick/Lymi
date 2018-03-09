import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import moment from 'moment';

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
    if (this.userId && Meteor.users.findOne(this.userId).account.type === 'doctor') {
      // console.log(Meteor.users.find({'account.type': 'patient', doctorId: this.userId}).fetch());
      return Meteor.users.find({'account.type': 'patient', doctorId: this.userId});
    } else {
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
      return Meteor.users.find({'account.type': 'doctor', _id: doctorId}, {
        fields: { 'profile.npi': 0 }
      });
    } else {
      return this.ready();
    }
  });

  Meteor.publish('searchedDoctor', function(docInfo) {
    if (this.userId) {
      return Meteor.users.find({'account.type': 'doctor', 'profile.firstName': docInfo.firstName, 'profile.lastName': docInfo.lastName, 'profile.zip': docInfo.zip}, {
        fields: { emails: 0 }
      });
    } else {
      return this.ready();
    }
  });
  // Meteor.publish('searchedDoctor', function(sixCharKeyQuery) {
  //   if (this.userId) {
  //     return Meteor.users.find({'account.type': 'doctor', sixCharKey: sixCharKeyQuery}, {
  //       fields: { emails: 0 }
  //     });
  //   } else {
  //     return this.ready();
  //   }
  // });
}

Meteor.publish('allUsers', function() {
  if (this.userId && Meteor.users.findOne(this.userId).account.type === 'admin') {
    return Meteor.users.find({});
  } else {
    this.ready();
  }
});

Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;
  const username = user.username;
  console.log(username);
  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    username: {
      type: String,
      min: 4,
      max: 14
    }
  }).validate({ email, username });

  return true;
});

Accounts.onCreateUser((options, user) => {

  // user.accountType = options.accountType;
  user.account = {
    type: options.accountType,
    createdAt: moment().valueOf()
  };

  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;

  if (user.account.type === 'doctor') {
    user.profile.officeAddress = options.doctorInfo.officeAddress;
    user.profile.city = options.doctorInfo.city;
    user.profile.state = options.doctorInfo.state;
    user.profile.zip = options.doctorInfo.zip;
    user.profile.phone = options.doctorInfo.phone;
    user.profile.npi = options.doctorInfo.npi;

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
      appointments: [],
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
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update(this.userId, {
      $set: {
        doctorId
      }
    });
  },
  'users.updateAccountStatus'({userId, status}) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update(userId, {
      $set: {
        'account.status': status
      }
    });
  },
  'users.appointments.create'(date) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update(this.userId, {
      $push: {
        'profile.medical.appointments': date
      }
    });
  },
  'users.appointments.updateLast'(date) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    const appts = Meteor.user().profile.medical.appointments.slice();
    appts[appts.length - 1] = date;

    Meteor.users.update(this.userId, {
      $set: {
        'profile.medical.appointments': appts
      }
    });
  },
  'users.appointments.removeLast'() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Meteor.users.update(this.userId, {
      $pop: {
        'profile.medical.appointments': 1
      }
    });
  },
})
