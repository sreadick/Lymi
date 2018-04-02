import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

class RxInfo extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  render() {
    const {props} = this;

    return (
      <div className='pt-summary__section'>
        {/* <ScrollableAnchor id={'RxHeading'}>
          <div className='pt-summary__heading pt-summary__heading--treatments'>Treatments</div>
        </ScrollableAnchor> */}
        <div className='pt-summary__subsection'>
          <div className='pt-summary__subheading'>Rx1</div>
          <div className='pt-summary__item'>
            <span className='pt-summary__item__label'>Current Treatments</span>
            <ul className='pt-summary__item__list'>
              <li>Med1</li>
              <li>Med2</li>
              <li>Med3</li>
              <li>Med4</li>
              <li>Med5</li>
              <li>Med6</li>
              <li>Med7</li>
              <li>Med8</li>
              <li>Med9</li>
              <li>Med10</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
  return {

  };

}, RxInfo);
