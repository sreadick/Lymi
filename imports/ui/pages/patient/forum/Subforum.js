import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';
import ForumTopicForm from '/imports/ui/components/patient/forum/ForumTopicForm';

import { SubForums } from '/imports/api/forum';
import { Topics } from '/imports/api/forum';
import { ForumPosts } from '/imports/api/forum';

class Subforum extends React.Component {
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
      // <div className="page-content--forum-post">
      <div className="page-content page-content--forum">
        {/* <div className='forum-navbar z-depth-3'>
          <Input placeholder='serach'/>
          <h3 className='forum-navbar__title'>LymeLog Community</h3>
          <Button onClick={() => Session.set('showForumTopicForm', true)}>New Topic</Button>
        </div> */}
        { this.props.showForumTopicForm &&
          <ForumTopicForm subforum={this.props.subforum.name} category={this.props.subforum.category} />
        }
        <div className='forum-nav-box forum-nav-box--subforum'>
          {/* <div className='forum-nav-box--subforum__flex-wrapper'> */}
            <div className='forum-nav-box--subforum--top'>
              <h4>{this.props.subforum.name}</h4>
              <input className='forum-nav-box__input' placeholder='Search'/>
            </div>

            <nav className='forum-breadcrumb__wrapper forum-breadcrumb__wrapper--subforum'>
              <div className="nav-wrapper">
                <div className="col s12">
                  <Link to="/patient/forum" className="breadcrumb forum-nav-box__breadcrumb">Lyme Share</Link>
                  <a href="#" className="breadcrumb forum-nav-box__breadcrumb active">{this.props.subforum.name}</a>
                </div>
              </div>
            </nav>
          {/* </div> */}



          {/* <h2>Welcome to Lyme Share</h2>
          <p>Search for a topic or <span onClick={() => Session.set('showForumTopicForm', true)}>start a new one</span>.</p>
          <Input placeholder='Search'/> */}
        </div>
        {/* <div className='forum-sidebar'></div> */}
        <div className='forum-topic__section--subforum-page'>
          <div className='forum-topic__menu--subforum-page'>
            <Button className='white black-text' onClick={() => Session.set('showForumTopicForm', true)}>New Topic</Button>
            <div className='forum-topic__pagination'>
              <span>Prev</span>
              <span>1</span>
              <span>Next</span>
            </div>
          </div>
          <h5>{this.props.topics.length} {this.props.topics.length === 1 ? 'Topic:' : 'Topics'}</h5>
          {/* <div className='forum__wrapper--subform-page--topics'> */}
            <ul className="forum-topic__list">
              {this.props.topics.map((topic) => {
                const postResponses = this.props.thisSubforumPosts.filter(post => post.topicId === topic._id);
                const lastPost = postResponses.length > 0 ? postResponses[postResponses.length - 1] : undefined;
                return (
                  <li key={topic._id} className="forum-topic__list__item">
                    <div className='forum-topic__list__item--left'>
                      <img src={topic.authorAvatar} alt="" className="circle" />
                      <div className='forum-topic__list__item__main-content'>
                        <Link
                          className='forum-topic__list__item__title'
                          to={`/patient/forum/subforum/${this.props.subforum._id}/topic/${topic._id}`}>
                          {topic.title}
                        </Link>
                        <p>By <span>{topic.authorFirstName}</span> on {moment(topic.createdAt).format('MM-DD-YY')}</p>
                        {/* <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a> */}
                        {lastPost &&
                          <p>Latest post: {moment(lastPost.createdAt).fromNow()} by <span>{lastPost.authorFirstName}</span>.</p>
                        }
                      </div>
                    </div>
                    <div className='forum-topic__list__item__responses'>{postResponses.length} Responses</div>
                  </li>
                  )
                }
                // {/* <li key={topic._id} className="collection-item avatar">
                //   <img src={Meteor.user().profile.userPhoto} alt="" className="circle" />
                //   <span className="title">
                //     <Link to={`/patient/forum/subforum/${this.props.subforum._id}/topic/${topic._id}`}>
                //       {topic.title}
                //     </Link>
                //   </span>
                //   <p>By <b>{topic.authorFirstName}</b></p>
                //   <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                // </li> */}
              )}
            </ul>
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const subforumsHandle = Meteor.subscribe('subforums');
  const topicsHandle = Meteor.subscribe('topics');
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const subforumId = props.computedMatch.params.subforumId;
  const subforum = SubForums.findOne(subforumId);
  // const userData = Meteor.user() ? Meteor.user() : undefined;
  return {
    subforum,
    topics: subforumsHandle.ready() ? Topics.find({subforum: subforum.name}).fetch() : [],
    thisSubforumPosts: ForumPosts.find({subforumId: subforumId}).fetch(),
    showForumTopicForm: Session.get('showForumTopicForm') || false,
    isFetching: !subforumsHandle.ready() || !topicsHandle.ready() || !forumPostsHandle.ready() || !Meteor.user(),
  }
}, Subforum)
