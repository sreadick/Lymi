import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const ForumPosts = new Mongo.Collection('forumPosts');

if (Meteor.isServer) {
  Meteor.publish('forumPosts', function() {
    return ForumPosts.find({});
    this.ready();
  });
}

Meteor.methods({
  'forumPosts.insert'({title, body}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      title: {
        type: String,
        min: 1
      },
      body: {
        type: String,
        optional: true
      }
    }).validate({
      title, body
    });

    ForumPosts.insert({
      patientId: this.userId,
      patientFirstName: Meteor.users.findOne(this.userId).profile.firstName,
      title,
      body,
      createdAt: moment().valueOf(),
    });
  },
  'forumPosts.remove'({patientId, postId}) {

    if (!this.userId || !patientId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      patientId: {
        type: String,
        min: 1
      },
      postId: {
        type: String,
        min: 1
      }
    }).validate({
      patientId,
      postId
    });

    return ForumPosts.remove({patientId, doctorId});
  }
});
