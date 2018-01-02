import moment from 'moment';

export const getNextColor = (lastSymptomIndex) => {
  // const colorsArray = ['#E57373', '#4DB6AC', '#BA68C8', '#D4E157', '#69F0AE', '#FF5722', '#795548', '#607D8B', '#FF8A80', '#5C6BC0', '#8C9EFF', '#009688', '#7CB342', '#FFEB3B', '#00BCD4', '#5E35B1', '#3949AB', '#D50000', '#80CBC4', '#880E4F', '#2196F3', '#9E9D24', '#558B2F'];
  const colorsArray = ['#b39ddb', '#e57373', '#90caf9', '#ffab91', '#81C784', '#A1887F', '#F06292', '#7986CB', '#E0E0E0', '#4DB6AC', '#BA68C8', '#DCE775', '#90A4AE', '#FFB74D', '#AED581', '#4FC3F7', '#FFD54F'];
  // deep-purple red blue deep-orange  green brown pink indigo yellow, grey teal purple lime blue-grey orange light-green light-blue amber
  if (lastSymptomIndex > colorsArray.length - 1) {
    return colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }
  return colorsArray[lastSymptomIndex];
}

export const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const capitalizePhrase = (phrase) => {
  return phrase.split(/\s/).map(word => {
    if (word === 'the' || word === 'or' || word === 'at' || word === 'of' || word === 'in' || word === 'on' || word === 'to') {
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
  if (treatment.dateSelectMode === 'daily') {
    return true;
  } else if (treatment.dateSelectMode === 'from now on') {
    return treatment.daysOfWeek.includes(thisDateMoment.format('dddd'));
  } else if (treatment.dateSelectMode === 'date range') {
    return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue);
  } else if (treatment.dateSelectMode === 'individual select') {
    return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(thisDateMoment.format('MM DD YYYY'));
  }
}

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
