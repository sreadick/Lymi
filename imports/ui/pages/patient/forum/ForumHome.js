import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

// import { ForumPosts } from '../../../api/forum-posts';
import { Topics } from '/imports/api/forum';
import { SubForums } from '/imports/api/forum';

import ForumTopicForm from '/imports/ui/components/patient/forum/ForumTopicForm';
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
        {/* <div className='forum-navbar z-depth-3'>
          <Input placeholder='serach'/>
          <h3 className='forum-navbar__title'>Welcome to Lyme Share</h3>
          <Button onClick={() => Session.set('showForumTopicForm', true)}>New Topic</Button>
        </div> */}

        { this.props.showForumTopicForm &&
          <ForumTopicForm />
        }

        <div className='forum-nav-box forum-nav-box--home'>
          <h2>Welcome to Lyme Share</h2>
          <p>Search for a topic or <span onClick={() => Session.set('showForumTopicForm', true)}>start a new one</span>.</p>
          <Input placeholder='Search'/>
        </div>
        <div className='forum__flex-wrapper--home'>
          <div className='forum-table z-depth-1'>
            <table>
              <thead>
                <tr className='forum-table__heading'>
                  <th>Boards</th>
                  <th>Topics</th>
                  <th>Posts</th>
                  <th>Last Post</th>
                </tr>
              </thead>
                {this.props.subforums.map((subforum, index, array) => {
                  let showCategory = false;
                  if (index === 0) {
                    showCategory = true;
                  } else if (subforum.category !== array[index - 1].category) {
                    showCategory = true;
                  }
                  return (
                    <tbody key={subforum._id}>
                      {showCategory &&
                        <tr>
                          <td colSpan='4' className='forum-table__category'><b>{subforum.category}</b></td>
                        </tr>
                      }
                      <tr className='forum-table__item'>
                        <td>
                          <Link
                            className='forum-table__item__title'
                            to={`/patient/forum/subforum/${subforum._id}`}>
                            {subforum.name}
                          </Link>
                        </td>
                        <td>{subforum.numTopics}</td>
                        <td>{subforum.numPosts}</td>
                        <td>{subforum.lastPostTime ? moment(subforum.lastPostTime).fromNow() : ''}</td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
          <div className='forum-topic__list--home z-depth-1'>
            <h5>Latest Topics:</h5>
            <ul>
              {this.props.latestTopics.map(topic => {
                return (
                  <li key={topic._id}>
                    <Link to={`/patient/forum/subforum/${topic.subforumId}/topic/${topic._id}`}>
                      {topic.title.length > 43 ? topic.title.substring(1, 40) + '...' : topic.title}
                    </Link>
                    <p>By {topic.authorUsername || topic.authorFirstName}</p>
                  </li>
                )
              }
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const subforumsHandle = Meteor.subscribe('subforums');
  const topicsHandle = Meteor.subscribe('topics');
  return {
    showForumTopicForm: Session.get('showForumTopicForm'),
    latestTopics: Topics.find({}, {sort: {createdAt: -1}, limit: 10}).fetch(),
    subforums: SubForums.find().fetch(),
    isFetching: !subforumsHandle.ready() || !topicsHandle.ready()
  }
}, ForumHome)


// {/* <tbody key={forumItem.category}>
//   <tr>
//     <td><b>{forumItem.category}</b></td>
//   </tr>
//   {forumItem.subforums.map(subforum =>
//     <tr key={subforum}>
//       <td>{subforum}</td>
//       <td>58</td>
//       <td>202</td>
//       <td>Today</td>
//     </tr>
//   )}
// </tbody> */}
