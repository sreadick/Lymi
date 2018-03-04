import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';

class ForumPostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
    };
  }

  handleSubmit(e) {
    if (this.state.body.trim().length > 0) {
      Meteor.call('forumPosts.insert', {topicId: this.props.topicId, subforumId: this.props.subforumId, body: this.state.body},
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            Session.set('showPostForm', false)
            const postSuccessMessage = document.getElementById('forum__message--success');
            postSuccessMessage.classList.add('active');
            setTimeout(() => {
              postSuccessMessage.classList.remove('active');
            }, 5000)
          }
        }
      )
    }
  }


  render() {
    if (this.props.isFetching) {
      return <Loader />
    }
    return (
      <div className="forum-post__form">
        <div className="forum-post__form__header valign-wrapper">
          {/* <img src={this.props.userData.profile.userPhoto}/> */}
          {this.props.userData.profile.userPhoto ?
            <img className='forum-post__alias' src={this.props.userData.profile.userPhoto} />
            :
            <span className='forum-post__alias--initial'>{this.props.userData.profile.firstName.charAt(0)}</span>
          }
          <div>
            <h6>{this.props.userData.profile.firstName}</h6>
          </div>
        </div>
        <textarea id='body' className='forum-post__form__body' placeholder='Write your response' value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}>
        </textarea>
        <div className='forum-post__form__submit__footer'>
          {/* <Button className='black forum-post__response__submit' onClick={() => this.handleSubmit()}>Submit</Button> */}
          <span className='forum-post__form__submit' onClick={() => this.handleSubmit()}>Submit</span>
          <i className="forum-post__form__discard material-icons" onClick={() => Session.set('showPostForm', false)}>delete</i>
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  const userData = Meteor.user() ? Meteor.user() : undefined;
  return {
    userData,
    isFetching: !userData,
  }
}, ForumPostForm)
