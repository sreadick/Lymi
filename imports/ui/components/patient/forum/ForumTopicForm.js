import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { Session } from 'meteor/session';
import { Redirect } from 'react-router-dom'

import { SubForums } from '/imports/api/forum';
import { capitalizePhrase } from '/imports/utils/utils';

class ForumTopicForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      subforumId: props.subforumId || '',
      category: props.category || '',
      errors: {
        titleMessage: '',
        bodyMessage: '',
        subforumMessage: ''
      },
      submitSuccess: false
    };
  }

  handleSubmit(e) {
    const title = this.state.title.trim();
    const body = this.state.body.trim();
    const subforumId = this.state.subforumId;
    // console.log(subforumId);
    const subforumName = SubForums.findOne(subforumId);
    const errors = {};
    if (!title) {
      errors.titleMessage = 'Field is required.';
    }
    if (title.length > 140) {
      errors.titleMessage = 'Title must be less than 140 characters.';
    }
    if (!body) {
      errors.bodyMessage = 'Field is required.';
    }
    if (body.length > 2000) {
      errors.bodyMessage = 'Please shorten your message.';
    }
    if (!subforumName) {
      errors.subforumMessage = 'Please select a board/subforum.';
    }
    // console.log(subforum);
    if (Object.keys(errors).length > 0) {
      this.setState({errors})
    } else {
      topicId = Meteor.call('topics.insert', {subforumId, title: capitalizePhrase(title), body},
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            Session.set({
              'newTopicId': res,
              'showForumTopicForm': false
            });
            this.setState({submitSuccess: true});
          }
        }
      )
    }
  }


  render() {
    if (this.props.isFetching) {
      return <div></div>
    } else if (this.state.submitSuccess) {
      return <Redirect to={`/patient/forum/subforum/${this.state.subforumId}/topic/${Session.get('newTopicId')}`} />
    }
    return (
      <div className="forum-topic__form__overlay">
        <div className="forum-topic__form">
          <div className='forum-topic__form__close-icon__wrapper'>
            <i className='forum-topic__form__close-icon material-icons' onClick={() => Session.set('showForumTopicForm', false)}>close</i>
          </div>
          <div className="forum-topic__form__flex-wrapper">
            <div className="forum-topic__form__header">
              <h3>New Topic</h3>
              <Input className='forum-topic__form__input--title' name='title' label='Title' value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} />
              {this.state.errors.titleMessage && <p className='forum__message--error--topic-form'>{this.state.errors.titleMessage}</p>}
            </div>
            {/* <Input s={8} label='Title' labelClassName='active' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}/> */}
            {/* <Row> */}

            {/* <label htmlFor='title'>Title</label>
            <div>
              <textarea id='title' className='forum-topic__form__textarea title' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}></textarea>
            </div> */}
            {/* </Row> */}

              {/* <Input s={12} type='textarea' label='Details (optional)' onChange={(e) => this.setState({body: e.target.value})}/> */}
            <div className='forum-topic__form__textarea-body'>
              <label htmlFor='body'>Body</label>
              {/* <div> */}
              <textarea id='body' onChange={(e) => this.setState({body: e.target.value})}></textarea>
              {/* </div> */}
            </div>
            {this.state.errors.bodyMessage && <p className='forum__message--error--topic-form'>{this.state.errors.bodyMessage}</p>}
            {/* <Input className='forum-topic__form__dropdown' type='textarea' label='Body' name='body' value={this.state.body} onChange={(e) => this.setState({body: e.target.value})} /> */}
            {/* <Row> */}
              <Input className='forum-topic__form__dropdown' type='select' name='subforum' value={this.state.subforumId} onChange={(e) => this.setState({subforumId: e.target.value})}>
                <option value="" disabled>Select a Board</option>
                {this.props.subforumsByCat.map(subforumGroup =>
                  <optgroup key={subforumGroup.category} label={subforumGroup.category}>
                    {subforumGroup.subforums.map(subforum =>
                      <option key={subforum._id} value={subforum._id}>{subforum.name}</option>
                    )}
                  </optgroup>
                )}
              </Input>
              {this.state.errors.subforumMessage && <p className='forum__message--error--topic-form'>{this.state.errors.subforumMessage}</p>}

            {/* </Row> */}
            <button className='forum-topic__form__submit-button grey lighten-1 btn btn-flat' onClick={() => this.handleSubmit()}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
};


export default createContainer(props => {
  const subforumsHandle = Meteor.subscribe('subforums');
  const subforums = SubForums.find().fetch();
  const categories = [];
  let subforumsByCat;
  if (subforumsHandle.ready()) {
    subforums.forEach(subforum => {
      if (!categories.includes(subforum.category)) {
        categories.push(subforum.category)
      }
    });
    subforumsByCat = categories.map((category) => {
      return {
        category,
        subforums: SubForums.find({category: category}).fetch()
      }
    });
  }
  return {
    subforums,
    categories,
    subforumsByCat,
    isFetching: !subforumsHandle.ready() || !subforumsByCat
  }
}, ForumTopicForm)
