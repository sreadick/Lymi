import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CommonSymptoms = new Mongo.Collection('commonSymptoms');

if (Meteor.isServer) {
  Meteor.publish('commonSymptoms', function() {
    return CommonSymptoms.find({});
    this.ready();
  });
}

Meteor.methods({
  'commonSymptoms.insert'(symptom) {
    CommonSymptoms.insert(symptom);
  },
  'commonSymptoms.removeAll'() {
    CommonSymptoms.remove({});
  },
})
