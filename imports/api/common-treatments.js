import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CommonTreatments = new Mongo.Collection('commonTreatments');

if (Meteor.isServer) {
  Meteor.publish('commonTreatments', function() {
    return CommonTreatments.find({});
    this.ready();
  });
}

Meteor.methods({
  'commonTreatments.insert'(treatment) {
    CommonTreatments.insert(treatment);
  },
  'commonTreatments.removeAll'() {
    CommonTreatments.remove({});
  },
})
