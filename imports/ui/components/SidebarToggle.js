import React from 'react';
import { Session } from 'meteor/session';

export const SidebarToggle = () => (
  <span
    className="sidebar-icon"
    onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
    {/* <i className={Session.get('toggled') === true ? "large chevron left icon" : "large sidebar icon"}></i> */}
    <i className='material-icons'>menu</i>
  </span>
);
