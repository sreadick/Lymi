import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import NotableEvents from '../NotableEvents';

export default class NotableEventsSelect extends React.Component {
  render() {
    const notableEventCheckins = this.props.checkins.filter(checkin => !!checkin.notableEvents);
    return (
      <div>
        {notableEventCheckins.length > 0 ?
          <div className='card'>
            <NotableEvents
              checkins={notableEventCheckins}
             />
          </div>
        :
          <p>No Events Available</p>
        }
      </div>
    );
  }
};
