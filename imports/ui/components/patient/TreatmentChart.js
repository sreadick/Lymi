import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { isTreatmentPrescribed, getColor} from '../../../utils/utils';

import { UserTreatments } from '../../../api/user-treatments';

// const colorsArray = ['#b39ddb', '#e57373', '#90caf9', '#ffab91', '#81C784', '#A1887F', '#F06292', '#7986CB', '#E0E0E0', '#4DB6AC', '#BA68C8', '#DCE775', '#90A4AE', '#FFB74D', '#AED581', '#4FC3F7', '#FFD54F'];

const TreatmentChart = (props) => {
  return (
    <div className='treatment-chart'>
      <div className='treatment-chart__label__container'>
        {props.treatments.map((treatment) =>
          <div
            key={treatment.name}
            className={`grey-text text-darken-2 treatment-chart__label ${!props.currentTreatmentNames.includes(treatment.name) ? 'deleted' : ''} `}
          >
            {treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}
          </div>
        )}
      </div>
      <div className='treatment-chart__container'>
        <div className='treatment-chart__item__container z-depth-3'>
          {props.treatments.map((treatment, treatmentIndex) =>
            <div key={treatment.name} className='treatment-chart__item'>
              {props.checkins.map((checkin) => {
                let checkinTreatment;
                if (checkin.treatments !== null) {
                  checkinTreatment = checkin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name)
                }
                return (
                  <div
                    key={checkin.date}
                    className={`treatment-chart__block-segment ${!checkinTreatment ? 'null' : checkinTreatment.compliance}`}
                    style={{background:
                      (!isTreatmentPrescribed(treatment, checkin.date)) ?
                        // treatment.color
                        '#fff'
                      :
                      checkinTreatment ?
                        (checkinTreatment.compliance === 'NPD' || !checkinTreatment.prescribedToday) ? '#fff'
                        :
                        // checkinTreatment.compliance === 'Some' ? `repeating-linear-gradient(-55deg, ${treatment.color}, ${treatment.color} 3px, #f5f5f5 6px, #f5f5f5 9px)`
                        checkinTreatment.compliance === 'Some' ? `repeating-linear-gradient(-55deg, ${getColor(treatmentIndex)}, ${getColor(treatmentIndex)} 3px, #333 6px)`
                        :
                        getColor(treatmentIndex)
                        // (checkinTreatment.compliance === 'Yes' || checkinTreatment.compliance === 'No' || checkinTreatment.compliance === 'NPD') ? treatment.color

                        // checkinTreatment.compliance === 'No' ? 'red' :
                      :
                      getColor(treatmentIndex)
                      // treatment.color
                      // '#fff'
                    }} >
                    {
                      checkinTreatment && (!checkinTreatment.prescribedToday || checkinTreatment.compliance === "Yes" || checkinTreatment.compliance === "Some" || checkinTreatment.compliance === "NPD") ?
                        <span></span>
                      :
                      checkinTreatment && checkinTreatment.compliance === "No" ?
                        <span>X</span>
                      :
                      // !checkinTreatment || checkinTreatment.compliance === null ?
                      ((checkinTreatment && checkinTreatment.compliance === null) || isTreatmentPrescribed(treatment, checkin.date)) ?
                        <span>?</span>
                      :
                      <span></span>
                    }
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className='treatment-chart__date__container'>
          {props.checkins.map((checkin) =>
            <div className={`treatment-chart__date ${checkin.treatments === null ? 'missing' : ''}`} key={checkin.date}>{moment(checkin.date, "MMMM Do YYYY").format('M/D/YY')} </div>
          )}
        </div>
      </div>
      <div className='treatment-chart__legend__wrapper'>
        <div className='treatment-chart__legend'>
          <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block yes'></div>
            <span>
              All doses taken
            </span>
          </div>
          <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block some'></div>
            <span>
              Some doses taken
            </span>
          </div>
          <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block no'>
              <span>X</span>
            </div>
            <span>
              No doses taken
            </span>
          </div>
          <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block missing'>
              <span>?</span>
            </div>
            <span>
              Not Specified
            </span>
          </div>
          <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block NPD'></div>
            <span>
              Not Prescribed
            </span>
          </div>
          {/* <div className='treatment-chart__legend__item'>
            <div className='treatment-chart__legend__item__block checkin-missing'>x/x/xx</div>
            <span>
              Check-In Missing
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default createContainer((props) => {
  const treatmentsHandle = Meteor.subscribe('userTreatments');

  // const initialCheckInDate = moment(props.checkins[0].date, 'MMMM Do YYYY');

  const newCheckinTreatments = props.checkins.map((checkin) => (
    {
      date: checkin.date,
      treatments: checkin.treatments.slice()
    }
  ));
  let initialDate = moment(props.checkins[0].date, 'MMMM Do YYYY');
  props.treatments.forEach(treatment => {
    // if (treatment.dateSelectMode === "date range" && moment(treatment.startDateValue).isBefore(moment(treatment.createdAt))) {
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
          // newCheckinTreatments.find(checkin => checkin.date === newDate).treatments.push({
            name: treatment.name,
            prescribedToday,
            compliance: prescribedToday ? 'Yes' : 'NPD',
            commonTreatmentId: treatment.commonTreatmentId
          });
        }
      }
    }
  });
  console.log(newCheckinTreatments);

  // const NumberDatesFromInitialCheckIn = moment().diff(initialDate, 'days') + 1;
  // const dateLabels = [...Array(NumberDatesFromInitialCheckIn).keys()].map((dateOffset) =>
  //   moment(initialDate).add(dateOffset, "d").format('MMMM Do YYYY')
  // );
  // const NumberDatesFromInitialCheckIn = moment().diff(initialCheckInDate, 'days') + 1;
  // const dateLabels = [...Array(NumberDatesFromInitialCheckIn).keys()].map((dateOffset) =>
  //   moment(initialCheckInDate).add(dateOffset, "d").format('MMMM Do YYYY')
  // );

  // const modifiedCheckins = dateLabels.map(dateLabel => {
  //   const foundCheckin = props.checkins.find(checkin => checkin.date === dateLabel);
  //   return {
  //     date: dateLabel,
  //     treatments: foundCheckin ? foundCheckin.treatments.slice() : null
  //   };
  // });
  // const modifiedCheckins = dateLabels.map(dateLabel => {
  //   return {
  //     date: dateLabel,
  //     treatments: props.treatments.map(treatment => {
  //       if (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.includes(moment(dateLabel, "MMMM Do YYYY").format('dddd')) && moment(dateLabel, "MMMM Do YYYY").isBetween(treatment.startDateValue, treatment.endDateValue)) {
  //         const targetCheckin = props.checkins.find(checkin => checkin.date === dateLabel);
  //         const targetCheckinTreatment = targetCheckin && targetCheckin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name);
  //         return {
  //           name: treatment.name,
  //           compliance: (!targetCheckin || (targetCheckinTreatment && targetCheckinTreatment.compliance === null)) ? "Check in missing" : targetCheckinTreatment.compliance
  //         };
  //       } else if (treatment.dateSelectMode === 'individual select' && treatment.individualDateValues.map(dateValue => moment(dateValue).format('MMMM Do YYYY')).includes(dateLabel)) {
  //         const targetCheckin = props.checkins.find(checkin => checkin.date === dateLabel);
  //         const targetCheckinTreatment = targetCheckin && targetCheckin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name);
  //         return {
  //           name: treatment.name,
  //           compliance: (!targetCheckin || (targetCheckinTreatment && targetCheckinTreatment.compliance === null)) ? "Check in missing" : targetCheckinTreatment.compliance
  //         };
  //       // } else if (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(dateLabel, "MMMM Do YYYY").format('dddd')) && moment(dateLabel, "MMMM Do YYYY").isAfter(treatment.createdAt)) {
  //       } else if (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.includes(moment(dateLabel, "MMMM Do YYYY").format('dddd'))) {
  //         const initalTreatmentCheckIn = props.checkins.find(checkin => checkin.treatments.map(checkinTreatment => checkinTreatment.name).includes(treatment.name));
  //         if (initalTreatmentCheckIn && moment(dateLabel, "MMMM Do YYYY").isSameOrAfter(initalTreatmentCheckIn.date, 'day')) {
  //           const targetCheckin = props.checkins.find(checkin => checkin.date === dateLabel);
  //           const targetCheckinTreatment = targetCheckin && targetCheckin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name);
  //           return {
  //             name: treatment.name,
  //             compliance: (!targetCheckin || (targetCheckinTreatment && targetCheckinTreatment.compliance === null)) ? "Missing" : targetCheckinTreatment.compliance
  //           };
  //         } else {
  //           return {
  //             name: treatment.name,
  //             compliance: 'NPD'
  //           };
  //         }
  //       } else {
  //         return {
  //           name: treatment.name,
  //           compliance: 'NPD'
  //         };
  //       }
  //     })
  //   }
  // });
  // dateLabels.forEach(dateLabel => {
  //   if (treatment.dateSelectMode === 'date range' && moment(dateLabel, "MMMM Do YYYY").isBetween(treatment.startDateValue, treatment.endDateValue)) {
  //     const targetCheckin = props.checkins.find(checkin => (checkin.date === dateLabel));
  //     const targetCheckinTreatment = targetCheckin && targetCheckin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name);
  //
  //     if (!targetCheckin || (targetCheckinTreatment && targetCheckinTreatment.compliance === null))
  //   }
  // })
  return {
    treatments: props.treatments,
    // checkinDates: props.checkins.map(checkin => moment(checkin.date, "MMMM Do YYYY").format('MM-DD-YY')),
    // checkins: modifiedCheckins,
    checkins: newCheckinTreatments,
    currentTreatmentNames: UserTreatments.find().fetch().map(treatment => treatment.name),
  };
}, TreatmentChart);
