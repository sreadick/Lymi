import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CheckinHistories = new Mongo.Collection('checkinHistories')

if (Meteor.isServer) {
  Meteor.publish('checkinHistories', function() {
    return CheckinHistories.find({ userId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'checkinHistories.checkins.update'({ date, symptoms, treatments }) {
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
            return { name: treatment.name, compliance: undefined }
          }),
        }
      }
    });
  },
  'checkinHistories.symptom.update'(symptom, severity, date) {
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const symptomIndex = CheckinHistories.findOne({userId: this.userId}).checkins[dateIndex].symptoms.findIndex((thisSymptom) => thisSymptom.name === symptom.name);
    const fieldPath = `checkins.${dateIndex}.symptoms.${symptomIndex}.severity`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [fieldPath] : severity
      }
    });
  },
  'checkinHistories.treatment.update'(treatment, answer, date) {
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const treatmentIndex = CheckinHistories.findOne({userId: this.userId}).checkins[dateIndex].treatments.findIndex((thisTreatment) => thisTreatment.name === treatment.name);
    const fieldPath = `checkins.${dateIndex}.treatments.${treatmentIndex}.compliance`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [fieldPath] : answer
      }
    });
  },
  'checkinHistories.dailyCompleted.update'() {
    CheckinHistories.update({userId: this.userId}, {
      $set: {
        dailyCompleted: true,
        lastCheckin: new Date()
      }
    });
  }
})