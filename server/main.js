import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/api/users';
import '../imports/api/user-symptoms';
import '../imports/api/user-treatments';
import '../imports/api/checkin-histories';
import '../imports/api/images';

import '../imports/startup/simple-schema-configuration';

// import { SelectedSymptoms } from '../imports/api/ui'

Meteor.startup(() => {

});
