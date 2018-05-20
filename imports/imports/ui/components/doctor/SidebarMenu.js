import React from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import moment from 'moment';

import { UserSymptoms } from '../../../api/user-symptoms';
import { UserTreatments } from '../../../api/user-treatments';
import { CheckinHistories } from '../../../api/checkin-histories';

const SidebarLink = ({ to, children, className, ...rest }) => (
  <Link
    className={className}
    to={to}
    onClick={() => Session.set('sidebarToggled', false)}>
    {children}
  </Link>
)

class SidebarMenu extends React.Component {
  render() {
    return (
      <div className={`sidebar-menu__wrapper ${this.props.sidebarToggled ? "open" : "closed"}`}>
        <div className='sidebar-menu'>
          <div className="sidebar-menu__link__container">
            {this.props.links.map(link =>
              <div className="sidebar-menu__link__item" key={link.name}>
                <SidebarLink
                  className={`sidebar-menu__link ${this.props.currentPath === link.path ? 'selected' : ''}`}
                  to={link.path}>
                  {link.name}
                </SidebarLink>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  return {
    links: [
      {
        name: "Home",
        path: "/doctor/home"
      },
      {
        name: "Add Patients",
        path: "/doctor/addpatients"
      },
      {
        name: "Profile",
        path: "/doctor/profile"
      },
      {
        name: "Lyme Share",
        path: "/forum",
      }
    ]
  }
}, SidebarMenu);
