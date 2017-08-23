import React from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { UserSymptoms } from '../../api/user-symptoms';
import { UserTreatments } from '../../api/user-treatments';
import { CheckinHistories } from '../../api/checkin-histories';

const SidebarLink = ({ to, children, className, errorMessage, ...rest }) => (
  <Link
    className={className}
    to={!errorMessage ? to : '#'}
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
          <span className="sidebar-icon" onClick={() => Session.set('sidebarToggled', false)}>
            <i className="large grey remove icon"></i>
          </span>
          <div className="sidebar-menu__link__container">
            {this.props.links.map((link) => (
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

  return {
    userSymptoms,
    userTreatments,
    checkinHistory,
    links: [
      {
        name: "Dashboard",
        path: "/home/dashboard",
        errorMessage: (collectionsAreReady && (userSymptoms.length === 0 && userTreatments.length === 0)) ?
          <span>You need to have at least 1 <SidebarLink to="/home/selectsymptoms">symptom</SidebarLink> and <SidebarLink to="/home/selecttreatments">treatment</SidebarLink></span>
        : (collectionsAreReady && (userSymptoms.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/home/selectsymptoms">symptom</SidebarLink></span>
        : (collectionsAreReady && (userTreatments.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/home/selecttreatments">treatment</SidebarLink></span>
        : undefined
      },
      {
        name: "Check in",
        path: "/home/checkin",
        errorMessage: (collectionsAreReady && (userSymptoms.length === 0 && userTreatments.length === 0)) ?
          <span>You need to have at least 1 <SidebarLink to="/home/selectsymptoms">symptom</SidebarLink> and <SidebarLink to="/home/selecttreatments">treatment</SidebarLink></span>
        : (collectionsAreReady && (userSymptoms.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/home/selectsymptoms">symptom</SidebarLink></span>
        : (collectionsAreReady && (userTreatments.length === 0)) ? <span>You need to have at least 1 <SidebarLink to="/home/selecttreatments">treatment</SidebarLink></span>
        : userTreatments.find((treatment) => Object.keys(treatment.errors).length > 0) ? "Treatments contain one or more errors"
        : undefined
      },
      {
        name: "Symptoms",
        path: "/home/selectsymptoms"
      },
      {
        name: "Treatments",
        path: "/home/selecttreatments"
      },
      {
        name: "Symptom History",
        path: "/home/history/symptoms",
        errorMessage: (CheckinHistories.findOne() && checkinHistory.checkins.length === 0) ? "No history to report" : undefined
      }
    ]
  }
}, SidebarMenu);
