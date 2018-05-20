import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

export default class NotableEventsTable extends React.Component {
  render() {
    return (
      <div>
        {this.props.checkins.length > 0 ?
          this.props.checkins.map(checkin =>
            <div className="section" key={checkin.date}>
              <h4>{checkin.date}</h4>
              {checkin.notableEvents &&
                <table>
                  <thead>
                    <tr>
                      <th>Events:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{checkin.notableEvents}</td>
                    </tr>
                  </tbody>
                </table>
              }
            </div>
          )
        :
          <p>No events listed</p>
        }
      </div>
    );
  }
};
