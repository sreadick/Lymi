import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Requests = new Mongo.Collection('requests');

if (Meteor.isServer) {
  Meteor.publish('requestsToUser', function() {
    return Requests.find({ userId: this.userId });
    this.ready();
  });
  Meteor.publish('requestsFromDoctor', function() {
    return Requests.find({ doctorId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'requests.insert'(patientId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      patientId: {
        type: String,
        min: 1
      }
    }).validate({
      patientId
    });

    const doctor = Meteor.users.findOne(this.userId);
    Requests.insert({
      userId: patientId,
      doctorId: doctor._id,
      doctorName: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
      createdAt: moment().valueOf(),
    });
  },
  'requests.remove'({patientId, doctorId}) {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      patientId: {
        type: String,
        min: 1
      },
      doctorId: {
        type: String,
        min: 1
      }
    }).validate({
      patientId,
      doctorId
    });

    return Requests.remove({userId: patientId, doctorId});
  }
});
