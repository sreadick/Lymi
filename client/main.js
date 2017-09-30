import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDom from 'react-dom';
import { Tracker } from 'meteor/tracker';
// import { Session } from 'meteor/session';

import App from '../imports/ui/layouts/App';
import '../imports/startup/simple-schema-configuration';

import { SelectedSymptoms } from '../imports/api/ui';

Meteor.startup(() => {
  ReactDom.render(<App/>, document.getElementById('app'));
});
