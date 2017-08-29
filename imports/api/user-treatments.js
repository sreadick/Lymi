import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const UserTreatments = new Mongo.Collection('userTreatments');

if (Meteor.isServer) {
  Meteor.publish('userTreatments', function() {
    return UserTreatments.find({ userId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'userTreatments.insert'() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    UserTreatments.insert({
      name: '',
      amount: 1,
      dose: 0,
      dose_type: 'mg',
      frequency: 1,
      errors: {
        name: "needs to be at least three characters.",
        dose: "should be a positive number"
      },
      includeDetails: false,
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      startDateValue: undefined,
      endDateValue: undefined,
      dateRangeToggled: false,
      createdAt: moment().valueOf(),
      userId: this.userId
    });
  },

  'userTreatments.update'(_id, updates) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    if (Object.keys(updates).includes("amount") || Object.keys(updates).includes("frequency")) {
      updates[Object.keys(updates)[0]] = parseInt(updates[Object.keys(updates)[0]]) || 0;
    } else if (Object.keys(updates).includes("dose")) {
      updates[Object.keys(updates)[0]] = parseFloat(updates[Object.keys(updates)[0]]) || 0;
    } else if (Object.keys(updates).includes("dose_type")) {
      if (updates.dose_type === 'pills') {
        updates.dose = 0;
      }
    }
    // console.log(updates);

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
      name: {
        type: String,
        optional: true
      },
      amount: {
        type: Number,
        optional: true
      },
      dose: {
        type: Number,
        optional: true
      },
      dose_type: {
        type: String,
        optional: true
      },
      frequency: {
        type: Number,
        optional: true
      },
      includeDetails: {
        type: Boolean,
        optional: true
      },
      daysOfWeek: {
        type: Array,
        optional: true
      },
      'daysOfWeek.$': {
        type: String,
        optional: true
      },
      startDateValue: {
        type: Number,
        optional: true
      },
      endDateValue: {
        type: Number,
        optional: true
      },
      dateRangeToggled: {
        type: Boolean,
        optional: true
      },
      errors: {
        type: Object,
        optional: true,
        blackbox: true
      }
    }).validate({
      _id,
      ...updates
    });

    // console.log(UserTreatments.find({_id}).fetch());
    // console.log(updates);

    UserTreatments.update({
      _id, userId: this.userId
    }, {
      $set: {
        ...updates,
        userId: this.userId
      }
    });
  },
  'userTreatments.remove'(_id) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({
      _id
    });
    UserTreatments.remove({_id, userId: this.userId});
  }
});
