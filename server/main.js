import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/api/users';
import '../imports/api/user-symptoms';
import '../imports/api/user-treatments';
import '../imports/api/checkin-histories';
import '../imports/api/requests';
import '../imports/api/common-symptoms';
import '../imports/api/common-treatments';
import '../imports/api/images';

import { seedDbWithCommonSymptoms, seedDbWithCommonTreatments } from '../imports/utils/dbSeeds';

import '../imports/startup/simple-schema-configuration';

// import { SelectedSymptoms } from '../imports/api/ui'

Meteor.startup(() => {
  // seedDbWithCommonSymptoms()
});
