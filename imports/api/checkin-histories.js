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
  'checkinHistories.checkins.create'({ date, symptoms, treatments, position }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    CheckinHistories.update({ userId: this.userId }, {
      $push: {
        checkins: {
          $each: [{
            date,
            symptoms: symptoms.map((symptom) => {
              return { name: symptom.name, severity: 0 }
            }),
            treatments: treatments.map((treatment) => {
              return { name: treatment.name, compliance: undefined }
            }),
          }],
          $position: position
        }
      }
    });
  },
  'checkinHistories.checkins.update'({ date, symptoms, todaysCheckinSymptoms, treatments, todaysCheckinTreatments }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const symptomsPath = `checkins.${dateIndex}.symptoms`;
    const treatmentsPath = `checkins.${dateIndex}.treatments`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [symptomsPath] : symptoms.map((symptom) => {
          return {
            name: symptom.name,
            severity: todaysCheckinSymptoms.find((checkinSymptom) => symptom.name === checkinSymptom.name) ? todaysCheckinSymptoms.find((checkinSymptom) => symptom.name === checkinSymptom.name).severity : 0
          }
        }),
        [treatmentsPath] : treatments.map((treatment) => {
          return {
            name: treatment.name,
            compliance: todaysCheckinTreatments.find((checkinTreatment) => treatment.name === checkinTreatment.name) ? todaysCheckinTreatments.find((checkinTreatment) => treatment.name === checkinTreatment.name).compliance : undefined
           }
        }),
      }
    });
  },
  // 'checkinHistories.checkins.symptoms.update'({ date, symptoms, todaysCheckinSymptoms }) {
  //   if (!this.userId) {
  //     throw new Meteor.Error('not-authorized');
  //   }
  //   const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
  //   const fieldPath = `checkins.${dateIndex}.symptoms`;
  //
  //   CheckinHistories.update({userId: this.userId}, {
  //     $set: {
  //       [fieldPath] : symptoms.map((symptom) => {
  //         return {
  //           name: symptom.name,
  //           severity: todaysCheckinSymptoms.find((checkinSymptom) => symptom.name === checkinSymptom.name) ? todaysCheckinSymptoms.find((checkinSymptom) => symptom.name === checkinSymptom.name).severity : 0
  //         }
  //       }),
  //     }
  //   });
  // },
  // 'checkinHistories.checkins.treatments.update'({ date, treatments, todaysCheckinTreatments }) {
  //   if (!this.userId) {
  //     throw new Meteor.Error('not-authorized');
  //   }
  //   const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
  //   const fieldPath = `checkins.${dateIndex}.treatments`;
  //
  //   CheckinHistories.update({userId: this.userId}, {
  //     $set: {
  //       [fieldPath] : treatments.map((treatment) => {
  //         return {
  //           name: treatment.name,
  //           compliance: todaysCheckinTreatments.find((checkinTreatment) => treatment.name === checkinTreatment.name) ? todaysCheckinTreatments.find((checkinTreatment) => treatment.name === checkinTreatment.name).compliance : undefined
  //          }
  //       }),
  //     }
  //   });
  // },
  'checkinHistories.symptom.update'(symptom, severity, date) {
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const symptomIndex = CheckinHistories.findOne({userId: this.userId}).checkins[dateIndex].symptoms.findIndex((thisSymptom) => thisSymptom.name === symptom.name);
    const fieldPath = `checkins.${dateIndex}.symptoms.${symptomIndex}.severity`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [fieldPath] : severity,
        lastCheckin: new Date()
      }
    });
  },
  'checkinHistories.treatment.update'(treatment, answer, date) {
    const dateIndex = CheckinHistories.findOne({userId: this.userId}).checkins.findIndex((checkin) => checkin.date === date);
    const treatmentIndex = CheckinHistories.findOne({userId: this.userId}).checkins[dateIndex].treatments.findIndex((thisTreatment) => thisTreatment.name === treatment.name);
    const fieldPath = `checkins.${dateIndex}.treatments.${treatmentIndex}.compliance`;

    CheckinHistories.update({userId: this.userId}, {
      $set: {
        [fieldPath] : answer,
        lastCheckin: new Date()
      }
    });
  },
  // 'checkinHistories.dailyCompleted.update'(completed) {
  //   CheckinHistories.update({userId: this.userId}, {
  //     $set: {
  //       dailyCompleted: completed,
  //       lastCheckin: new Date()
  //     }
  //   });
  // }
})
