import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom'
import { Session } from 'meteor/session';

import { Row, Col, Input, Tabs, Tab } from 'react-materialize';
import moment from 'moment';

export const TreatmentDetailDisplay = (props) => {
  if (!props.treatment) {
    return <div className='treatment-editor treatment-editor--no-treatment-message z-depth-2'>Select a treatment or create a new one</div>
  }
  const { treatment } = props;
  return (
    <div className="treatment-detail-display z-depth-2">
      <h2 className='treatment-detail-display__item__name'>
        {treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}
      </h2>

      <div className='treatment-detail-display__item__section light-blue lighten-3'>
        <h3 className='treatment-detail-display__item__section__title'>Schedule:</h3>
        <div>
          {(treatment.dateSelectMode === 'daily' || (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length === 7)) ?
            <div>Every Day</div>
            :
            (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length !== 7) ?
            <div>{treatment.daysOfWeek.map((dayOfWeek, index, array) => <span key={dayOfWeek}>{dayOfWeek}{index !== array.length - 1 ? ', ' : ''}</span>)}</div>
            :
            (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length === 7) ?
            <div>Every day <span className='grey-text text-darken-3'>(from {moment(treatment.startDateValue).format('MMM Do YY')} to {moment(treatment.endDateValue).format('MMM Do YY')})</span></div>
            :
            (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length !== 7) ?
            <div>
              {treatment.daysOfWeek.map((dayOfWeek, index, array) => <span key={dayOfWeek}>{dayOfWeek}{index !== array.length - 1 ? ', ' : ''}</span>)}
              <div className='grey-text text-darken-3'>(from {moment(treatment.startDateValue).format('MMM Do YY')} to {moment(treatment.endDateValue).format('MMM Do YY')})</div>
            </div>
            :
            <div>{treatment.individualDateValues.sort((a, b) => a - b).map(dateValue => <div key={dateValue}>{moment(dateValue).format('MM-DD-YY')} </div>)}</div>
          }
        </div>
      </div>

      <div className='treatment-detail-display__item__section red lighten-3'>
        <h3 className='treatment-detail-display__item__section__title'>Dosing:</h3>
        { treatment.dosingFormat === 'default' ?
          <div>
            {`${treatment.amount} ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"} ${treatment.frequency}/day`}
          </div>
        : treatment.dosingFormat === 'generalTimes' ?
          <div>
            <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
            {treatment.dosingDetails.generalDoses.map(dose => {
              if (dose.quantity > 0) {
                return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} {dose.time === 'bedtime' ? 'at' : 'in the'} {dose.time}</div>
              }
            })}
          </div>
        : treatment.dosingFormat === 'specificTimes' ?
          <div>
            <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
            {treatment.dosingDetails.specificDoses.map(dose => {
              if (dose.quantity > 0) {
                return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} at {moment(dose.time).format('h:mm a')}</div>
              }
            })}
          </div>
        : treatment.dosingFormat === 'byHours' ?
          <div>
            <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
            {(treatment.dosingDetails.recurringDose.recurringInterval > 0 && treatment.dosingDetails.recurringDose.quantity > 0) &&
              <div className='grey-text text-darken-2'>Take {treatment.dosingDetails.recurringDose.quantity} every {treatment.dosingDetails.recurringDose.recurringInterval == 1 ? treatment.dosingDetails.recurringDose.timeUnit : treatment.dosingDetails.recurringDose.recurringInterval + " " + treatment.dosingDetails.recurringDose.timeUnit + 's'}</div>
            }
          </div>
        : treatment.dosingFormat === 'prn' ?
          <div>
            <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
            {(treatment.dosingDetails.prnDose.hourInterval > 0 && treatment.dosingDetails.prnDose.quantity > 0) &&
              <div className='grey-text text-darken-2'>Take up to {treatment.dosingDetails.prnDose.quantity} every {treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.prnDose.hourInterval + ' hours'}</div>
            }
          </div>
        : treatment.dosingFormat === 'other' ?
          <div>
            <div className='grey-text text-darken-2'>  {treatment.dosingDetails.other.dosingInstructions || 'Not Specified'}</div>
          </div>
        :
          <div>Not Specified</div>
        }

        {/* <div className=''>
          { treatment.dosingFormat !== 'default' ?
            `${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}`
            :
            `${treatment.amount} ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"} ${treatment.frequency}/day`
          }
        </div>

        {treatment.dosingFormat !== 'default' &&
          <div>
            {treatment.dosingFormat === 'generalTimes' &&
              <div>
                {treatment.dosingDetails.generalDoses.map(dose => {
                  if (dose.quantity > 0) {
                    return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} {dose.time === 'bedtime' ? 'at' : 'in the'} {dose.time}</div>
                  }
                })}
              </div>
            }
            {treatment.dosingFormat === 'specificTimes' &&
              <div>
                {treatment.dosingDetails.specificDoses.map(dose => {
                  if (dose.quantity > 0) {
                    return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} at {moment(dose.time).format('h:mm a')}</div>
                  }
                })}
              </div>
            }
            {treatment.dosingFormat === 'byHours' &&
              <div>
                {(treatment.dosingDetails.recurringDose.recurringInterval > 0 && treatment.dosingDetails.recurringDose.quantity > 0) &&
                  <div className='grey-text text-darken-2'>Take {treatment.dosingDetails.recurringDose.quantity} every {treatment.dosingDetails.recurringDose.recurringInterval == 1 ? treatment.dosingDetails.recurringDose.timeUnit : treatment.dosingDetails.recurringDose.recurringInterval + " " + treatment.dosingDetails.recurringDose.timeUnit + 's'}</div>
                }
              </div>
            }
            {treatment.dosingFormat === 'prn' &&
              <div>
                {(treatment.dosingDetails.prnDose.hourInterval > 0 && treatment.dosingDetails.prnDose.quantity > 0) &&
                  <div className='grey-text text-darken-2'>Take up to {treatment.dosingDetails.prnDose.quantity} every {treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.prnDose.hourInterval + ' hours'}</div>
                }
              </div>
            }
            {treatment.dosingFormat === 'other' &&
              <div>
                <div className='grey-text text-darken-2'>  {treatment.dosingDetails.other.dosingInstructions}</div>
              </div>
            }
          </div>
        } */}
      </div>

      <div className='treatment-detail-display__item__section green lighten-3'>
        <h3 className='treatment-detail-display__item__section__title'>Special Instructions:</h3>
        <div>
          {(treatment.otherInstructions.meals !== 'None' || treatment.otherInstructions.contraindications !== 'None' || treatment.otherInstructions.userDefined.trim()) ?
            Object.entries(treatment.otherInstructions).map(([instructionCategory, instructionValue]) => {
              if (instructionCategory === 'meals' && instructionValue !== 'None') {
                return (
                  <div key={instructionCategory}>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:
                    <pre>  {instructionValue}</pre>
                  </div>
                );
              } if (instructionCategory === 'contraindications' && instructionValue !== 'None') {
                return (
                  <div key={instructionCategory}>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:
                    <pre>  {`Don't take within 3 hours of ${instructionValue}`}</pre>
                  </div>
                );
              } else if (instructionCategory === 'userDefined' && instructionValue.trim()) {
                return (
                  <div key={instructionCategory}>Other:
                    <pre>  {instructionValue}</pre>
                  </div>
                );
              }
            })
          :
            <span>None</span>
          }
        </div>
      </div>

      <div className='treatment-detail-display__item__section deep-purple lighten-3'>
        <h3 className='treatment-detail-display__item__section__title'>Rx Info:</h3>
        <div>
          {(treatment.info.type !== 'N/A' || treatment.info.category.trim() || treatment.info.usedToTreat.trim()) ?
            Object.entries(treatment.info).map(([infoCategory, infoValue]) => {
              if (infoCategory === 'type' && infoValue !== 'N/A') {
                if (infoValue === 'Other') {
                  return (
                    <div key={infoCategory}>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:
                      <pre>  {treatment.info.typeOtherValue.trim() ? treatment.info.typeOtherValue.charAt(0).toUpperCase() + treatment.info.typeOtherValue.slice(1) : 'Other'}</pre>
                    </div>
                  );
                } else {
                  return (
                    <div key={infoCategory}>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:
                      <pre>  {infoValue.trim() ? infoValue : infoCategory}</pre>
                    </div>
                  );
                }
              } else if (infoCategory !== 'typeOtherValue' && infoValue !== 'N/A' && infoValue.trim()) {
                return (
                  <div key={infoCategory}>{infoCategory === 'usedToTreat' ? 'Used to treat' : 'Category'}:
                    <pre>  {infoValue.trim() ? infoValue : infoCategory}</pre>
                  </div>
                );
              }
            })
          :
            <span>None</span>
          }
        </div>
      </div>
    </div>
  );
}
