import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const UserTreatments = new Mongo.Collection('userTreatments');

if (Meteor.isServer) {
  Meteor.publish('userTreatments', function() {
    return UserTreatments.find({ userId: this.userId });
    this.ready();
  });
  Meteor.publish('patientTreatments', function(patientId) {
    if (this.userId && Meteor.users.findOne(this.userId).account.type === 'doctor') {
      return UserTreatments.find({ userId: patientId });
    } else {
      this.ready();
    }
  });
}

Meteor.methods({
  'userTreatments.insert'(treatmentData) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    treatmentData.frequency = parseInt(treatmentData.frequency) || 0;
    treatmentData.dose = parseFloat(treatmentData.dose) || 0;
    treatmentData.amount = parseFloat(treatmentData.amount) || 0;


    new SimpleSchema({
      name: {
        type: String,
        optional: true
      },
      commonTreatmentId: {
        type: String,
        optional: true
      },
      amount: {
        type: Number,
        optional: true
      },
      dose: {
        type: Number,
        optional: true
      },
      dose_type: {
        type: String,
        optional: true
      },
      frequency: {
        type: Number,
        optional: true
      },
      dateSelectMode: {
        type: String,
        optional: true
      },
      daysOfWeek: {
        type: Array,
        optional: true
      },
      'daysOfWeek.$': {
        type: String,
        optional: true
      },
      startDateValue: {
        type: Number,
        optional: true
      },
      endDateValue: {
        type: Number,
        optional: true
      },
      individualDateValues: {
        type: Array,
        optional: true
      },
      'individualDateValues.$': {
        type: Number,
        optional: true
      },
      dosingFormat: {
        type: String,
        optional: true
      },
      dosingDetails: {
        type: Object,
        optional: true
      },
      'dosingDetails': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.generalDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses.$.time': {
        type: String,
        optional: true
      },
      'dosingDetails.generalDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.specificDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.specificDoses.$.time': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.recurringDose.recurringInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose.timeUnit': {
        type: String,
        optional: true
      },
      'dosingDetails.recurringDose.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.prnDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.prnDose.hourInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.prnDose.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.other': {
        type: Object,
        optional: true
      },
      'dosingDetails.other.dosingInstructions': {
        type: String,
        optional: true
      },
      otherInstructions: {
        type: Object,
        optional: true
      },
      'otherInstructions.meals': {
        type: String,
        optional: true
      },
      'otherInstructions.contraindications': {
        type: String,
        optional: true
      },
      'otherInstructions.userDefined': {
        type: String,
        optional: true
      },
      info: {
        type: Object,
        optional: true
      },
      'info.type': {
        type: String,
        optional: true
      },
      'info.typeOtherValue': {
        type: String,
        optional: true
      },
      'info.category': {
        type: String,
        optional: true
      },
      'info.usedToTreat': {
        type: String,
        optional: true
      },
      errors: {
        type: Object,
        optional: true,
        blackbox: true
      },
      color: {
        type: String,
        optional: true
      }
    }).validate({ ...treatmentData });

    return UserTreatments.insert({
      userId: this.userId,
      createdAt: moment().valueOf(),
      lastUpdatedAt: null,
      ...treatmentData
    });
  },

  'userTreatments.update2'(_id, treatmentData) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    treatmentData.frequency = parseInt(treatmentData.frequency) || 0;
    treatmentData.dose = parseFloat(treatmentData.dose) || 0;
    treatmentData.amount = parseFloat(treatmentData.amount) || 0;


    new SimpleSchema({
      _id: {
        type: String,
        min: 3
      },
      name: {
        type: String,
        optional: true
      },
      commonTreatmentId: {
        type: String,
        optional: true
      },
      amount: {
        type: Number,
        optional: true
      },
      dose: {
        type: Number,
        optional: true
      },
      dose_type: {
        type: String,
        optional: true
      },
      frequency: {
        type: Number,
        optional: true
      },
      dateSelectMode: {
        type: String,
        optional: true
      },
      daysOfWeek: {
        type: Array,
        optional: true
      },
      'daysOfWeek.$': {
        type: String,
        optional: true
      },
      startDateValue: {
        type: Number,
        optional: true
      },
      endDateValue: {
        type: Number,
        optional: true
      },
      individualDateValues: {
        type: Array,
        optional: true
      },
      'individualDateValues.$': {
        type: Number,
        optional: true
      },
      dosingFormat: {
        type: String,
        optional: true
      },
      dosingDetails: {
        type: Object,
        optional: true
      },
      'dosingDetails': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.generalDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses.$.time': {
        type: String,
        optional: true
      },
      'dosingDetails.generalDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.specificDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.specificDoses.$.time': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.recurringDose.recurringInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose.timeUnit': {
        type: String,
        optional: true
      },
      'dosingDetails.recurringDose.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.prnDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.prnDose.hourInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.prnDose.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.other': {
        type: Object,
        optional: true
      },
      'dosingDetails.other.dosingInstructions': {
        type: String,
        optional: true
      },
      otherInstructions: {
        type: Object,
        optional: true
      },
      'otherInstructions.meals': {
        type: String,
        optional: true
      },
      'otherInstructions.contraindications': {
        type: String,
        optional: true
      },
      'otherInstructions.userDefined': {
        type: String,
        optional: true
      },
      info: {
        type: Object,
        optional: true
      },
      'info.type': {
        type: String,
        optional: true
      },
      'info.typeOtherValue': {
        type: String,
        optional: true
      },
      'info.category': {
        type: String,
        optional: true
      },
      'info.usedToTreat': {
        type: String,
        optional: true
      },
      errors: {
        type: Object,
        optional: true,
        blackbox: true
      }
    }).validate({ _id, ...treatmentData });

    UserTreatments.update({
      _id, userId: this.userId
    }, {
      $set: {
        ...treatmentData,
        lastUpdatedAt: moment().valueOf()
      }
    });
  },


  'userTreatments.update'(_id, updates) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    if (Object.keys(updates).includes("dose")) {
      updates[Object.keys(updates)[0]] = parseFloat(updates[Object.keys(updates)[0]]) || 0;
    } else if (Object.keys(updates).includes("amount")) {
      updates[Object.keys(updates)[0]] = parseInt(updates[Object.keys(updates)[0]]) || 0;
    } else if (Object.keys(updates).includes("frequency")) {
      updates.frequency = parseInt(updates[Object.keys(updates)[0]]) || 0;
    } else if (Object.keys(updates).includes("dose_type")) {
      if (updates.dose_type === 'pills') {
        updates.dose = 0;
      }
    } else if (Object.keys(updates).includes("name") && !Object.keys(updates).includes("commonTreatmentId")) {
      updates.commonTreatmentId = '';
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      },
      name: {
        type: String,
        optional: true
      },
      amount: {
        type: Number,
        optional: true
      },
      dose: {
        type: Number,
        optional: true
      },
      dose_type: {
        type: String,
        optional: true
      },
      frequency: {
        type: Number,
        optional: true
      },
      dateSelectMode: {
        type: String,
        optional: true
      },
      daysOfWeek: {
        type: Array,
        optional: true
      },
      'daysOfWeek.$': {
        type: String,
        optional: true
      },
      startDateValue: {
        type: Number,
        optional: true
      },
      endDateValue: {
        type: Number,
        optional: true
      },
      individualDateValues: {
        type: Array,
        optional: true
      },
      'individualDateValues.$': {
        type: Number,
        optional: true
      },
      dosingFormat: {
        type: String,
        optional: true
      },
      dosingDetails: {
        type: Object,
        optional: true
      },
      'dosingDetails': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.generalDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.generalDoses.$.time': {
        type: String,
        optional: true
      },
      'dosingDetails.generalDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses': {
        type: Array,
        optional: true
      },
      'dosingDetails.specificDoses.$': {
        type: Object,
        optional: true
      },
      'dosingDetails.specificDoses.$.time': {
        type: Number,
        optional: true
      },
      'dosingDetails.specificDoses.$.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.recurringDose.recurringInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.recurringDose.timeUnit': {
        type: String,
        optional: true
      },
      'dosingDetails.recurringDose.quantity': {
        type: Number,
        optional: true
      },
      // 'dosingDetails.hourlyDose': {
      //   type: Object,
      //   optional: true
      // },
      // 'dosingDetails.hourlyDose.hourInterval': {
      //   type: Number,
      //   optional: true
      // },
      // 'dosingDetails.hourlyDose.quantity': {
      //   type: Number,
      //   optional: true
      // },
      'dosingDetails.prnDose': {
        type: Object,
        optional: true
      },
      'dosingDetails.prnDose.hourInterval': {
        type: Number,
        optional: true
      },
      'dosingDetails.prnDose.quantity': {
        type: Number,
        optional: true
      },
      'dosingDetails.other': {
        type: Object,
        optional: true
      },
      'dosingDetails.other.dosingInstructions': {
        type: String,
        optional: true
      },
      otherInstructions: {
        type: Object,
        optional: true
      },
      'otherInstructions.meals': {
        type: String,
        optional: true
      },
      'otherInstructions.contraindications': {
        type: String,
        optional: true
      },
      'otherInstructions.userDefined': {
        type: String,
        optional: true
      },
      info: {
        type: Object,
        optional: true
      },
      'info.type': {
        type: String,
        optional: true
      },
      'info.typeOtherValue': {
        type: String,
        optional: true
      },
      'info.category': {
        type: String,
        optional: true
      },
      'info.usedToTreat': {
        type: String,
        optional: true
      },
      commonTreatmentId: {
        type: String,
        optional: true
      },
      errors: {
        type: Object,
        optional: true,
        blackbox: true
      }
    }).validate({
      _id,
      ...updates
    });

    UserTreatments.update({
      _id, userId: this.userId
    }, {
      $set: {
        ...updates,
        userId: this.userId
      }
    });
  },
  'userTreatments.details.update'(_id, dose) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    if (dose.targetProperty === 'quantity') {
      dose.changedValue = parseFloat(dose.changedValue) || 0;
    }
    let targetPath;
    if (dose.index !== undefined) {
      targetPath = `dosingDetails.${dose.type}.${dose.index}.${dose.targetProperty}`;
    } else {
      targetPath = `dosingDetails.${dose.type}.${dose.targetProperty}`;
    }
    UserTreatments.update({
      _id, userId: this.userId
    }, {
      $set: {
        [targetPath]: dose.changedValue
      }
    });
  },
  'userTreatments.remove'(_id) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1
      }
    }).validate({
      _id
    });
    UserTreatments.remove({_id, userId: this.userId});
  }
});




// name: '',
// amount: 1,
// dose: 0,
// dose_type: 'mg',
// frequency: 1,
// errors: {
//   name: "needs to be at least three characters.",
//   dose: "should be a positive number"
// },
// daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
// startDateValue: undefined,
// endDateValue: undefined,
// dateSelectMode: 'daily',
// individualDateValues: [],
// dosingFormat: 'unspecified',
// createdAt: moment().valueOf(),
// dosingDetails: {
//   generalDoses: [
//     {
//       time: 'morning',
//       quantity: 0,
//     },
//     {
//       time: 'afternoon',
//       quantity: 0,
//     },
//     {
//       time: 'evening',
//       quantity: 0,
//     },
//     {
//       time: 'bedtime',
//       quantity: 0,
//     },
//   ],
//   specificDoses: [
//     {
//       time: moment().hour(0).minute(0).valueOf(),
//       quantity: 1,
//     }
//   ],
//   recurringDose: {
//     recurringInterval: 1,
//     timeUnit: 'hour',
//     quantity: 1
//   },
//   prnDose: {
//     hourInterval: 24,
//     quantity: 1
//   },
//   other: {
//     dosingInstructions: ''
//   }
// },
// otherInstructions: {
//   meals: 'None',
//   contraindications: 'None',
//   userDefined: ''
// },
// info: {
//   type: 'N/A',
//   typeOtherValue: '',
//   category: '',
//   usedToTreat: "",
// },
// commonTreatmentId: ''

//   return UserTreatments.insert({
//     name: '',
//     amount: 1,
//     dose: 0,
//     dose_type: 'mg',
//     frequency: 1,
//     errors: {
//       name: "needs to be at least three characters.",
//       dose: "should be a positive number"
//     },
//     daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//     startDateValue: undefined,
//     endDateValue: undefined,
//     dateSelectMode: 'daily',
//     individualDateValues: [],
//     dosingFormat: 'unspecified',
//     // dosingFormat: 'default',
//     createdAt: moment().valueOf(),
//     dosingDetails: {
//       generalDoses: [
//         {
//           time: 'morning',
//           quantity: 0,
//         },
//         {
//           time: 'afternoon',
//           quantity: 0,
//         },
//         {
//           time: 'evening',
//           quantity: 0,
//         },
//         {
//           time: 'bedtime',
//           quantity: 0,
//         },
//       ],
//       specificDoses: [
//         {
//           time: moment().hour(0).minute(0).valueOf(),
//           quantity: 1,
//         }
//       ],
//       recurringDose: {
//         recurringInterval: 1,
//         timeUnit: 'hour',
//         quantity: 1
//       },
//       // hourlyDose: {
//       //   hourInterval: 1,
//       //   quantity: 1
//       // },
//       prnDose: {
//         hourInterval: 24,
//         quantity: 1
//       },
//       other: {
//         dosingInstructions: ''
//       }
//     },
//     otherInstructions: {
//       meals: 'None',
//       contraindications: 'None',
//       userDefined: ''
//     },
//     info: {
//       type: 'N/A',
//       typeOtherValue: '',
//       category: '',
//       usedToTreat: "",
//     },
//     userId: this.userId,
//     commonTreatmentId: ''
//   });
// },
