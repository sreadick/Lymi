import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card, Icon } from 'react-materialize';
import moment from 'moment';

const DeltaRow = ({title, initialValue, updatedValue}) => (
  <div className='zzz'>
    <div className='treatment-editor2__update-confirmation__row__title'>
      {title}
    </div>
    <Row className='treatment-editor2__update-confirmation__row valign-wrapper'>
      <Col l={4}>
        {initialValue}
      </Col>
      <Col l={4}>
        <i className="material-icons treatment-editor2__update-confirmation__arrow">trending_flat</i>
      </Col>
      <Col l={4}>
        {updatedValue}
      </Col>
    </Row>
  </div>
);

export default class TreatmentUpdateConfirmation extends React.Component {
  parseDates(treatment) {
    if (treatment.dateSelectMode === 'daily' || (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length === 7)) {
      // return <div>Every Day</div>
      return (
        <div>
          Every Day
          <div
            className='grey-text text-darken-3'> (from {moment(treatment.startDateValue).format('MMM Do YYYY')})
          </div>
        </div>
      );
    } else if (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length !== 7) {
      return (
        <div>
          {treatment.daysOfWeek.map((dayOfWeek, index, array) =>
            <span
              key={dayOfWeek}>
              {dayOfWeek}{index !== array.length - 1 ? ', ' : ''}
            </span>
          )}
          <div
            className='grey-text text-darken-3'> (from {moment(treatment.startDateValue).format('MMM Do YYYY')})
          </div>
        </div>
      );
    } else if (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length === 7) {
      return (
        <div>
          Every day
          <div
            className='grey-text text-darken-3'> (from {moment(treatment.startDateValue).format('MMM Do YYYY')} to {moment(treatment.endDateValue).format('MMM Do YYYY')})
          </div>
        </div>
      );
    } else if (treatment.dateSelectMode === 'date range' && treatment.daysOfWeek.length !== 7) {
      return (
        <div>
          {treatment.daysOfWeek.map((dayOfWeek, index, array) =>
            <span key={dayOfWeek}>
              {dayOfWeek}{index !== array.length - 1 ? ', ' : ''}
            </span>
          )}
          <div className='grey-text text-darken-3'>(from {moment(treatment.startDateValue).format('MMM Do YYYY')} to {moment(treatment.endDateValue).format('MMM Do YYYY')})</div>
        </div>
      );
    } else {
      return (
        <div>
          {treatment.individualDateValues.sort((a, b) => a - b).map(dateValue =>
            <div key={dateValue}>{moment(dateValue).format('MM-DD-YY')} </div>
          )}
        </div>
      );
    }
  }
  parseDosing(treatment) {
    if (treatment.dosingFormat === 'default') {
      return (
        <div>
          {`${treatment.amount} ${treatment.dose_type !== "pills" ? `x ${treatment.dose}${treatment.dose_type}` : treatment.amount === 1 ? "pill" : "pills"} ${treatment.frequency}/day`}
        </div>
      );
    } else if (treatment.dosingFormat === 'generalTimes') {
      return (
        <div>
          <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
          {treatment.dosingDetails.generalDoses.map(dose => {
            if (dose.quantity > 0) {
              return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} {dose.time === 'bedtime' ? 'at' : 'in the'} {dose.time}</div>
            }
          })}
        </div>
      );
    } else if (treatment.dosingFormat === 'specificTimes') {
      return (
        <div>
          <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
          {treatment.dosingDetails.specificDoses.map(dose => {
            if (dose.quantity > 0) {
              return <div className='grey-text text-darken-2' key={dose.time}>Take {dose.quantity} at {moment(dose.time).format('h:mm a')}</div>
            }
          })}
        </div>
      )
    } else if (treatment.dosingFormat === 'byHours') {
      return (
        <div>
          <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
          {(treatment.dosingDetails.recurringDose.recurringInterval > 0 && treatment.dosingDetails.recurringDose.quantity > 0) &&
            <div className='grey-text text-darken-2'>Take {treatment.dosingDetails.recurringDose.quantity} every {treatment.dosingDetails.recurringDose.recurringInterval == 1 ? treatment.dosingDetails.recurringDose.timeUnit : treatment.dosingDetails.recurringDose.recurringInterval + " " + treatment.dosingDetails.recurringDose.timeUnit + 's'}</div>
          }
        </div>
      )
    } else if (treatment.dosingFormat === 'prn') {
      return (
        <div>
          <span>{`${treatment.dose_type !== "pills" ? `${treatment.dose}${treatment.dose_type}` : ''}` }</span>
          {(treatment.dosingDetails.prnDose.hourInterval > 0 && treatment.dosingDetails.prnDose.quantity > 0) &&
            <div className='grey-text text-darken-2'>Take up to {treatment.dosingDetails.prnDose.quantity} every {treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.prnDose.hourInterval + ' hours'}</div>
          }
        </div>
      )
    } else if (treatment.dosingFormat === 'other') {
      return (
        <div>
          <div className='grey-text text-darken-2'>  {treatment.dosingDetails.other.dosingInstructions || 'Not Specified'}</div>
        </div>
      )
    } else {
      return <div>Not Specified</div>
    }
  }
  parseInstructions(treatment) {
    if (treatment.otherInstructions.meals !== 'None' || treatment.otherInstructions.contraindications !== 'None' || treatment.otherInstructions.userDefined.trim()) {
      return Object.entries(treatment.otherInstructions).map(([instructionCategory, instructionValue]) => {
        if (instructionCategory === 'meals' && instructionValue !== 'None') {
          return (
            <div key={instructionCategory}>
              <strong>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:</strong>
              <p>  {instructionValue}</p>
            </div>
          );
        } if (instructionCategory === 'contraindications' && instructionValue !== 'None') {
          return (
            <div key={instructionCategory}>
              <strong>{instructionCategory.charAt(0).toUpperCase() + instructionCategory.slice(1)}:</strong>
              <p>  {`Don't take within 3 hours of ${instructionValue}`}</p>
            </div>
          );
        } else if (instructionCategory === 'userDefined' && instructionValue.trim()) {
          return (
            <div key={instructionCategory}>
              <strong>Other:</strong>
              <p>  {instructionValue}</p>
            </div>
          );
        }
      })
    } else {
      return <span>None</span>
    }
  }
  parseInfo(treatment) {
    if (treatment.info.type !== 'N/A' || treatment.info.category.trim() || treatment.info.usedToTreat.trim()) {
      return Object.entries(treatment.info).map(([infoCategory, infoValue]) => {
        if (infoCategory === 'type' && infoValue !== 'N/A') {
          if (infoValue === 'Other') {
            return (
              <div key={infoCategory}>
                <strong>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:</strong>
                <p>  {treatment.info.typeOtherValue.trim() ? treatment.info.typeOtherValue.charAt(0).toUpperCase() + treatment.info.typeOtherValue.slice(1) : 'Other'}</p>
              </div>
            );
          } else {
            return (
              <div key={infoCategory}>
                <strong>{infoCategory.charAt(0).toUpperCase() + infoCategory.slice(1)}:</strong>
                <p>  {infoValue.trim() ? infoValue : infoCategory}</p>
              </div>
            );
          }
        } else if (infoCategory !== 'typeOtherValue' && infoValue !== 'N/A' && infoValue.trim()) {
          return (
            <div key={infoCategory}>
              <strong>{infoCategory === 'usedToTreat' ? 'Used to treat' : 'Category'}:</strong>
              <p>  {infoValue.trim() ? infoValue : infoCategory}</p>
            </div>
          );
        }
      })
    } else {
      return <span>None</span>
    }
  }

  renderDeltaList() {
    // Object.entries(this.props.deltaGroups).forEach(([groupName, deltaSet]) => {
    //   console.log(groupName);
    //   console.log(deltaSet);
    //   console.log('........');
    // })
    return Object.entries(this.props.deltaGroups).filter(group => group[1].length > 0).map(([groupName, deltaSet]) =>
      <div key={groupName}>
        {
          groupName === 'namesGroup' ?
            deltaSet[0].property === 'name' ?
              <DeltaRow title='Treatment Name' initialValue={deltaSet[0].initialValue} updatedValue={deltaSet[0].updatedValue} />
            :
            <div></div>
          :
          groupName === 'datesGroup' ?
            <DeltaRow title='Schedule' initialValue={this.parseDates(this.props.originalTreatment)} updatedValue={this.parseDates(this.props.updatedTreatmentState)} />
          :
          groupName === 'dosesGroup' ?
            <DeltaRow title='Dosing' initialValue={this.parseDosing(this.props.originalTreatment)} updatedValue={this.parseDosing(this.props.updatedTreatmentState)} />
          :
          groupName === 'instructionsGroup' ?
            <DeltaRow title='Special Instructions' initialValue={this.parseInstructions(this.props.originalTreatment)} updatedValue={this.parseInstructions(this.props.updatedTreatmentState)} />
          :
          groupName === 'informationGroup' ?
            <DeltaRow title='Rx Information' initialValue={this.parseInfo(this.props.originalTreatment)} updatedValue={this.parseInfo(this.props.updatedTreatmentState)} />
          :
          <div></div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className='treatment-editor2__overlay'>
        <div className="treatment-editor2__update-confirmation z-depth-2">
          <span className='treatment-editor2__update-confirmation__back-link' onClick={() => this.props.handleConfirmResponse('cancel')}>Back</span>
          <div className='treatment-editor2__update-confirmation__header'>Confirm Changes:</div>
          <div className='treatment-editor2__update-confirmation__table'>
            { this.renderDeltaList() }
            {/* {this.props.deltaGroups.map(data =>
              <div key={data.property}>
                <div className='treatment-editor2__update-confirmation__row__title'>
                  {data.property === 'name' ? 'Treatment Name'
                  : data.property === 'dateSelectMode' ? 'Schedule'
                  : data.property}
                </div>
                <Row className='treatment-editor2__update-confirmation__row valign-wrapper'>
                  <Col l='4'>
                    {data.initialValue}
                  </Col>
                  <Col l='4'>
                    <i className="material-icons treatment-editor2__update-confirmation__arrow">trending_flat</i>
                  </Col>
                  <Col l='4'>
                    {data.updatedValue}
                  </Col>
                </Row>
              </div>
            )} */}
          </div>
          <div className='center-align'>
            <Button className='white black-text' onClick={() => this.props.handleConfirmResponse('confirm')}>Confirm</Button>
          </div>
        </div>
      </div>
    );
  }
}
