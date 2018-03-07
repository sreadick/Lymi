import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const SubForums = new Mongo.Collection('subforums');
export const Topics = new Mongo.Collection('topics');
export const ForumPosts = new Mongo.Collection('forumPosts');

if (Meteor.isServer) {
  Meteor.publish('subforums', function() {
    return SubForums.find({});
    this.ready();
  });
  Meteor.publish('topics', function() {
    return Topics.find({});
    this.ready();
  });
  Meteor.publish('forumPosts', function() {
    return ForumPosts.find({});
    this.ready();
  });
}

Meteor.methods({
  'subforums.insert'({category, name}) {
    // console.log(this.userId || '3333333');
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    new SimpleSchema({
      category: {
        type: String,
        min: 1
      },
      name: {
        type: String,
        min: 1
      }
    }).validate({category, name});

    SubForums.insert({
      name,
      category,
      numTopics: 0,
      numPosts: 0,
      lastPostTime: undefined,
      createdAt: moment().valueOf(),
    });
  },
  'topics.insert'({subforumId, title, body}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      subforumId: {
        type: String,
        min: 1
      },
      title: {
        type: String,
        min: 1
      },
      body: {
        type: String,
        min: 1,
        // optional: true
      }
    }).validate({
      subforumId, title, body
    });

    Topics.insert({
      authorId: this.userId,
      authorFirstName: Meteor.users.findOne(this.userId).profile.firstName,
      authorAvatar: Meteor.users.findOne(this.userId).profile.userPhoto,
      subforumId,
      title,
      body,
      createdAt: moment().valueOf(),
    });
    SubForums.update(subforumId, {
      $inc: { numTopics: 1 }
    });
  },
  'forumPosts.insert'({topicId, subforumId, body}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      topicId: {
        type: String,
        min: 1
      },
      subforumId: {
        type: String,
        min: 1
      },
      body: {
        type: String,
        optional: true
      }
    }).validate({
      topicId, subforumId, body
    });

    ForumPosts.insert({
      // patientId: this.userId, // change to authorId
      // patientFirstName: Meteor.users.findOne(this.userId).profile.firstName,  // ""
      topicId,
      subforumId,
      body,
      authorId: this.userId,
      authorFirstName: Meteor.users.findOne(this.userId).profile.firstName,
      authorAvatar: Meteor.users.findOne(this.userId).profile.userPhoto,
      createdAt: moment().valueOf(),
    });
    SubForums.update({_id: subforumId}, {
      $inc: {
        numPosts: 1
      },
      $set: {
        lastPostTime: moment().valueOf()
      }
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
            authorAvatar: Meteor.users.findOne(this.userId).profile.userPhoto,
            body: responseBody,
            responseTarget: 'top_level',
            createdAt: moment().valueOf()
          }]
        }
      }
    })
  },

});
