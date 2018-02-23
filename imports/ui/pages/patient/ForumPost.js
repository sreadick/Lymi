import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Input, Button, Modal } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';
import ForumResponseForm from '/imports/ui/components/patient/forum/ForumResponseForm';

import { ForumPosts } from '../../../api/forum-posts';

class ForumPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  renderResponses() {
    return this.props.post.responses.map((response, index) => {
      return (
        <div className='forum-post__response' key={index}>
          <div className='forum-post__subheading'>
            {response.authorAlias ?
              <img className='forum-post__alias' src={response.authorAlias} />
              :
              <span className='forum-post__alias--initial'>{response.authorFirstName.charAt(0)}</span>
            }
            <div>
              <h5 className='forum-post__author'>{response.authorFirstName}
                 <span> (Patient)</span>
              </h5>
              <h6 className='forum-post__timestamp'>{moment(response.createdAt).fromNow()}</h6>
            </div>
          </div>
          <div className='forum-post__response__body'>{response.body}</div>
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
      <div className="page-content--forum-post">
        <div className='forum-post'>
          <h2 className='forum-post__heading'>{this.props.post.title}
          </h2>
          <div className='forum-post__subheading'>
            {this.props.post.authorAlias ?
              <img className='forum-post__alias' src={this.props.post.authorAlias} />
              :
              <span className='forum-post__alias--initial'>{response.authorFirstName.charAt(0)}</span>
            }
            <div>
              <h5 className='forum-post__author'>{this.props.post.authorFirstName}
                 <span> (Patient)</span>
              </h5>
              <h6 className='forum-post__timestamp'>{moment(this.props.post.createdAt).format('MM/DD/YY')}</h6>
            </div>
          </div>
          <div>{this.props.post.body}</div>
          {this.props.post.authorId === Meteor.userId() ?
            <Link to='#'>Edit</Link>
            :

            <button className='forum-post__button--respond grey lighten-2 grey-text text-darken-2 btn btn-flat'
              onClick={() => Session.set('showResponseForm', true)}>
              <i className="material-icons left">mode_edit</i>
              Respond
            </button>
          }
          {this.props.showResponseForm &&
            <ForumResponseForm post={this.props.post} firstName={this.props.post.patientFirstName}/>
          }
          <p
            className='forum-post__answers'>
            {this.props.post.responses.length} {this.props.post.responses.length === 1 ? 'Answer' : 'Answers'}
          </p>
        </div>
        {/* <hr /> */}
        <div className='forum-post__response__section'>
          {this.renderResponses()}
        </div>
      </div>
      // {/* <div className="page-content--forum-post">
      //   <div className='forum-post'>
      //     <h2 className='forum-post__heading'>{this.props.post.title}
      //     </h2>
      //     <div className='forum-post__subheading'>
      //       {this.props.post.authorAlias ?
      //         <img className='forum-post__alias' src={this.props.post.authorAlias} />
      //         :
      //         <span className='forum-post__alias--initial'>{response.authorFirstName.charAt(0)}</span>
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
      //   <hr />
      //   <div className='forum-post__response__section'>
      //     {this.renderResponses()}
      //   </div>
      // </div> */}
    );
  }
}

export default createContainer(props => {
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const showResponseForm = Session.get('showResponseForm') || false;
  const postId = props.computedMatch.params.postId;
  const userData = Meteor.user() ? Meteor.user() : undefined;
  return {
    post: ForumPosts.findOne(postId),
    userData,
    showResponseForm,
    isFetching: !forumPostsHandle.ready() || !userData,
  }
}, ForumPost)
