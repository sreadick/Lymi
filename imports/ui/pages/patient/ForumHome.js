import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { ForumPosts } from '../../../api/forum-posts';

import { ForumPostForm } from '../../components/patient/forum/ForumPostForm';
import Loader from '/imports/ui/components/Loader';

class ForumHome extends React.Component {
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
      <div className="page-content page-content--forum">
        {/* <h3 className='deep-purple-text text-darken-2'>Welcome to LymeLog Forum</h3> */}
        <div className='forum-navbar z-depth-3'>
          <Input placeholder='serach'/>
          <h3 className='forum-navbar__title'>LymeLog Community</h3>
          <Button onClick={() => Session.set('showForumPostForm', true)}>New Post</Button>
        </div>

        { this.props.showForumPostForm &&
          <ForumPostForm />
        }
        <div className='section'>
          <h3>Latest Posts:</h3>
          <ul>
            {this.props.latestPosts.map(post =>
              <li key={post._id}>
                <Link to={`/patient/forum/post/${post._id}`}>
                  {post.title}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  Meteor.subscribe('forumPosts');

  return {
    showForumPostForm: Session.get('showForumPostForm'),
    latestPosts: ForumPosts.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, ForumHome)
