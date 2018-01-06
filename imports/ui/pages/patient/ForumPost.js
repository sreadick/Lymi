import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';

import { ForumPosts } from '../../../api/forum-posts';

class ForumPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="page-content">
        <h1>Post: {this.props.post.title}</h1>
        <div>{this.props.post.body}</div>
        <div>Asked by {this.props.post.patientFirstName}</div>
        {this.props.post.patientId === Meteor.userId() &&
          <Link to='#'>Edit</Link>
        }
      </div>
    );
  }
}

export default createContainer(props => {
  const forumPostsHandle = Meteor.subscribe('forumPosts');

  const postId = props.computedMatch.params.postId;
  return {
    post: ForumPosts.findOne(postId),
    isFetching: !forumPostsHandle.ready()
  }
}, ForumPost)
