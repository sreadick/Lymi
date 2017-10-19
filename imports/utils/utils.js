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
    if (treatment.dateSelectMode === 'from now on') {
      return treatment.daysOfWeek.includes(moment().format('dddd'));
    } else if (treatment.dateSelectMode === 'date range') {
      return treatment.daysOfWeek.includes(moment().format('dddd')) && moment().isBetween(treatment.startDateValue, treatment.endDateValue);
    } else if (treatment.dateSelectMode === 'individual select') {
      return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(moment().format('MM DD YYYY'));
    }
  });
}

export const isTreatmentPrescribed = (treatment, thisDateMoment) => {
  if (treatment.dateSelectMode === 'from now on') {
    return treatment.daysOfWeek.includes(thisDateMoment.format('dddd'));
  } else if (treatment.dateSelectMode === 'date range') {
    return treatment.daysOfWeek.includes(thisDateMoment.format('dddd')) && thisDateMoment.isBetween(treatment.startDateValue, treatment.endDateValue);
  } else if (treatment.dateSelectMode === 'individual select') {
    return treatment.individualDateValues.map(dateValue => moment(dateValue).format('MM DD YYYY')).includes(thisDateMoment.format('MM DD YYYY'));
  }
}
