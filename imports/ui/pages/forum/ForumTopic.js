import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';
import ForumPostForm from '/imports/ui/components/forum/ForumPostForm';

// import { ForumPosts } from '../../../api/forum-posts';
import { ForumPosts } from '/imports/api/forum';
import { Topics } from '/imports/api/forum';
import { SubForums } from '/imports/api/forum';

class ForumTopic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  renderPosts() {
    return this.props.posts.map((post, index) => {
      return (
        <div className='forum-post' key={post._id}>
          <div className='forum-post__subheading'>
            {post.authorAvatar ?
              <img className='forum-post__avatar circle' src={post.authorAvatar} />
              :
              <span className='forum-post__avatar--initial'>
                {post.authorUsername ?
                  post.authorUsername.charAt(0)
                  :
                  post.authorFirstName.charAt(0)
                }
              </span>
            }
            <div>
              <h5 className='forum-post__author'>
                {post.authorUsername || post.authorFirstName}
              </h5>
              <h6 className='forum-post__timestamp'>{moment(post.createdAt).fromNow()}</h6>
            </div>
          </div>
          <div className='forum-post__body'>{post.body}</div>
          {/* <hr /> */}
        </div>
      );
    })
  }

  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="page-content--forum-topic">
        <div className='forum__message__wrapper'>
          <div className='forum__message--success' id='forum__message--success'>
            <span>Response Successful!</span>
            <i className="material-icons right" onClick={() => {
              const postSuccessMessage = document.getElementById('forum__message--success');
              postSuccessMessage.classList.remove('active');
            }}>close</i>
          </div>
        </div>

        <nav className='forum-breadcrumb__wrapper'>
          <div className="nav-wrapper">
            <div className="col s12">
              <Link to="/forum" className="breadcrumb forum-nav-box__breadcrumb">Lyme Share</Link>
              <Link to={`/forum/subforum/${this.props.subforumId}`} className="breadcrumb forum-nav-box__breadcrumb">{this.props.subforumTitle}</Link>
              <a href="#" className="breadcrumb forum-nav-box__breadcrumb active">{this.props.topic.title}</a>
            </div>
          </div>
        </nav>

        <div className='forum-topic z-depth-2'>
          <div className='forum-topic__header'>
            <h2 className='forum-topic__title'>{this.props.topic.title}</h2>
            {/* <Button className='blue btn forum-topic__button--new-topic' onClick={() => Session.set('showPostForm', true)}>Respond</Button> */}
            {this.props.topic.authorId === Meteor.userId() ?
              <div>
                <button className='grey lighten-2 grey-text text-darken-2 btn'
                  onClick={() => Session.set('showPostForm', true)}>
                  {/* <i className="material-icons left">mode_edit</i> */}
                  Respond
                </button>
                <button className='forum-topic__button--edit blue lighten-2 white-text btn'
                  onClick={() => alert('edit feature coming soon...')}>
                  {/* <i className="material-icons left">mode_edit</i> */}
                  Edit
                </button>
              </div>
              :
              <button className='grey lighten-2 grey-text text-darken-2 btn btn-flat'
                onClick={() => Session.set('showPostForm', true)}>
                <i className="material-icons left">mode_edit</i>
                Respond
              </button>
            }
          </div>
          <div className='forum-topic__flex-wrapper'>
            <div className='forum-topic__flex-wrapper--left'>
              <div className='forum-topic__body'>{this.props.topic.body}</div>

              {this.props.showPostForm &&
                <ForumPostForm topicId={this.props.topic._id} subforumId={this.props.subforumId} />
              }
              <p
                className='forum-topic__num-responses'>
                {this.props.posts.length} {this.props.posts.length === 1 ? 'Response' : 'Responses'}
              </p>
            </div>
            <div className='forum-topic__flex-wrapper--right'>
              <p>Submitted: {moment(this.props.topic.createdAt).format('MM-DD-YY')}</p>
              <p>By: {this.props.topic.authorUsername || this.props.topic.authorFirstName}
                {this.props.topic.authorAvatar ?
                  <img className='forum-topic__avatar' src={this.props.topic.authorAvatar} />
                  :
                  <span className='profile__avatar--inital forum-topic__avatar--initial'>
                    {this.props.topic.authorUsername ?
                      this.props.topic.authorUsername.charAt(0)
                      :
                      this.props.topic.authorFirstName.charAt(0)
                    }
                  </span>
                }
              </p>
              <p>Viewed: 10 times</p>
              {/* <div className='forum-topic__info'>
                {this.props.post.authorAlias ?
                  <img className='forum-post__alias' src={this.props.post.authorAlias} />
                  :
                  <span className='forum-post__alias--initial'>{this.props.post.authorFirstName.charAt(0)}</span>
                }
                <div>
                  <h5 className='forum-post__author'>{this.props.post.authorFirstName}
                     <span> (Patient)</span>
                  </h5>
                  <h6 className='forum-post__timestamp'>{moment(this.props.post.createdAt).format('MM/DD/YY')}</h6>
                </div>
              </div> */}
            </div>
          </div>
          <hr />
          <div className='forum-post__container'>
            {this.renderPosts()}
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(props => {
  const subforumsHandle = Meteor.subscribe('subforums');
  const topicsHandle = Meteor.subscribe('topics');
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const showPostForm = Session.get('showPostForm') || false;
  const topicId = props.computedMatch.params.topicId;
  const subforumId = props.computedMatch.params.subforumId;
  const userData = Meteor.user() ? Meteor.user() : undefined;
  return {
    subforumId,
    subforumTitle: subforumsHandle.ready() && SubForums.findOne(subforumId).name,
    topic: Topics.findOne(topicId),
    posts: ForumPosts.find({topicId: topicId}, {sort: {createdAt: -1}}).fetch(),
    userData,
    showPostForm,
    isFetching: !forumPostsHandle || !topicsHandle.ready() || !subforumsHandle.ready() || !userData,
  }
}, ForumTopic)
// export default createContainer(props => {
//   const forumPostsHandle = Meteor.subscribe('forumPosts');
//   const showResponseForm = Session.get('showResponseForm') || false;
//   const postId = props.computedMatch.params.postId;
//   const userData = Meteor.user() ? Meteor.user() : undefined;
//   return {
//     post: ForumPosts.findOne(postId),
//     userData,
//     showResponseForm,
//     isFetching: !forumPostsHandle.ready() || !userData,
//   }
// }, ForumTopic)






// {/* <div className="page-content--forum-post">
//   <div className='forum__message__wrapper'>
//     <div className='forum__message--success' id='forum__message--success'>
//       <span>Response Successful!</span>
//       <i className="material-icons right" onClick={() => {
//         const postSuccessMessage = document.getElementById('forum__message--success');
//         postSuccessMessage.classList.remove('active');
//       }}>close</i>
//     </div>
//   </div>
//   <div className='forum-post'>
//     <h2 className='forum-post__heading'>{this.props.post.title}
//     </h2>
//     <div className='forum-post__subheading'>
//       {this.props.post.authorAlias ?
//         <img className='forum-post__alias' src={this.props.post.authorAlias} />
//         :
//         <span className='forum-post__alias--initial'>{this.props.post.authorFirstName.charAt(0)}</span>
//       }
//       <div>
//         <h5 className='forum-post__author'>{this.props.post.authorFirstName}
//            <span> (Patient)</span>
//         </h5>
//         <h6 className='forum-post__timestamp'>{moment(this.props.post.createdAt).format('MM/DD/YY')}</h6>
//       </div>
//     </div>
//     <div>{this.props.post.body}</div>
//     {this.props.post.authorId === Meteor.userId() ?
//       <Link to='#'>Edit</Link>
//       :
//
//       <button className='forum-post__button--respond grey lighten-2 grey-text text-darken-2 btn btn-flat'
//         onClick={() => Session.set('showResponseForm', true)}>
//         <i className="material-icons left">mode_edit</i>
//         Respond
//       </button>
//     }
//     {this.props.showResponseForm &&
//       <ForumResponseForm post={this.props.post} firstName={this.props.post.patientFirstName}/>
//     }
//     <p
//       className='forum-post__answers'>
//       {this.props.post.responses.length} {this.props.post.responses.length === 1 ? 'Answer' : 'Answers'}
//     </p>
//   </div>
//   {/* <hr /> */}
//   <div className='forum-post__response__section'>
//     {this.renderResponses()}
//   </div>
// </div> */}
