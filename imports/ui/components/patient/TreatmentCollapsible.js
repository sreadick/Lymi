import React from 'react';
import moment from 'moment';
import Collapsible from 'react-collapsible';

export default class TreatmentCollapsible extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.state = {
      isOpen: false
    };
  }
  render() {
    const {treatment, takeTreatmentToday} = this.props;
    return (
      <li className="collection-item" key={treatment._id}>
        <Collapsible trigger=
          {
            <div>
              <a href="#!" className="secondary-content">
                <i className="material-icons">{this.state.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </a>
              <div className='treatment-collection-item'>
                {treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)}
                {takeTreatmentToday && <i className="amber-text material-icons">today</i>}
              </div>


              <div className=''>
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
                  // {/* <div>
                  //   {(treatment.dosingDetails.hourlyDose.hourInterval > 0 && treatment.dosingDetails.hourlyDose.quantity > 0) &&
                  //     <div className='grey-text text-darken-2'>Take {treatment.dosingDetails.hourlyDose.quantity} every {treatment.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : treatment.dosingDetails.hourlyDose.hourInterval + ' hours'}</div>
                  //   }
                  // </div> */}
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
              }
            </div>
          }
          onOpen={() => this.setState({isOpen: true})}
          onClose={() => this.setState({isOpen: false})}
        >
          <div>
            <h5 className="grey-text text-darken-2">Dates:</h5>
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
            {(treatment.otherInstructions.meals !== 'None' || treatment.otherInstructions.contraindications !== 'None' || treatment.otherInstructions.userDefined.trim()) &&
              <div>
                <h5 className="grey-text text-darken-2">Instructions:</h5>
                {Object.entries(treatment.otherInstructions).map(([instructionCategory, instructionValue]) => {
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
                })}
              </div>
            }
            {(treatment.info.type !== 'N/A' || treatment.info.category.trim() || treatment.info.usedToTreat.trim()) &&
              <div className='section'>
                <h5 className="grey-text text-darken-2">Treatment Info:</h5>
                {Object.entries(treatment.info).map(([infoCategory, infoValue]) => {
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
                })}
              </div>
            }
          </div>
        </Collapsible>
      </li>
    );
  }
};
