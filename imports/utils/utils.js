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

export const sortSymptoms = (sortBy, symptoms, checkins) => {
  if (sortBy === 'changes') {
  //   const weeklySymptomCheckins = [[]];
  //   let startOfWeek = moment(checkins[0].date, 'MMMM Do YYYY');
  //   let numWeeks = 1;
  //   checkins.forEach(checkinGroup => {
  //     if (!moment(checkinGroup.date, 'MMMM Do YYYY').isSameOrBefore(moment(startOfWeek).add(3, 'days'))) {
  //       weeklySymptomCheckins.push([]);
  //       startOfWeek =  moment(checkinGroup.date, 'MMMM Do YYYY');
  //       numWeeks++;
  //     }
  //     weeklySymptomCheckins[numWeeks - 1].push(checkinGroup);
  //   })
  //   console.log(weeklySymptomCheckins);
  //
  //   const symptomsWithChangeAttr = symptoms.map((symptom, index) => {
  //
  //     let weeklyChangeAverages = [];
  //     weeklySymptomCheckins.forEach(checkinWeekArray => {
  //
  //       let dailyChangeScores = [];
  //       let lastSeverityScore;
  //       checkinWeekArray.forEach(checkinGroup => {
  //         if (checkinGroup.symptoms.find(checkinSymptom => checkinSymptom.name === symptom.name)) {
  //           if (lastSeverityScore) dailyChangeScores.push(Math.abs(checkinGroup.symptoms.find(checkinSymptom => checkinSymptom.name === symptom.name).severity - lastSeverityScore));
  //           lastSeverityScore = checkinGroup.symptoms.find(checkinSymptom => checkinSymptom.name === symptom.name).severity;
  //         }
  //       });
  //
  //       weeklyChangeAverages.push((dailyChangeScores.reduce((acc, currentVal) => acc + currentVal)) / dailyChangeScores.length )
  //       console.log(symptom.name);
  //       console.log(dailyChangeScores);
  //       console.log('...');
  //     });
  //   });


    let symptomsWithChangeAttr = [];
    console.log(checkins);
    symptomsWithChangeAttr = symptoms.map(symptom => {
      // const weeklyChangeAverages = [];
      let startOfWeek = moment(checkins[0].date, 'MMMM Do YYYY');
      const weeklySeverityScoreSet = [[0, 0]];
      let numWeeks = 1;
      checkins.forEach(checkin => {
        foundSymptomCheckin = checkin.symptoms.find(symptomCheckin => symptomCheckin.name === symptom.name)
        if (foundSymptomCheckin && foundSymptomCheckin.severity > 0) {

          if (!moment(checkin.date, 'MMMM Do YYYY').isBetween(moment(startOfWeek), moment(startOfWeek).add(2, 'days'), 'days', [])) {
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
      // console.log(symptom.name, weeklySeverityScoreSet);
      const weeklySeverityScores = weeklySeverityScoreSet.map(scoreSet => scoreSet[0] / scoreSet[1]);
      const biggestChangeScores = weeklySeverityScores.map((severityScore, index) => {
        if (index === 0) return 0;
        return Math.abs(severityScore - weeklySeverityScores[index - 1]);
      });
      console.log(symptom.name);
      console.log(weeklySeverityScores);
      console.log(biggestChangeScores);
      console.log('...');
      // return {
      //   averageSeverityScore: totalSeverityScore / symptomCount,
      //   lastSeverityScore,
      //   ...symptom
      // }
    });

  }


}
