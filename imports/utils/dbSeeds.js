import { commonSymptomsList } from '../public/resources/commonSymptomsList';
import { commonTreatmentsList } from '../public/resources/commonTreatmentsList';
import { subforums } from '../public/resources/subforums';
import { Meteor } from 'meteor/meteor';

export const seedDbWithCommonSymptoms = () => {
  Meteor.call('commonSymptoms.removeAll')
  commonSymptomsList.forEach(symptom => {
    Meteor.call('commonSymptoms.insert', {
      ...symptom,
      name: symptom.name.toLowerCase().trim()
    });
  });
}

export const seedDbWithCommonTreatments = () => {
  Meteor.call('commonTreatments.removeAll');
  commonTreatmentsList.forEach(treatment => {
    Meteor.call('commonTreatments.insert', treatment)
  });
}

export const seedDbWithSubforums = () => {
  // Meteor.call('commonTreatments.removeAll');
  subforums.forEach(subforum => {
    Meteor.call('subforums.insert', subforum)
  });
}
