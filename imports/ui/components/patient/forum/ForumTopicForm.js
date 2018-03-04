import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { Session } from 'meteor/session';

import { SubForums } from '/imports/api/forum';

class ForumTopicForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      category: props.category || '',
      subforum: props.subforum || ''
    };
  }

  handleSubmit(e) {
    Meteor.call('topics.insert', {subforum: this.state.subforum, title: this.state.title, body: this.state.body},
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          Session.set('showForumTopicForm', false)
        }
      }
    )
  }


  render() {
    if (this.props.isFetching) {
      return <div></div>
    }
    return (
      <div className="forum-topic__form__overlay">
        <div className="forum-topic__form">
          {/* <h2 className='forum-topic__form__header'>New Post</h2> */}

          {/* <Input s={8} label='Title' labelClassName='active' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}/> */}
          <label htmlFor='title'>Title</label>
          <div>
            <textarea id='title' className='forum-topic__form__textarea title' placeholder='Question/Comment' onChange={(e) => this.setState({title: e.target.value})}></textarea>
          </div>

            {/* <Input s={12} type='textarea' label='Details (optional)' onChange={(e) => this.setState({body: e.target.value})}/> */}
          <label htmlFor='body'>Details (optional)</label>
          <div>
            <textarea id='body' className='forum-topic__form__textarea body' onChange={(e) => this.setState({body: e.target.value})}></textarea>
          </div>
          {/* <Input s={4} type='select' name='category' label='category' value={this.state.category} onChange={(e) => this.setState({category: e.target.value})}>
            {this.props.categories.map(category =>
              <optgroup label='abc'>
                <option key={category} value={category}>{category}</option>
              </optgroup>
            )}
          </Input> */}
          <Input s={4} type='select' name='subforum' label='subforum' value={this.state.subforum} onChange={(e) => this.setState({subforum: e.target.value})}>
            {this.props.subforumsByCat.map(subforumGroup =>
              <optgroup key={subforumGroup.category} label={subforumGroup.category}>
                {subforumGroup.subforums.map(subforum =>
                  <option key={subforum.name} value={subforum.name}>{subforum.name}</option>
                )}
              </optgroup>
            )}
          </Input>
          <Button onClick={() => this.handleSubmit()}>Submit</Button>
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
