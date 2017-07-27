import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const CheckinHistories = new Mongo.Collection('checkinHistories')

if (Meteor.isServer) {
  Meteor.publish('checkinHistories', function() {
    return CheckinHistories.find({ userId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'checkinHistories.addCheckin'({ date, symptoms, treatments }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    CheckinHistories.update({ userId: this.userId}, {
      $push: {
        checkins: {
          date,
          symptoms: symptoms.map((symptom) => {
            return { name: symptom.name, severity: 0 }
          }),
          treatments: treatments.map((treatment) => {
            return { name: treatment.name, tookToday: undefined }
          }),
        }
      }
    });
  },
  'checkinHistories.symptom.update'(symptom, severity, date, symptomsCheckinQuery) {
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const symptomIndex = CheckinHistories.findOne({userId: this.userId}).checkins[dateIndex].symptoms.findIndex((thisSymptom) => thisSymptom.name === symptom.name);
    const fieldPath = `checkins.${dateIndex}.symptoms.${symptomIndex}.severity`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [fieldPath] : severity
      }
    });
  }
})
