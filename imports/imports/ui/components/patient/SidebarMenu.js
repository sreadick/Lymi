import React from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import moment from 'moment';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

const SidebarLink = ({ to, children, className, errorMessage, userSymptoms, userTreatments, ...rest }) => (
  <Link
    className={className}
    to={{
      pathname: !errorMessage ? to : '',
      state: to === "/patient/checkin" ?
        {
          checkinDate: moment().format('MMMM Do YYYY'),
          symptoms: userSymptoms,
          treatments: userTreatments,
        }
        :
        undefined
      }
    }
    onClick={() => {
      if (!errorMessage) {
        Session.set('sidebarToggled', false);
      } else {
        return;
      }
    }}>
    {children}
  </Link>
)

class SidebarMenu extends React.Component {
  render() {
    return (
      <div className={`sidebar-menu__wrapper ${this.props.sidebarToggled ? "open" : "closed"}`}>
        <div className='sidebar-menu'>
          {/* <span className="sidebar-icon" onClick={() => Session.set('sidebarToggled', false)}>
            <i className="large grey remove icon"></i>
          </span> */}
          <div className="sidebar-menu__link__container">
            {this.props.links.filter(link => (this.props.viewportWidth > 768 || link.showOnMobile)).map((link) => (
              <div className="sidebar-menu__link__item" key={link.name}
                onMouseOver={() => {
                  if (link.errorMessage) {
                    this.refs[link.name + '_tooltip'].classList.add("displayed");
                  }
                }}
                onMouseOut={() => {
                  this.refs[link.name + '_tooltip'].classList.remove("displayed");
                }}>
                <SidebarLink
                  className={`sidebar-menu__link ${this.props.currentPath === link.path ? 'selected' : link.errorMessage ? 'disabled' : ''}`}
                  to={link.path}
                  userSymptoms={this.props.userSymptoms}
                  userTreatments={this.props.userTreatments}
                  errorMessage={link.errorMessage}>
                  {link.name}
                </SidebarLink>
                <span className="sidebar-menu__link__tooltip" ref={`${link.name}_tooltip`}>
                  {link.errorMessage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const collectionsAreReady = checkinHandle.ready() && treatmentsHandle.ready() && symptomsHandle.ready();
  const userSymptoms = UserSymptoms.find().fetch();
  const userTreatments = UserTreatments.find().fetch();
  const checkinHistory = CheckinHistories.findOne();
  const trackedItems = Meteor.user().profile.settings.trackedItems;

  return {
    userSymptoms,
    userTreatments,
    checkinHistory,
    viewportWidth: document.documentElement.clientWidth,
    links: [
      {
        name: "Dashboard",
        path: "/patient/dashboard",
        showOnMobile: true,
        errorMessage: (collectionsAreReady && (userSymptoms.length === 0 && (userTreatments.length === 0 && trackedItems.includes('treatments')))) ?
          <span>You need to have at least 1 <SidebarLink to="/patient/selectsymptoms">symptom</SidebarLink> and <SidebarLink to="/patient/selecttreatments">treatment</SidebarLink></span>
        : (collectionsAreReady && (userSymptoms.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/patient/selectsymptoms">symptom</SidebarLink></span>
        : (collectionsAreReady && (userTreatments.length === 0 && trackedItems.includes('treatments'))) ? <span>You need to have at least 1 <SidebarLink to="/patient/selecttreatments">treatment</SidebarLink></span>
        : undefined
      },
      {
        name: "Check in",
        path: "/patient/checkin",
        showOnMobile: true,
        errorMessage: (collectionsAreReady && (userSymptoms.length === 0 && (userTreatments.length === 0 && trackedItems.includes('treatments')))) ?
          <span>You need to have at least 1 <SidebarLink to="/patient/selectsymptoms">symptom</SidebarLink> and <SidebarLink to="/patient/selecttreatments">treatment</SidebarLink></span>
        : (collectionsAreReady && (userSymptoms.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/patient/selectsymptoms">symptom</SidebarLink></span>
        : (collectionsAreReady && (userTreatments.length === 0 && trackedItems.includes('treatments'))) ? <span>You need to have at least 1 <SidebarLink to="/patient/selecttreatments">treatment</SidebarLink></span>
        : userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0) ? "Treatments contain one or more errors"
        : undefined,
      },
      {
        name: "Symptoms",
        path: "/patient/selectsymptoms",
        showOnMobile: true,
      },
      {
        name: "Treatments",
        path: "/patient/selecttreatments",
        showOnMobile: true,
        errorMessage: !Meteor.user().profile.settings.trackedItems.includes('treatments') ?
          <span>Treatment tracking is turned off. Go to <SidebarLink to="/patient/account">settings</SidebarLink> to enable</span>
          : undefined
      },
      {
        name: "My History",
        path: "/patient/history",
        showOnMobile: false,
        errorMessage: (CheckinHistories.findOne() && checkinHistory.checkins.length === 0) ? "No history to report" : undefined
      },
      // {
      //   name: "Symptom History",
      //   path: "/patient/history/symptoms",
      //   showOnMobile: false,
      //   errorMessage: (CheckinHistories.findOne() && checkinHistory.checkins.length === 0) ? "No history to report" : undefined
      // },
      // {
      //   name: "Treatment History",
      //   path: "/patient/history/treatments",
      //   showOnMobile: false,
      //   errorMessage: (CheckinHistories.findOne() && checkinHistory.checkins.length === 0) ? "No history to report" : undefined
      // },
      {
        name: "Account",
        path: "/patient/account",
      },
      {
        name: "Lyme Share",
        path: "/forum",
        showOnMobile: false
      }
    ]
  }
}, SidebarMenu);
