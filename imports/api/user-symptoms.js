import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UserSymptoms = new Mongo.Collection('userSymptoms');

if (Meteor.isServer) {
  Meteor.publish('userSymptoms', function() {
    return UserSymptoms.find({ userId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'userSymptoms.insert'(symptomName) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    UserSymptoms.insert({
      name: symptomName,
      userId: this.userId
    });
  },
  'userSymptoms.remove'(symptomName) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const symptomToDelete = UserSymptoms.findOne({name: symptomName});

    if (!symptomToDelete) {
      throw new Meteor.Error('Symptom does not exist.');
    }
    UserSymptoms.remove({_id: symptomToDelete._id});
  }
});
