import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';

import {capitalizePhrase} from '/imports/utils/utils';

import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import PtInfoSideNav from '../PtInfoSideNav';
import NotableEvents from '../../patient/NotableEvents';

configureAnchors({offset: -120, scrollDuration: 800});

export default class EventsInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'eventSelect',
      // navLinks: ['eventSelect', 'eventTable']
    };

    this.handleScrolling = this.handleScrolling.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.selectSection = document.querySelector('#pt-summary__subsection--events--select').getBoundingClientRect().top;
    this.tableSection = document.querySelector('#pt-summary__subsection--events--table').getBoundingClientRect().top;

    this.selectLink = document.getElementById('pt-summary__navbar__link--eventSelect');
    this.tableLink = document.getElementById('pt-summary__navbar__link--eventTable');

    this.selectLink.classList.add('active');
    document.addEventListener('scroll', this.handleScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrolling);
  }

  handleScrolling() {
    this.selectLink.classList.remove('active');
    this.tableLink.classList.remove('active');

    if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
      this.tableLink.classList.add('active');
    } else {
      this.selectLink.classList.add('active');
    }
    // if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
    //   this.setState({activeLink: 'eventTable'})
    // } else {
    //   this.setState({activeLink: 'eventSelect'})
    // }
  }

  render() {
    const {props} = this;

    return (
      <div className='pt-summary__flex-wrapper'>
        <div className='pt-summary__content'>
          <div className='pt-summary__section'>
            <div className='pt-summary__subsection' id='pt-summary__subsection--events--select'>
              <ScrollableAnchor id={'heading--eventSelect'}>
                <div className='pt-summary__subheading'>Event Select</div>
              </ScrollableAnchor>
              <NotableEvents
                 checkins={props.checkins.filter(checkin => !!checkin.notableEvents)}
               />
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--events--table'>
              <ScrollableAnchor id={'heading--eventTable'}>
                <div className='pt-summary__subheading'>Table</div>
              </ScrollableAnchor>

              <table className="striped responsive-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {props.checkins.filter(checkin => !!checkin.notableEvents).map(checkin =>
                    <tr key={checkin.date} >
                      <td>
                        {checkin.date}
                        {/* {moment(checkin.date, 'MMMM Do YYYY').format('MM-DD-YY')} */}
                      </td>
                      <td>
                        {checkin.notableEvents}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>

          </div>
        </div>
        <div className='pt-summary__navbar__wrapper'>
          <PtInfoSideNav
            // activeLink={this.state.activeLink}
            // links={this.state.navLinks}
            links={[
              {
                name: 'eventSelect',
                displayedName: 'Select Date'
              },
              {
                name: 'eventTable',
                displayedName: 'All Events'
              }
            ]}
          />
        </div>
      </div>
    );
  }
}
