import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

const TreatmentChart = (props) => {
  return (
    <div className='treatment-chart__container'>
      {props.treatments.map((treatment) =>
        <div key={treatment.name}>
          <div className='center-align'>{treatment.name}</div>
          <div className='treatment-chart__block-segment__wrapper'>
            {props.checkins.map(checkin => {
              let checkinTreatment;
              if (checkin.treatments !== null) {
                checkinTreatment = checkin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name)
              }
              // return <div key={checkin.date} className={`treatment-chart__block-segment ${checkin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name) && checkin.treatments.find(checkinTreatment => checkinTreatment.name === treatment.name).compliance }`}></div>
              return <div key={checkin.date} className={`treatment-chart__block-segment ${checkinTreatment && checkinTreatment.compliance}`}></div>
            })}
        </div>
        </div>
      )}
      <div>
        {props.checkins.map((checkin) =>
          <span className={`${checkin.treatments === null ? 'red-text' : 'black-text'} treatment-chart__date`} key={checkin.date}>{moment(checkin.date, "MMMM Do YYYY").format('MM-DD-YY')} </span>
        )}
      </div>
    </div>
  );
};

export default createContainer((props) => {
  const initialCheckInDate = moment(props.checkins[0].date, 'MMMM Do YYYY');
  const NumberDatesFromInitialCheckIn = moment().diff(initialCheckInDate, 'days') + 1;
  const dateLabels = [...Array(NumberDatesFromInitialCheckIn).keys()].map((dateOffset) =>
    moment(initialCheckInDate).add(dateOffset, "d").format('MMMM Do YYYY')
  );

  const modifiedCheckins = dateLabels.map(dateLabel => {
    const foundCheckin = props.checkins.find(checkin => checkin.date === dateLabel);
    return {
      date: dateLabel,
      treatments: foundCheckin ? foundCheckin.treatments.slice() : null
    };
  });
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
  console.log(modifiedCheckins);
  console.log(props.checkins);
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
    checkinDates: props.checkins.map(checkin => moment(checkin.date, "MMMM Do YYYY").format('MM-DD-YY')),
    checkins: modifiedCheckins
  };
}, TreatmentChart);
