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
    checkins: [

    ]
  });

  return user;
})

// if (Meteor.isServer) {
//   Meteor.publish('Meteor.users.checkinHistories', function() {
//
//     new SimpleSchema({
//       _id: {
//         type: String,
//         min: 1
//       }
//     }).validate({_id: this.userId});
//
//     const options = {
//       fields: {
//         checkinHistory: 1
//       }
//     }
//     return Meteor.users.find({ _id: this.userId }, options)
//   })
// }
