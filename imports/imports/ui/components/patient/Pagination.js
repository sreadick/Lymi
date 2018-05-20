import React from 'react';
import { Session } from 'meteor/session';


export default class Pagination extends React.Component {
  render() {
    return (
      <ul className="pagination__wrapper">
        <li className='deep-purple-text text-lighten-2 waves-effect'
          onClick={() => {
            (this.props.activeSegmentNumber === 1) ?
              Session.set('activeSegmentNumber_' + this.props.display, this.props.totalNumSegments)
              :
              Session.set('activeSegmentNumber_' + this.props.display, this.props.activeSegmentNumber - 1)
          }}>
          <i className="pagination__chevron material-icons">chevron_left</i>
        </li>
        {[...Array(this.props.totalNumSegments).keys()].map(segmentIndex => {
          const segmentNumber = segmentIndex + 1;
          return (
            <li
              key={segmentNumber}
              className={`pagination__link ${this.props.activeSegmentNumber === segmentNumber ? 'active deep-purple-text' : ''}`}
              onClick={() => Session.set('activeSegmentNumber_' + this.props.display, segmentNumber)}>
              {segmentNumber}
            </li>
          );
        })}
        <li
          className='deep-purple-text text-lighten-2 waves-effect'
          onClick={() => {
            (this.props.activeSegmentNumber === this.props.totalNumSegments) ?
              Session.set('activeSegmentNumber_' + this.props.display, 0)
              :
              Session.set('activeSegmentNumber_' + this.props.display, this.props.activeSegmentNumber + 1)
          }}>
          <i className="pagination__chevron material-icons">chevron_right</i>
        </li>
      </ul>
    );
  }
};
