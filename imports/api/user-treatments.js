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
      dose_type: 'milligrams',
      frequency: 1,
      errors: {},
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
    }

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
      errors: {
        type: Object,
        optional: true,
        blackbox: true
      }
    }).validate({
      _id,
      ...updates
    });

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
