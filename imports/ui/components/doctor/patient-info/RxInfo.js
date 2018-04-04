import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

import TreatmentChart from '../../patient/TreatmentChart2';

import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import PtInfoSideNav from '../PtInfoSideNav';

configureAnchors({offset: -120, scrollDuration: 800});

export default class RxInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      // activeLink: 'rxList',
      // navLinks: ['rxList', 'rxChart', 'rxTable']
    };

    this.handleScrolling = this.handleScrolling.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.listSection = document.querySelector('#pt-summary__subsection--treatments--list').getBoundingClientRect().top;
    this.chartSection = document.querySelector('#pt-summary__subsection--treatments--chart').getBoundingClientRect().top;
    this.tableSection = document.querySelector('#pt-summary__subsection--treatments--table').getBoundingClientRect().top;

    this.listLink = document.getElementById('pt-summary__navbar__link--rxList');
    this.chartLink = document.getElementById('pt-summary__navbar__link--rxChart');
    this.tableLink = document.getElementById('pt-summary__navbar__link--rxTable');

    this.listLink.classList.add('active');
    document.addEventListener('scroll', this.handleScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrolling);
  }

  handleScrolling() {
    this.listLink.classList.remove('active');
    this.chartLink.classList.remove('active');
    this.tableLink.classList.remove('active');

    if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
      this.tableLink.classList.add('active');
    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.chartSection)) {
      this.chartLink.classList.add('active');
    } else {
      this.listLink.classList.add('active');
    }
    // if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
    //   this.setState({activeLink: 'rxTable'})
    // } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.chartSection)) {
    //   this.setState({activeLink: 'rxChart'})
    // } else {
    //   this.setState({activeLink: 'rxList'})
    // }
  }

  render() {
    const {props} = this;
    return (
      <div className='pt-summary__flex-wrapper'>
        <div className='pt-summary__content'>
          <div className='pt-summary__section'>
            <div className='pt-summary__subsection' id='pt-summary__subsection--treatments--list'>
              <ScrollableAnchor id={'heading--rxList'}>
                <div className='pt-summary__subheading'>Current Treatments</div>
              </ScrollableAnchor>
              <div className='pt-summary__item'>
                {/* <span className='pt-summary__item__label'>Current Treatments</span> */}
                {/* <ul className='pt-summary__item__list'>
                  <li>Med1</li>
                  <li>Med2</li>
                  <li>Med3</li>
                </ul> */}
                <table>
                  <thead>
                    <tr>
                      <th>Nmae</th>
                      <th>Schedule</th>
                      <th>Dosing</th>
                      <th>Special Instructions</th>
                      <th>Rx Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.patientTreatments.map(treatment =>
                      <tr key={treatment._id}>
                        <td>{treatment.name}</td>
                        <td>
                          {/* <div> */}
                            {(treatment.dateSelectMode === 'daily' || (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length === 7)) ?
                              <div>
                                Every Day
                                <div
                                  className='grey-text text-darken-3'> (from {moment(treatment.startDateValue).format('MMM Do YYYY')})
                                </div>
                              </div>
                              :
                              (treatment.dateSelectMode === 'from now on' && treatment.daysOfWeek.length !== 7) ?
                                <div>
                                  {treatment.daysOfWeek.map((dayOfWeek, index, array) =>
                                    <span key={dayOfWeek}>{dayOfWeek}{index !== array.length - 1 ? ', ' : ''}</span>
                                  )}
                                  <div
                                    className='grey-text text-darken-3'> (from {moment(treatment.startDateValue).format('MMM Do YYYY')})
                                  </div>
                                </div>
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
                          {/* </div> */}
                        </td>

                        <td>
                          {/* <div> */}
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
                          {/* </div> */}
                        </td>

                        <td>
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
                        </td>

                        <td>
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
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--treatments--chart'>
              <ScrollableAnchor id={'heading--rxChart'}>
                <div className='pt-summary__subheading'>Chart</div>
              </ScrollableAnchor>
              <TreatmentChart
                treatments={props.patientTreatments}
                currentTreatmentNames={props.patientTreatments.map(treatment => treatment.name)}
                checkins={props.checkins}
              />
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--treatments--table'>
              <ScrollableAnchor id={'heading--rxTable'}>
                <div className='pt-summary__subheading'>Daily Record</div>
              </ScrollableAnchor>
              {props.checkins.slice().reverse().map(checkin =>
                <div className="section" key={checkin.date}>
                  <h4>{checkin.date}</h4>
                  <table className='striped'>
                    <thead>
                      <tr>
                        <th>Treatment</th>
                        <th>Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      { checkin.treatments.length === 0 ?
                        <tr>
                          <td className="grey-text">No Treatments This Day</td>
                        </tr>
                      :
                        checkin.treatments.map(checkinTreatment =>
                          <tr key={checkinTreatment.name}>
                            <td>{checkinTreatment.name}</td>
                            <td>
                              { (checkinTreatment.prescribedToday === false || checkinTreatment.compliance === 'NPD') ? "Not Prescribed Today"
                                : checkinTreatment.compliance === null ? 'Not Specified'
                                : checkinTreatment.compliance
                              }
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
        <div className='pt-summary__navbar__wrapper'>
          <PtInfoSideNav
            // activeLink={this.state.activeLink}
            // links={this.state.navLinks}
            links={[
              {
                name: 'rxList',
                displayedName: 'Current Treatments'
              },
              {
                name: 'rxChart',
                displayedName: 'Chart'
              },
              {
                name: 'rxTable',
                displayedName: 'Daily Record'
              }
            ]}
          />
        </div>
      </div>
    );
  }
}
