import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import { Session } from 'meteor/session';

class NotableEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.checkins[props.checkins.length - 1].date
    };

  }
  handleChange(e) {
    this.setState({
      // [e.target.name]: e.target.value
    });
  }

  render() {
    // if (this.props.isFetching) {
    //   return (
    //     <div className='boxed-view__modal-overlay'>
    //       <div className='boxed-view__box--doctor-search'> </div>
    //     </div>
    //   )
    // }
    return (
      <div className='notable-events'>
        <Row>
          <Input
            className=''
            label='Select Date'
            // labelClassName=''
            type='select'
            // name="dose_type"
            value={this.state.date}
            onChange={(e) => this.setState({date: e.target.value})}>
              {this.props.checkins.map(checkin =>
                <option key={checkin.date} value={checkin.date}>
                  {checkin.date}
                </option>
              )}
          </Input>
        </Row>
        <Row>
          <p>
            {this.props.checkins.find(checkin => checkin.date === this.state.date) ?
              this.props.checkins.find(checkin => checkin.date === this.state.date).notableEvents
              :
              'N/A'
            }
          </p>
        </Row>
      </div>
    );
  }
};

export default createContainer(props => {

  return {
  }
}, NotableEvents)
