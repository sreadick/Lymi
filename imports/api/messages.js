import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  Meteor.publish('messages', function() {
    return Messages.find({ patientId: this.userId });
    this.ready();
  });
}

Meteor.methods({
  'messages.insert'({patientId, body}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      patientId: {
        type: String,
        min: 1
      },
      body: {
        type: String,
        min: 1
      }
    }).validate({
      patientId, body
    });

    const doctor = Meteor.users.findOne(this.userId);
    Messages.insert({
      patientId,
      body,
      doctorId: doctor._id,
      doctorName: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
      viewed: false,
      createdAt: moment().valueOf()
    });
  },
  'messages.update'({messageId, updateProp, newValue}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Messages.update({_id: messageId}, {
      $set: {
        [updateProp]: newValue
      }
    });
  },
});
