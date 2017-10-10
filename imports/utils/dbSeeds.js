import { commonSymptomsList } from '../public/resources/commonSymptomsList';
import { commonTreatmentsList } from '../public/resources/commonTreatmentsList';
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
