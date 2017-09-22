import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

import { CheckinHistories } from './checkin-histories';
import { backgroundImages } from '../public/resources/backgroundImages';

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

  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.middleInitial = '';
  user.profile.lastName = options.lastName;

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

  user.profile.backgroundURL = backgroundImages[Math.floor(Math.random() * backgroundImages.length)]

  CheckinHistories.insert({
    userId: user._id,
    dailyCompleted: 'no',
    lastCheckin: undefined,
    checkins: []
  });

  return user;
})
