import React from 'react';
import { Session } from 'meteor/session';

export const SidebarToggle = () => (
  <span
    className="sidebar-icon"
    onClick={() => Session.set('toggled', !Session.get('toggled')) }>
    <i className={Session.get('toggled') === true ? "large chevron left icon" : "large sidebar icon"}></i>
  </span>
);
