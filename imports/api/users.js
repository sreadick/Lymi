import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

import { CheckinHistories } from './checkin-histories';
import { backgroundImages } from '../public/resources/backgroundImages';

Meteor.publish('userData', function() {
  if (this.userId) {
    return Meteor.users.find(this.userId, {
      fields: { accountType: 1 }
    });
  } else {
    this.ready();
  }
});

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

  if (options.accountType === 'patient') {
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
