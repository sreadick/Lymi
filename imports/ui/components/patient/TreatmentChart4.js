import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { capitalizePhrase, isTreatmentPrescribed, getColor, shadeColor } from '../../../utils/utils';

// const colorsArray = ['#b39ddb', '#e57373', '#90caf9', '#ffab91', '#81C784', '#A1887F', '#F06292', '#7986CB', '#E0E0E0', '#4DB6AC', '#BA68C8', '#DCE775', '#90A4AE', '#FFB74D', '#AED581', '#4FC3F7', '#FFD54F'];

export default class TreatmentChart4 extends React.Component {
  renderDates() {
    const { props } = this;
    const divide = props.checkins.length >= 60 ? 'quarter' : props.checkins.length > 30 ? 'half' : '';
    return props.checkins.map((checkin, index) => {
      if (divide === 'half') {
        if (index % 2) {
          return (
            <div key={checkin.date}>
              <div
                className={`treatment-chart__date half ${checkin.treatments === null ? 'missing' : ''}`}
                data-tip data-for={checkin.date}>
                  <span>
                    {moment(checkin.date, "MMMM Do YYYY").format('M/D/YY')}
                    {checkin.notableEvents &&
                      <sup>!</sup>
                    }
                  </span>
              </div>
              {checkin.notableEvents &&
                <ReactTooltip
                  id={checkin.date}
                  type='info'
                  place='bottom'
                  effect='solid'>
                  <div style={{maxWidth: '30rem'}}>
                    <h6>Notable Events:</h6>
                    <p>
                      {checkin.notableEvents}
                    </p>
                  </div>
                </ReactTooltip>
              }
            </div>
          );
        } else {
          return
          <div key={checkin.date}></div>
        }
      } else {
        return (
          <div key={checkin.date}>
            <div
              className={`treatment-chart__date ${checkin.treatments === null ? 'missing' : ''}`}
              data-tip data-for={checkin.date}>
                <span>
                  {moment(checkin.date, "MMMM Do YYYY").format('M/D/YY')}
                  {checkin.notableEvents &&
                    <sup>!</sup>
                  }
                </span>
            </div>
            {checkin.notableEvents &&
              <ReactTooltip
                id={checkin.date}
                type='info'
                place='bottom'
                effect='solid'>
                <div style={{maxWidth: '30rem'}}>
                  <h6>Notable Events:</h6>
                  <p>
                    {checkin.notableEvents}
                  </p>
                </div>
              </ReactTooltip>
            }
          </div>
        );
      }
    })
  }
  render() {
    const { props } = this;
    const divide = props.checkins.length >= 60 ? 'quarter' : props.checkins.length > 30 ? 'half' : '';
    return (
      <div className='treatment-chart'>
        {props.showLabels !== false &&
          <div className='treatment-chart__label__container'>
            {props.treatments.map((treatment) => {
              // let treatmentNameArr = treatment.name.split(' ');
              // if (treatmentNameArr.length === 1)  {
              //   if (treatment.name.length > 23) {
              //     treatmentNameArr[0] = treatment.name.substr(0, 20) + '...';
              //   } else {
              //     treatmentNameArr[0] = treatment.name;
              //   }
              // } else if (treatmentNameArr.length > 1)  {
              //   if (treatment.name.length < 22) {
              //     treatmentNameArr = [treatment.name];
              //   } else {
              //     treatmentNameArr[0] = treatmentNameArr.shift();
              //     treatmentNameArr[1] = treatmentNameArr.filter((name, index) => index !== 0).join(' ');
              //     if (treatmentNameArr[0].length > 23)  {
              //       treatmentNameArr = [treatment.name.substr(0, 20) + '...'];
              //     } else if (treatmentNameArr[1].length > 23) {
              //       treatmentNameArr[1] = treatmentNameArr[1].substr(0, 20) + '...';
              //     }
              //   }
              // } else {
              //   console.log('err', treatment.name);
              // }

              return (
                <div
                  key={treatment.name}
                  className={`grey-text text-darken-2 treatment-chart__label ${!props.currentTreatmentNames.includes(treatment.name) ? 'deleted' : ''} `}
                >
                  {capitalizePhrase(treatment.name)}
                  {/* {treatment.name.charAt(0).toUpperCase() + treatment.name.slice(1)} */}
                  {/* {treatment.name.substr(0, 20)} */}
                  {/* {treatmentNameArr.map((name, index) =>
                    <div key={index}>
                      {name}
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        }
        <div className={`treatment-chart__container ${props.showLabels !== false && 'rx-display'}`}>
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
                      className={`treatment-chart__block-segment ${divide} ${!checkinTreatment ? 'null' : checkinTreatment.compliance}`}
                      data-tip data-for={`${checkin.date}_${treatment.name}`}
                      style={
                        {background:
                          (!isTreatmentPrescribed(treatment, checkin.date)) ?
                            '#fff'
                          :
                          checkinTreatment ?
                            (checkinTreatment.compliance === 'NPD' || !checkinTreatment.prescribedToday) ? '#fff'
                            :
                            // checkinTreatment.compliance === 'Some' ? `repeating-linear-gradient(-55deg, ${getColor(treatmentIndex)}, ${shadeColor(getColor(treatmentIndex), 40)} 9px)`
                            checkinTreatment.compliance === 'Yes' ? 'green'
                            :
                            checkinTreatment.compliance === 'Some' ? 'yellow'
                            :
                            checkinTreatment.compliance === 'No' ? 'red'
                            :
                            'grey'
                            // getColor(treatmentIndex)
                          :
                          'grey'
                          // getColor(treatmentIndex)
                          // color: shadeColor(getColor(treatmentIndex), 70)
                      }} >
                      {(checkinTreatment && checkinTreatment.compliance !== 'NPD' && isTreatmentPrescribed(treatment, checkin.date)) &&
                        <ReactTooltip id={`${checkin.date}_${treatment.name}`} effect='float'>
                          <div
                            style={{
                              textAlign: 'left',
                              color: '#FFF'
                            }}>
                            <h6>{capitalizePhrase(treatment.name)}</h6>
                            <h6>{checkin.date}</h6>
                            <h6>Dose Taken: {(checkinTreatment && checkinTreatment.compliance) ? checkinTreatment.compliance : 'Not Specified'}</h6>
                          </div>
                        </ReactTooltip>
                      }
                      {/* {
                        checkinTreatment && (!checkinTreatment.prescribedToday || checkinTreatment.compliance === "Yes" || checkinTreatment.compliance === "Some" || checkinTreatment.compliance === "NPD") ?
                          <span></span>
                        :
                        checkinTreatment && checkinTreatment.compliance === "No" ?
                          <span>X</span>
                        :
                        ((checkinTreatment && checkinTreatment.compliance === null) || isTreatmentPrescribed(treatment, checkin.date)) ?
                          <span>?</span>
                        :
                        <span></span>
                      } */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className='treatment-chart__date__container'>
            {this.renderDates()}
            {/* {props.checkins.map((checkin, index) =>
              <div
                className={`treatment-chart__date ${divide} ${checkin.treatments === null ? 'missing' : ''}`}
                key={checkin.date}
                data-tip data-for={checkin.date}>
                {divide === 'half' ?
                  index % 2 &&
                  (
                    <span>
                      {moment(checkin.date, "MMMM Do YYYY").format('M/D/YY')}
                      {checkin.notableEvents &&
                        <sup>!</sup>
                      }
                    </span>
                  )
                :
                  <span>
                    {moment(checkin.date, "MMMM Do YYYY").format('M/D/YY')}
                    {checkin.notableEvents &&
                      <sup>!</sup>
                    }
                  </span>
                }
                {checkin.notableEvents &&
                  <ReactTooltip
                    id={checkin.date}
                    type='info'
                    place='bottom'
                    effect='solid'>
                    <div style={{maxWidth: '30rem'}}>
                      <h6>Notable Events:</h6>
                      <p>
                        {checkin.notableEvents}
                      </p>
                    </div>
                  </ReactTooltip>
                }
              </div>
            )} */}
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
          </div>
        </div>
      </div>
    );
  }
};
