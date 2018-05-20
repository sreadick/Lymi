import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';
import ForumTopicForm from '/imports/ui/components/forum/ForumTopicForm';
import { TopicPagination } from '/imports/ui/components/forum/TopicPagination';

import { SubForums } from '/imports/api/forum';
import { Topics } from '/imports/api/forum';
import { ForumPosts } from '/imports/api/forum';

class Subforum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topicListGroup: 1
    };

    this.changeTopicListGroup = this.changeTopicListGroup.bind(this);
  }
  componentDidMount() {
    const numTopics = this.props.topics.length;
    const topicListGroup = Math.ceil(numTopics / 3);
    // this.setState({topicListGroup})
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.topics.length !== this.props.topics.length) {
      const numTopics = this.props.topics.length;
      const topicListGroup = Math.ceil(numTopics / 3);
      // this.setState({topicListGroup})
    }
  }
  changeTopicListGroup(newGroup) {
    this.setState({topicListGroup: newGroup})
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
          <ForumTopicForm subforumId={this.props.subforum._id} category={this.props.subforum.category} />
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
                  <Link to="/forum" className="breadcrumb forum-nav-box__breadcrumb">Lyme Share</Link>
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
            <button className='grey darken-4 white-text btn btn-flat' onClick={() => Session.set('showForumTopicForm', true)}>Start a Topic</button>
            {this.props.topics.length > 10 &&
              <TopicPagination
                topicListGroup={this.state.topicListGroup}
                totalTopicListGroups={this.props.totalTopicListGroups}
                changeTopicListGroup={this.changeTopicListGroup}
                position='top'
              />
            }
            {/* <div className='forum-topic__pagination'>
              <div
                className={`forum-topic__pagination__nav-text valign-wrapper ${this.state.topicListGroup !== 1 ? '' : 'disabled'}`}
                onClick={() => {
                  if (this.state.topicListGroup !== 1) {
                    this.setState({topicListGroup: this.state.topicListGroup - 1})
                  }
                }}>
                <i className='material-icons'>chevron_left</i>

                <span>Previous</span>
              </div>
              {this.props.topics.length > 10 ?
                <span>
                  {[...Array(Math.ceil(this.props.topics.length / 10)).keys()].map(num =>
                    <span
                      key={num}
                      className={`forum-topic__pagination__number ${this.state.topicListGroup === num + 1 && 'active'}`}
                      onClick={() => this.setState({topicListGroup: num + 1})}>
                      {num + 1}
                    </span>
                  )}
                </span>
                :
                <span className='forum-topic__pagination__number active'>1</span>
              }
              <div
                className={`forum-topic__pagination__nav-text valign-wrapper ${this.state.topicListGroup < this.props.totalTopicListGroups ? '' : 'disabled'}`}
                onClick={() => {
                  if (this.state.topicListGroup < this.props.totalTopicListGroups) {
                    this.setState({topicListGroup: this.state.topicListGroup + 1})
                  }
                }}>
                <span>Next</span>
                <i className='material-icons'>chevron_right</i>
              </div>
            </div> */}
          </div>
          <h5>{this.props.topics.length} {this.props.topics.length === 1 ? 'Topic:' : 'Topics'}</h5>
          {/* <div className='forum__wrapper--subform-page--topics'> */}
            <ul className="forum-topic__list">
              {this.props.topics.slice(((this.state.topicListGroup - 1) * 10), (this.state.topicListGroup * 10)).map((topic) => {
                const postResponses = this.props.thisSubforumPosts.filter(post => post.topicId === topic._id);
                const lastPost = postResponses.length > 0 ? postResponses[postResponses.length - 1] : undefined;
                return (
                  <li key={topic._id} className="forum-topic__list__item">
                    <div className='forum-topic__list__item--left'>
                      {topic.authorAvatar ?
                        <img src={topic.authorAvatar} alt="" className="circle" />
                        :
                        <span className='profile__avatar--inital forum-topic__list__item__avatar--inital'>{topic.authorFirstName.charAt(0)}</span>
                      }
                      <div className='forum-topic__list__item__main-content'>
                        <Link
                          className='forum-topic__list__item__title'
                          to={`/forum/subforum/${this.props.subforum._id}/topic/${topic._id}`}>
                          {topic.title}
                        </Link>
                        <p>By <span>{topic.authorUsername || topic.authorFirstName}</span> on {moment(topic.createdAt).format('MM-DD-YY')}</p>
                        {/* <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a> */}
                        {lastPost &&
                          <p>Latest post: {moment(lastPost.createdAt).fromNow()} by <span>{lastPost.authorUsername || lastPost.authorFirstName}</span>.</p>
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
                //     <Link to={`/forum/subforum/${this.props.subforum._id}/topic/${topic._id}`}>
                //       {topic.title}
                //     </Link>
                //   </span>
                //   <p>By <b>{topic.authorFirstName}</b></p>
                //   <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                // </li> */}
              )}
            </ul>

            {this.props.topics.length > 10 ?
              <TopicPagination
                topicListGroup={this.state.topicListGroup}
                totalTopicListGroups={this.props.totalTopicListGroups}
                changeTopicListGroup={this.changeTopicListGroup}
                position='bottom'
              />
              :
              <div className='section'></div>
            }
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
  const topics = subforumsHandle.ready() ? Topics.find({subforumId: subforumId}, {sort: {createdAt: -1}}).fetch() : [];

  // const userData = Meteor.user() ? Meteor.user() : undefined;
  return {
    subforum,
    topics,
    totalTopicListGroups: Math.ceil(topics.length / 10),
    // topics: subforumsHandle.ready() ? Topics.find({subforumId: subforumId}).fetch() : [],
    thisSubforumPosts: ForumPosts.find({subforumId: subforumId}).fetch(),
    showForumTopicForm: Session.get('showForumTopicForm') || false,
    isFetching: !subforumsHandle.ready() || !topicsHandle.ready() || !forumPostsHandle.ready() || !Meteor.user(),
  }
}, Subforum)
