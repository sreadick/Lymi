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
// import '../imports/api/forum-posts';
import '../imports/api/forum';
import '../imports/api/messages';

import { seedDbWithCommonSymptoms, seedDbWithCommonTreatments, seedDbWithSubforums } from '../imports/utils/dbSeeds';

import '../imports/startup/simple-schema-configuration';
import '../imports/startup/slingshot-configuration';


// import { SelectedSymptoms } from '../imports/api/ui'

Meteor.startup(() => {
  // seedDbWithCommonTreatments()
  // seedDbWithCommonSymptoms()
  // seedDbWithSubforums()
  process.env.MAIL_URL = "smtp://postmaster%40sandbox9ab28225eaba4745b15b716bf5211994.mailgun.org:dc95afc35e43b77429dd082b6d48019f@smtp.mailgun.org:587";
});
