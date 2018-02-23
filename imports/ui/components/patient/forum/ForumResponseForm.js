import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Loader from '/imports/ui/components/Loader';

class ForumResponseForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      responseBody: '',
    };
  }

  handleSubmit(e) {
    if (this.state.responseBody.trim().length > 0) {
      Meteor.call('forumPosts.responses.insert',
        {postId: this.props.post._id, responseBody: this.state.responseBody},
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            Session.set('showResponseForm', false)
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
      <div className="forum-post__response-form">
        <div className="forum-post__response-form__header valign-wrapper">
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
        <textarea id='responseBody' className='forum-post__response-form__body' placeholder='Write your response' value={this.state.responseBody} onChange={(e) => this.setState({responseBody: e.target.value})}>
        </textarea>
        <div className='forum-post__response-form__submit__footer'>
          {/* <Button className='black forum-post__response__submit' onClick={() => this.handleSubmit()}>Submit</Button> */}
          <span className='forum-post__response-form__submit' onClick={() => this.handleSubmit()}>Submit</span>
          <i className="forum-post__response-form__discard material-icons" onClick={() => Session.set('showResponseForm', false)}>delete</i>
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
}, ForumResponseForm)
