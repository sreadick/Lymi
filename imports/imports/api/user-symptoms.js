import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

// import { getNextColor } from '../utils/utils';

export const UserSymptoms = new Mongo.Collection('userSymptoms');

if (Meteor.isServer) {
  Meteor.publish('userSymptoms', function() {
    return UserSymptoms.find({ userId: this.userId });
    this.ready();
  });
  Meteor.publish('patientSymptoms', function(patientId) {
    if (this.userId && Meteor.users.findOne(this.userId).account.type === 'doctor') {
      return UserSymptoms.find({ userId: patientId });
    } else {
      this.ready();
    }
  });
}

Meteor.methods({
  'userSymptoms.insert'(symptom) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // let userSymptomsLength = UserSymptoms.find({userId: this.userId}).fetch().length;
    // let currentColor = userSymptomsLength > 0 ? UserSymptoms.find({userId: this.userId}).fetch()[userSymptomsLength - 1].color : '#558B2F';
    UserSymptoms.insert({
      name: symptom.name,
      commonSymptomId: symptom.commonSymptomId || '',
      system: symptom.system || 'Other',
      description: symptom.description || '',
      dx: symptom.dx || [],
      userId: this.userId,
      color: symptom.color,
      createdAt: moment().valueOf(),
    });
  },
  'userSymptoms.remove'(symptomName) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    // const symptomToDelete = UserSymptoms.findOne({name: symptomName});
    //
    // if (!symptomToDelete) {
    //   throw new Meteor.Error('Symptom does not exist.');
    // }
    // UserSymptoms.remove({_id: symptomToDelete._id});
    return UserSymptoms.remove({name: symptomName});
  }
});
