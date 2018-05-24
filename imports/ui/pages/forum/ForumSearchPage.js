import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';
// import { TopicPagination } from '/imports/ui/components/forum/TopicPagination';

import ForumSearch from '/imports/ui/components/forum/ForumSearch';

import { SubForums } from '/imports/api/forum';
import { Topics } from '/imports/api/forum';
import { ForumPosts } from '/imports/api/forum';

class ForumSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // topicListGroup: 1
    };
  }

  renderTopics(topics) {
    // const foundTopics = this.props.topics.filter(topic => {
    //   const topicSentanceArray = topic.title.toLowerCase().split(' ');
    //   for (i = 0; i < topicSentanceArray.length; ++i) {
    //     if (this.props.queryStringArray.includes(topicSentanceArray[i])) {
    //       return true;
    //     }
    //   }
    //   return false;
    // });

    return topics.map(topic => {
      const topicSubforum = SubForums.findOne(topic.subforumId).name;
      return (
        <div className='forum-search-results__item' key={topic._id}>
          <div>
            <Link className='forum-search-results__item__title' to={`/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>
              {topic.title.split(" ").map((topicWord, index) => {
                if (this.props.queryStringArray.includes(topicWord.toLowerCase())) {
                  return <span key={index} className= 'yellow lighten-4'>{topicWord}</span>
                } else {
                  return <span key={index}>{topicWord}</span>
                }
              })}
            </Link>
            <h6>
              By <span>{topic.authorUsername}</span> in <Link to={`/forum/subforum/${topic.subforumId}`}>{topicSubforum}</Link>
            </h6>
          </div>
          <p>{moment(topic.createdAt).format('MM/DD/YYYY')}</p>
        </div>
      )
    })
  }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="page-content--forum-search">
        <div className='forum-search-results'>
          <div className='forum-search-results__header'>
            <Link className='material-icons' to='/forum'>keyboard_arrow_left</Link>
            <h4>Search</h4>
            <span className='material-icons'>keyboard_arrow_left</span>
          </div>
          <ForumSearch
            subforums={this.props.subforums}
            history={this.props.history}
            searchText={this.props.location.state.searchText}
            searchBoard={this.props.location.state.searchBoard}
          />
          <p className='forum-search-results__count'>{`${this.props.foundTopics.length} ${this.props.foundTopics.length === 1 ? 'Result' : 'Results'}`}</p>
          {this.props.foundTopics.length === 0 ?
            <p>Sorry, no items match your search.</p>
            :
            this.renderTopics(this.props.foundTopics)
          }
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const subforumsHandle = Meteor.subscribe('subforums');
  const topicsHandle = Meteor.subscribe('topics');
  const forumPostsHandle = Meteor.subscribe('forumPosts');

  // const subforum = SubForums.findOne(subforumId);

  // const userData = Meteor.user() ? Meteor.user() : undefined;
  const subforumId = props.computedMatch.params.subforumId;
  const query = props.computedMatch.params.query;

  const queryStringArray = query.toLowerCase().split(" ");

  const allTopics = subforumsHandle.ready() ? Topics.find({}, {sort: {createdAt: -1}}).fetch() : [];
  const subformTopics = allTopics.filter(topic => subforumId !== 'all' ? topic.subforumId === subforumId : true);
  const foundTopics = subformTopics.filter(topic => {
    const topicSentanceArray = topic.title.toLowerCase().split(' ');
    for (i = 0; i < topicSentanceArray.length; ++i) {
      if (queryStringArray.includes(topicSentanceArray[i])) {
        return true;
      }
    }
    return false;
  });
  return {
    showForumTopicForm: Session.get('showForumTopicForm') || false,
    // topics: topicsHandle.ready() ? topics.filter(topic => subforumId !== 'all' ? topic.subforumId === subforumId : true) : [],
    subforums: SubForums.find().fetch(),
    // queryStringArray: query.toLowerCase().split(" "),
    foundTopics,
    queryStringArray,
    isFetching: !subforumsHandle.ready() || !topicsHandle.ready() || !forumPostsHandle.ready() || !Meteor.user(),
  }
}, ForumSearchPage)
