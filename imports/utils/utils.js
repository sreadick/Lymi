import moment from 'moment';

import { UserSymptoms } from '/imports/api/user-symptoms';
import { UserTreatments } from '/imports/api/user-treatments';
import { CheckinHistories } from '/imports/api/checkin-histories';
import { Requests } from '/imports/api/requests';
import { ForumPosts } from '/imports/api/forum';
import { Messages } from '/imports/api/messages';


export const getNextColor = (lastSymptomIndex) => {
  // const colorsArray = ['#E57373', '#4DB6AC', '#BA68C8', '#D4E157', '#69F0AE', '#FF5722', '#795548', '#607D8B', '#FF8A80', '#5C6BC0', '#8C9EFF', '#009688', '#7CB342', '#FFEB3B', '#00BCD4', '#5E35B1', '#3949AB', '#D50000', '#80CBC4', '#880E4F', '#2196F3', '#9E9D24', '#558B2F'];
  const colorsArray = ['#b39ddb', '#e57373', '#90caf9', '#ffab91', '#81C784', '#A1887F', '#F06292', '#7986CB', '#E0E0E0', '#4DB6AC', '#BA68C8', '#DCE775', '#90A4AE', '#FFB74D', '#AED581', '#4FC3F7', '#FFD54F'];
  // deep-purple red blue deep-orange  green brown pink indigo yellow, grey teal purple lime blue-grey orange light-green light-blue amber
  if (lastSymptomIndex > colorsArray.length - 1) {
    return colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }
  return colorsArray[lastSymptomIndex];
}

export const getColor = (itemIndex) => {
  // const colorsArray = ['#0000ff', '#ff0000', '#00ff00', '#ffff00', '#7f00ff', '#00ffff', '#ff8000', '#0000ff', '#ff0000', '#00ff00', '#ffff00', '#7f00ff', '#00ffff', '#ff8000'];
  // const colorsArray = ['#0000ff', '#ff0000', '#009900', '#7f00ff', '#00ffff', '#ff8000', '#0000ff', '#ff0000', '#009900', '#7f00ff', '#00ffff', '#ff8000'];
  const colorsArray = ['#b71c1c', '#0277bd', '#2e7d32', '#ef6c00', '#3f51b5', '#00838f', '#c51162', '#795548', '#ffab00', '#689f38' ]

  if (itemIndex >= colorsArray.length) {
    return colorsArray[itemIndex % colorsArray.length]
  }
  return colorsArray[itemIndex];
}

export const shadeColor = (color, percent) => {
  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

export const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const capitalizePhrase = (phrase) => {
  return phrase.split(/\s/).map((word, index) => {
    if ((index !== 0) && (word === 'the' || word === 'or' || word === 'at' || word === 'of' || word === 'in' || word === 'on' || word === 'to' || word === 'a' || word === 'for' || word === 'as')) {
      return word
    } else {
      return capitalize(word)
    }
  }).join(' ')
}

export const filterCurrentDayTreatments = (treatments) => {
  return treatments.filter((treatment) => {
    if (treatment.dateSelectMode === 'daily') {
      return true;
    } else if (treatment.dateSelectMode === 'from now on') {
      return treatment.daysOfWeek.includes(moment().format('dddd'));
    } else if (treatment.dateSelectMode === 'date range') {
      return treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue);
    } else if (treatment.dateSelectMode === 'individual select') {
      return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'));
    }
  });
}

export const isTreatmentPrescribed = (treatment, thisDateMoment) => {
  if (typeof thisDateMoment === 'string') {
    thisDateMoment = moment(thisDateMoment, 'MMMM Do YYYY');
  }

  // if (treatment.dateSelectMode === 'date range') {
  //   return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue);
  // }
  if (moment(treatment.startDateValue).isSameOrBefore(moment(thisDateMoment), 'day')) {
    if (treatment.dateSelectMode === 'daily') {
      return true;
    } else if (treatment.dateSelectMode === 'from now on') {
      return treatment.daysOfWeek.includes(thisDateMoment.format('dddd'));
    } else if (treatment.dateSelectMode === 'date range') {
      return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue, 'day', '[]');
    } else if (treatment.dateSelectMode === 'individual select') {
      return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(thisDateMoment.format('MM DD YYYY'));
    }
  } else {
    return false;
  }
}
// export const isTreatmentPrescribed = (treatment, thisDateMoment) => {
//   if (typeof thisDateMoment === 'string') {
//     thisDateMoment = moment(thisDateMoment, 'MMMM Do YYYY');
//   }
//
//   if (treatment.dateSelectMode === 'date range') {
//     return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue);
//   }
//   if (moment(treatment.createdAt).isSameOrBefore(moment(thisDateMoment), 'day')) {
//     if (treatment.dateSelectMode === 'daily') {
//       return true;
//     } else if (treatment.dateSelectMode === 'from now on') {
//       return treatment.daysOfWeek.includes(thisDateMoment.format('dddd'));
//     } else if (treatment.dateSelectMode === 'individual select') {
//       return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(thisDateMoment.format('MM DD YYYY'));
//     }
//   } else {
//     return false;
//   }
// }
// export const isTreatmentPrescribed = (treatment, thisDateMoment) => {
//   if (typeof thisDateMoment === 'string') {
//     thisDateMoment = moment(thisDateMoment, 'MMMM Do YYYY');
//   }
//
//   if (treatment.dateSelectMode === 'daily') {
//     return true;
//   } else if (treatment.dateSelectMode === 'from now on') {
//     return treatment.daysOfWeek.includes(thisDateMoment.format('dddd'));
//   } else if (treatment.dateSelectMode === 'date range') {
//     return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue);
//   } else if (treatment.dateSelectMode === 'individual select') {
//     return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(thisDateMoment.format('MM DD YYYY'));
//   }
// }

export const sortSymptoms = (symptoms, checkins, startDate, endDate) => {
  return symptoms.map(symptom => {
    // let startOfWeek = moment(checkins[0].date, 'MMMM Do YYYY');
    let startOfWeek = moment(startDate, 'MMMM Do YYYY');
    const weeklySeverityScoreSet = [[0, 0]];
    let numWeeks = 1;
    checkins.filter(checkin => moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(startDate, 'MMMM Do YYYY'), moment(endDate, 'MMMM Do YYYY'), 'days', [])).forEach(checkin => {
      foundSymptomCheckin = checkin.symptoms.find(symptomCheckin => symptomCheckin.name === symptom.name)
      if (foundSymptomCheckin && foundSymptomCheckin.severity > 0) {
        if (!moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(startOfWeek), moment(startOfWeek).add(6, 'days'), 'days', [])) {
          startOfWeek = moment(checkin.date, 'MMMM Do YYYY');
          numWeeks++;
        }

        if (!weeklySeverityScoreSet[numWeeks - 1]) {
          weeklySeverityScoreSet[numWeeks - 1] = [foundSymptomCheckin.severity, 1]
        } else {
          weeklySeverityScoreSet[numWeeks - 1] = [weeklySeverityScoreSet[numWeeks - 1][0] + foundSymptomCheckin.severity, weeklySeverityScoreSet[numWeeks - 1][1] + 1];
        }
      }
    })
    const weeklySeverityScores = weeklySeverityScoreSet.map(scoreSet => scoreSet[0] / scoreSet[1]);
    const biggestChangeScores = weeklySeverityScores.map((severityScore, index) => {
      if (index === 0) return 0;
      return Math.abs(severityScore - weeklySeverityScores[index - 1]);
    });

    const biggestChangeScoresSum = biggestChangeScores.reduce((acc, currentVal) => (acc + currentVal));
    const biggestChangeAverage = biggestChangeScoresSum === 0 ? 0 : biggestChangeScoresSum / biggestChangeScores.length
    const severityAverage = weeklySeverityScores.reduce((acc, currentVal) => (acc + currentVal) / weeklySeverityScores.length);

    // console.log(symptom.name);
    // console.log(weeklySeverityScoreSet);
    // console.log(weeklySeverityScores);
    // console.log(severityAverage);
    // console.log(biggestChangeScores);
    return {
      ...symptom,
      biggestChangeAverage,
      severityAverage
    }
  });
    // return symptomsWithChangeAttr.sort((a, b) => b.biggestChangeAverage - a.biggestChangeAverage);
}

  // else if (sortBy === 'highest') {
  //   let symptomsWithChangeAttr = symptoms.map(symptom => {
  //     let startOfWeek = moment(checkins[0].date, 'MMMM Do YYYY');
  //     const weeklySeverityScoreSet = [[0, 0]];
  //     let numWeeks = 1;
  //     checkins.filter(checkin => moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(startDate, 'MMMM Do YYYY'), moment(endDate, 'MMMM Do YYYY'), 'days', [])).forEach(checkin => {
  //       foundSymptomCheckin = checkin.symptoms.find(symptomCheckin => symptomCheckin.name === symptom.name)
  //       if (foundSymptomCheckin && foundSymptomCheckin.severity > 0) {
  //         if (!moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(startOfWeek), moment(startOfWeek).add(6, 'days'), 'days', [])) {
  //           startOfWeek = moment(checkin.date, 'MMMM Do YYYY');
  //           numWeeks++;
  //         }
  //
  //         if (!weeklySeverityScoreSet[numWeeks - 1]) {
  //           weeklySeverityScoreSet[numWeeks - 1] = [foundSymptomCheckin.severity, 1]
  //         } else {
  //           weeklySeverityScoreSet[numWeeks - 1] = [weeklySeverityScoreSet[numWeeks - 1][0] + foundSymptomCheckin.severity, weeklySeverityScoreSet[numWeeks - 1][1] + 1];
  //         }
  //       }
  //     })
  //     const weeklySeverityScores = weeklySeverityScoreSet.map(scoreSet => scoreSet[0] / scoreSet[1]);
  //
  //     const severityAverage = weeklySeverityScores.reduce((acc, currentVal) => (acc + currentVal) / weeklySeverityScores.length);
  //     console.log(symptom.name);
  //     console.log(weeklySeverityScores);
  //     console.log(severityAverage);
  //     return {
  //       ...symptom,
  //       severityAverage
  //     }
  //   });
  //   return symptomsWithChangeAttr.sort((a, b) => b.severityAverage - a.severityAverage);
  // }
export const getTasks = () => {
  const symptomsHandle = Meteor.subscribe('userSymptoms');
  const treatmentsHandle = Meteor.subscribe('userTreatments');
  const checkinHandle = Meteor.subscribe('checkinHistories');
  const requestsHandle = Meteor.subscribe('requestsToUser');
  const forumPostsHandle = Meteor.subscribe('forumPosts');
  const messagesHandle = Meteor.subscribe('messages');

  const checkinHistory =  CheckinHistories.findOne();
  const userTreatments = UserTreatments.find().fetch();
  const userSymptoms =  UserSymptoms.find().fetch();
  const newMessages = Messages.find({viewed: false}).fetch();

  let numTasks = 0;
  const todayTreatments = filterCurrentDayTreatments(userTreatments);

  const currentDate = moment().format('MMMM Do YYYY');
  const todaysCheckin = (checkinHandle.ready() && checkinHistory) ? checkinHistory.checkins.find((checkin) => checkin.date === currentDate) : undefined;

  const trackedItems = Meteor.user().profile.settings.trackedItems;


  let dailyCheckinStatus;
  if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.every(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) && (todayTreatments.every(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))) || !trackedItems.includes('treatments')))) {
    dailyCheckinStatus = 'complete';
  } else if ((checkinHandle.ready() && todaysCheckin) && (userSymptoms.some(userSymptom => todaysCheckin.symptoms.find(checkinSymptom => (checkinSymptom.name === userSymptom.name && checkinSymptom.severity > 0))) || (todayTreatments.some(userTreatment => todaysCheckin.treatments.find(checkinTreatment => (checkinTreatment.name === userTreatment.name && checkinTreatment.compliance !== null))) || !trackedItems.includes('treatments')))) {
    dailyCheckinStatus = 'partially complete';
    numTasks++;
  } else {
    dailyCheckinStatus = 'incomplete';
    numTasks++;
  }


  const newPosts = ForumPosts.find({topicAuthorId: Meteor.userId(), viewedByTopicAuthor: false}).fetch();
  const requests = Requests.find().fetch();
  numTasks += newPosts.length + requests.length + newMessages.length;
  return {
    dailyCheckinStatus,
    requests,
    doctorIsLinked: Meteor.user().doctorId ? true : false,
    newPosts,
    newMessages,
    numTasks
  }
}

export const getCheckinComplianceData = (accountCreatedAt, checkins) => {
  const startDate = moment(accountCreatedAt).startOf('day');
  const currentDate = moment().startOf('day');
  const numDaysUsingApp = currentDate.diff(startDate, 'days') + 1;
  let daysCheckedIn = 0;
  checkins.forEach(checkin => {
    if (checkin.symptoms.some(checkinSymptom => checkinSymptom.severity > 0)) {
      daysCheckedIn++
    }
  })

  // const checkinPercentage = (typeof (daysCheckedIn / numDaysUsingApp) !== 'number') ? 0 : (daysCheckedIn / numDaysUsingApp * 100);
  // console.log(checkinPercentage);
  const roundedCheckinPercentage = (typeof (daysCheckedIn / numDaysUsingApp) !== 'number') ? 0 : (Math.round(daysCheckedIn / numDaysUsingApp * 10000) / 100);
  return {
    roundedCheckinPercentage,
    daysCheckedIn,
    daysNotCheckedIn: numDaysUsingApp - daysCheckedIn
  }
}

export const getAppointments = (userAppts) => {
  let nextAppt;
  let prevAppt;

  if (userAppts) {
    const lastApptInArray = userAppts[userAppts.length - 1];
    if (lastApptInArray && moment(lastApptInArray).isAfter(moment())) {
      nextAppt = lastApptInArray;
      if (userAppts.length > 1) {
        prevAppt = userAppts[userAppts.length - 2]
      }
    } else if (lastApptInArray && moment(lastApptInArray).isBefore(moment())) {
      prevAppt = lastApptInArray;
    }
  }

  return {
    next: nextAppt,
    last: prevAppt
  }
}

export const getExtendedTreatmentHistory = (treatments, checkins) => {
  // const treatmentsHandle = Meteor.subscribe('userTreatments');
  const newCheckinTreatments = checkins.map((checkin) => (
    {
      date: checkin.date,
      treatments: checkin.treatments.slice()
    }
  ));
  let initialDate = moment(checkins[0].date, 'MMMM Do YYYY');
  treatments.forEach(treatment => {
    if (moment(treatment.startDateValue).isBefore(moment(treatment.createdAt))) {
      if (moment(treatment.startDateValue).isBefore(initialDate)) {
        initialDate = moment(treatment.startDateValue);
      }
      const addedDays = moment(treatment.createdAt).diff(moment(treatment.startDateValue), 'days');
      for (i = addedDays - 1; i >= 0; --i) {
        const newDate = moment(treatment.startDateValue).add(i, 'days').format('MMMM Do YYYY');
        const foundCheckin = newCheckinTreatments.find(checkin => checkin.date === newDate);
        if (!foundCheckin) {
          const prescribedToday = isTreatmentPrescribed(treatment, newDate);
          newCheckinTreatments.unshift({
            date: newDate,
            treatments: [{
              name: treatment.name,
              prescribedToday,
              compliance: prescribedToday ? 'Yes' : 'NPD',
              commonTreatmentId: treatment.commonTreatmentId
            }]
          });
        } else {
          const prescribedToday = isTreatmentPrescribed(treatment, foundCheckin.date);
          foundCheckin.treatments.push({
            name: treatment.name,
            prescribedToday,
            compliance: prescribedToday ? 'Yes' : 'NPD',
            commonTreatmentId: treatment.commonTreatmentId
          });
        }
      }
    }
  });
  return newCheckinTreatments;
}

export const getExtendedSymptomHistory = (symptoms, checkins) => {

  let dateArray = [...Array(14).keys()].map(index => moment().subtract(index, 'days').format("MMMM Do YYYY")).reverse();

  if (dateArray.find(date => date === moment(Meteor.user().account.createdAt).format('MMMM Do YYYY'))) {
    dateArray = dateArray.slice(dateArray.indexOf(moment(Meteor.user().account.createdAt).format('MMMM Do YYYY')))
  }
  let modifiedSymptomCheckins = dateArray.map((date, index) => {
    const foundCheckin = checkins.find(checkin => checkin.date === date);
    return {
      date,
      symptoms: foundCheckin ? foundCheckin.symptoms : []
    }
  });

  return modifiedSymptomCheckins;
}

export const getExtendedHistory = (symptoms, treatments, checkins) => {
  let dateArray = [...Array(14).keys()].map(index => moment().subtract(index, 'days').format("MMMM Do YYYY")).reverse();
  if (dateArray.find(date => date === moment(Meteor.user().account.createdAt).format('MMMM Do YYYY'))) {
    dateArray = dateArray.slice(dateArray.indexOf(moment(Meteor.user().account.createdAt).format('MMMM Do YYYY')))
  }
  let extendedCheckins = dateArray.map((date, index) => {
    const foundCheckin = checkins.find(checkin => checkin.date === date);
    return {
      date,
      symptoms: foundCheckin ? foundCheckin.symptoms : [],
      treatments: foundCheckin ?
        foundCheckin.treatments
        :
        treatments.map(treatment => {
          return {
            name: treatment.name,
            prescribedToday: isTreatmentPrescribed(treatment, date),
            compliance: null,
            commonTreatmentId: treatment.commonTreatmentId
          }
        }),
      notableEvents: foundCheckin ? foundCheckin.notableEvents : ''
    }
  });
  return extendedCheckins;
}
