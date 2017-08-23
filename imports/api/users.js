import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

import { CheckinHistories } from './checkin-histories'

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

  console.log(options)
  user.profile = options.profile || {};

  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;
  user.profile.backgroundURL = 'http://i2.cdn.turner.com/cnn/dam/assets/141202112409-profile-background-stock.jpg';

  CheckinHistories.insert({
    userId: user._id,
    dailyCompleted: 'no',
    lastCheckin: undefined,
    checkins: []
  });

  return user;
})
