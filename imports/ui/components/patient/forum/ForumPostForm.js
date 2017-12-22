import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { Session } from 'meteor/session';

export class ForumPostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
    };
  }

  handleSubmit(e) {
    Meteor.call('forumPosts.insert', this.state,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          Session.set('showForumPostForm', false)
        }
      }
    )

  }


  render() {
    return (
      <div className="forum-post-form__overlay">
        <div className="forum-post-form">
          <h2 className='forum-post-form__header'>New Post</h2>

          {/* <Input s={8} label='Title' labelClassName='active' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}/> */}
          <label htmlFor='title'>Title</label>
          <div>
            <textarea id='title' className='forum-post-form__textarea title' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}></textarea>
          </div>

            {/* <Input s={12} type='textarea' label='Details (optional)' onChange={(e) => this.setState({body: e.target.value})}/> */}
          <label htmlFor='body'>Details (optional)</label>
          <div>
            <textarea id='body' className='forum-post-form__textarea body' onChange={(e) => this.setState({body: e.target.value})}></textarea>
          </div>
          <Button onClick={() => this.handleSubmit()}>Submit</Button>
        </div>
      </div>
    );
  }
};
