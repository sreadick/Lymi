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
  'forumPosts.insert'({category, title, body}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      category: {
        type: String,
        min: 1
      },
      title: {
        type: String,
        min: 1
      },
      body: {
        type: String,
        optional: true
      }
    }).validate({
      category, title, body
    });

    ForumPosts.insert({
      // patientId: this.userId, // change to authorId
      // patientFirstName: Meteor.users.findOne(this.userId).profile.firstName,  // ""
      authorId: this.userId,
      authorFirstName: Meteor.users.findOne(this.userId).profile.firstName,
      authorAlias: Meteor.users.findOne(this.userId).profile.userPhoto,
      category,
      title,
      body,
      responses: [],
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
  },

  'forumPosts.responses.insert'({postId, responseBody}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    new SimpleSchema({
      postId: {
        type: String,
        min: 1
      },
      responseBody: {
        type: String,
        min: 1
      }
    }).validate({
      postId,
      responseBody,
    });

    ForumPosts.update({ _id: postId }, {
      $push: {
        responses: {
          $each: [{
            postId,
            authorId: this.userId,
            authorFirstName: Meteor.users.findOne(this.userId).profile.firstName,
            authorAlias: Meteor.users.findOne(this.userId).profile.userPhoto,
            body: responseBody,
            responseTarget: 'top_level',
            createdAt: moment().valueOf()
          }]
        }
      }
    })
  },

});
