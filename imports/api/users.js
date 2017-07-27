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

  CheckinHistories.insert({
    userId: user._id,
    dailyCompleted: false,
    lastCheckin: undefined,
    checkins: []
  });

  return user;
})
