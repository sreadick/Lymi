import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UserTreatments = new Mongo.Collection('userTreatments');

if (Meteor.isServer) {
  Meteor.publish('userTreatments', function() {
    return UserTreatments.find({ userId: this.userId });
  });
}

Meteor.methods({
  'user-treatments.insert'(treatment) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    treatment.amount = parseInt(treatment.amount);
    treatment.dose = parseInt(treatment.dose);
    treatment.frequency = parseInt(treatment.frequency);
    console.log(treatment)

    new SimpleSchema({
      name: {
        type: String,
        min: 3
      },
      amount: {
        type: Number,
        min: 1
      },
      dose: {
        type: Number
      },
      frequency: {
        type: Number,
        min: 1
      }
    }).validate({
      name: treatment.name,
      amount: treatment.amount,
      dose: treatment.dose,
      frequency: treatment.frequency
    });

    UserTreatments.insert({
      ...treatment,
      userId: this.userId
    });
  }
});
