import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button } from 'react-materialize';
import moment from 'moment';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

class ForumSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: props.history.location.pathname.substr(0, 13) === '/forum/search' ? props.searchText : '',
      searchBoard: props.history.location.pathname.substr(0, 13) === '/forum/search' ? props.searchBoard : props.defaultSearchBoard ? props.defaultSearchBoard : 'all'
    };
  }

  handleSubmit() {
    if (this.state.searchText.trim()) {
      this.props.history.push(`/forum/search/subforum/${this.state.searchBoard}/q/${this.state.searchText}`)
      // this.props.history.push({
      //   pathname: `/forum/search/subforum/${this.state.searchBoard}/q/${this.state.searchText}`,
      //   state: {
      //     one: 1,
      //     two: 2
      //   }
      // })
    }
  }


  render() {
    return (
      <Row className='forum-search-bar valign-wrapper'>
        <Input s={8} className='blue-grey-text text-lighten-2' value={this.state.searchText} placeholder='Search' onChange={(e) => this.setState({searchText: e.target.value})} />
        <Input s={3} type='select' value={this.state.searchBoard} onChange={(e) => this.setState({searchBoard: e.target.value})}>
          <option value='all'>All Boards</option>
          {this.props.subforums.map((subforum, index, array) =>
            <option
              key={subforum._id}
              value={subforum._id}>
              {subforum.name}
            </option>
          )}
        </Input>
        {/* <Button className={`col s1 grey ${!this.state.searchText.trim() && 'disabled'}`} onClick={() => this.handleSubmit()}><i className='material-icons'>search</i></Button> */}
        <Link
          className={`col s1 ${!this.state.searchText.trim() && 'disabled'}`}
          to={{
            pathname: `/forum/search/subforum/${this.state.searchBoard}/q/${this.state.searchText}`,
            state: {
              searchBoard: this.state.searchBoard,
              searchText: this.state.searchText,
            }
          }}>
          <Button className='grey'><i className='material-icons'>search</i></Button>
        </Link>
      </Row>
    );
  }
};

export default createContainer(props => {
  return {

  }
}, ForumSearch)
