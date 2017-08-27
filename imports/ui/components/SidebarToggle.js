import React from 'react';
import { Session } from 'meteor/session';

export const SidebarToggle = () => (
  <span
    className="sidebar-icon"
    onClick={() => Session.set('sidebarToggled', !Session.get('sidebarToggled')) }>
    <i className='material-icons'>{Session.get('sidebarToggled') === true ? "clear" : "menu"}</i>
  </span>
);
