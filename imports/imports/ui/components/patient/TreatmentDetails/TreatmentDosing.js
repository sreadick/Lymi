import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Row, Col, Input, Button, Card } from 'react-materialize';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const RxQuantityInput = ({props, col}) => (
  <div className={`input-field ${col}`}>
    <input
      type="number"
      id="amount"
      name="amount"
      value={props.treatment.amount}
      min="1"
      onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})} />
    <label className='active' htmlFor='amount'>Amount</label>
    <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.amount : ''}</div>
  </div>
)

const RxDoseInput = ({props, col}) => (
  <div className={`input-field ${col}`}>
    <input
      type="number"
      id="dose"
      name="dose"
      value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose}
      min="0"
      step="25"
      onChange={(e) => {
        if (props.treatment.dose_type !== 'pills') {
          props.handleDosingChange({attr: e.target.name, value: e.target.value})
        }
      }} />
    <label className='active' htmlFor='dose'>Dose</label>
    <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
  </div>
)

const RxFrequencyInput = ({props, col}) => (
  <div className={`input-field ${col}`}>
    <input
      type="number"
      name="frequency"
      value={props.treatment.frequency}
      min="1"
      onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})} />
    <label className='active' htmlFor='frequency'>Times Per Day</label>
    <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.frequency : ''}</div>
  </div>
)

const RxDoseTypeDropdown = ({props, col, offset = 's0'}) => (
  <Col s={col} offset={offset}>
    <Input
      className=''
      label='unit'
      labelClassName=''
      type='select'
      name="dose_type"
      value={props.treatment.dose_type}
      onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})}>
        <option value="mg">mg</option>
        <option value="mgc">mgc</option>
        <option value="gm">gm</option>
        <option value="iu">IU</option>
        <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
        <option value="tablets">tablets</option>
        <option value="capsule">capsule</option>
        <option value="tsp">tsp</option>
        <option value="tbsp">tbsp</option>
        <option value="drops">drops</option>
        <option value="oz">oz</option>
        <option value="ml">mL</option>
        <option value="pounds">pounds</option>
        <option value="voltage">voltage</option>
        <option value="watts">watts</option>
        <option value="puff">puff</option>
        <option value="minutes">minutes</option>
    </Input>
  </Col>
)

export default TreatmentDosing = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div>
      <Row>
        <Col s={4} offset='s1'>
          <Input
            type='select'
            className='white dropdown--label-margin'
            name='dosingFormat'
            label="Dosing Format"
            labelClassName='white-text'
            value={props.treatment.dosingFormat}
            onChange={(e) => props.handleDosingChange({attr: 'dosingFormat', value: e.target.value})}>
              <option value='default'> Basic</option>
              <option value='generalTimes'> Daily Times</option>
              <option value='specificTimes'> Specific Times</option>
              <option value='byHours'> Every x Hours/Days/Weeks</option>
              <option value='prn'> PRN (as neeeded)</option>
              <option value='other'> Custom</option>
          </Input>
        </Col>
      </Row>

      { props.treatment.dosingFormat === 'default' ?
        <Row className='z-depth-4 rx-detail-form'>
          <RxQuantityInput
            props={props}
            col={props.treatment.dose_type === 'pills' ? 'col l2 offset-l2' : 'col l1 offset-l2'}/>
          {/* <div className={`input-field ${props.treatment.dose_type === 'pills' ? 'col l2 offset-l3' : 'col l1 offset-l3'}`}>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              value={props.treatment.amount}
              disabled={props.treatment.dosingFormat !== 'default' && props.treatment.dosingFormat !== 'other'}
              // onChange={props.handleChange}/>
              onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})} />
            <label className='active' htmlFor='amount'>Amount</label>
            <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.amount : ''}</div>
          </div> */}

          {props.treatment.dose_type !== 'pills' &&
            <RxDoseInput
              props={props}
              col='col l2'/>

            // <div className="input-field col l2">
            //   <input
            //     className={`ui ${props.treatment.dose_type === 'pills' && 'disabled'} input`}
            //     type="number"
            //     id="dose"
            //     name="dose"
            //     value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose}
            //     min="0"
            //     step="25"
            //     onChange={(e) => {
            //       if (props.treatment.dose_type !== 'pills') {
            //         props.handleDosingChange({attr: e.target.name, value: e.target.value})
            //       }
            //     }}
            //   />
            //   <label className='active' htmlFor='dose'>Dose</label>
            //   <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
            // </div>
          }

          <RxDoseTypeDropdown
            props={props}
            col={props.treatment.dose_type !== 'pills' ? 2 : 3} />
          {/* <Input
            s={props.treatment.dose_type !== 'pills' ? 1 : 2}
            type='select'
            name="dose_type" value={props.treatment.dose_type}
            onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})}>
              <option value="mg">mg</option>
              <option value="iu">iu</option>
              <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
          </Input> */}

          <RxFrequencyInput
            props={props}
            col='col l2'/>
          {/* <div className="input-field col l2">
            <input
              type="number"
              name="frequency"
              value={props.treatment.frequency}
              min="1"
              onChange={(e) => props.handleDosingChange({attr: e.target.name, value: e.target.value})} />
            <label className='active' htmlFor='frequency'>Times Per Day</label>
            <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.frequency : ''}</div>
          </div> */}
        </Row>
        :
        props.treatment.dosingFormat === 'generalTimes' ?
        <Row className='rx-detail-form'>
          <Row>
            {props.treatment.dose_type !== 'pills' &&
            <RxDoseInput
              props={props}
              col='col l2 offset-l3'/>
              // <Col l={2} offset='l4'>
              //   <div className="input-field">
              //     <input className={`ui ${props.treatment.dose_type === 'pills' && 'disabled'} input`}
              //       type="number" id="dose" name="dose" value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose} min="0" step="25"
              //       onChange={(e) => {
              //         if (props.treatment.dose_type !== 'pills') {
              //           props.handleChange(e);
              //         }
              //       }}
              //     />
              //     <label className='active' htmlFor='dose'>Dose</label>
              //     <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
              //   </div>
              // </Col>
            }

            <RxDoseTypeDropdown
              props={props}
              col={3}
              offset={props.treatment.dose_type === 'pills' ? 's4' : 's0'} />
            {/* <Col l={3}>
              <Input type='select' name="dose_type" label='Unit of Measurement' value={props.treatment.dose_type} onChange={props.handleChange.bind(this)}>
                <option value="mg">mg</option>
                <option value="iu">iu</option>
                <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
               </Input>
            </Col> */}
          </Row>
          <Row>
            <div className='col l10 offset-l1'>
              {props.treatment.dosingDetails.generalDoses.map((dose, index) =>
                <div key={index}>
                  <div className="col s3">
                    <div className="input-field">
                      <input type="number" id={`${props.treatment.name}_${dose.time}_dose`} value={dose.quantity} min="0"  onChange={(e) => props.handleDosingDetailsChange({type: 'generalDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                      <label className='active' htmlFor={`${props.treatment.name}_${dose.time}_dose`}>{`${dose.time.charAt(0).toUpperCase() + dose.time.slice(1)} Amount:`}</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Row>
        </Row>
        :
        props.treatment.dosingFormat === 'specificTimes' ?
        <Row className='rx-detail-form'>
          <Row>
            {props.treatment.dose_type !== 'pills' &&
              <RxDoseInput
                props={props}
                col='col l2 offset-l3'/>

              // <Col l={2} offset='l3'>
              //   <div className="input-field">
              //     <input className={`ui ${props.treatment.dose_type === 'pills' && 'disabled'} input`}
              //       type="number" id="dose" name="dose" value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose} min="0" step="25"
              //       onChange={(e) => {
              //         if (props.treatment.dose_type !== 'pills') {
              //           props.handleChange(e);
              //         }
              //       }}
              //     />
              //     <label className='active' htmlFor='dose'>Dose</label>
              //     <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
              //   </div>
              // </Col>
            }
            <RxDoseTypeDropdown
              props={props}
              col={2}
              offset={props.treatment.dose_type === 'pills' ? 's3' : 's0'} />
            {/* <Col l={2}>
              <Input type='select' name="dose_type" value={props.treatment.dose_type} onChange={props.handleChange.bind(this)}>
                <option value="mg">mg</option>
                <option value="iu">iu</option>
                <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
               </Input>
            </Col> */}
            <RxFrequencyInput
              props={props}
              col='col l2'/>
            {/* <div className="input-field col l2">
              <input type="number" name="frequency" value={props.treatment.frequency} min="1" onChange={props.handleChange.bind(this)} />
              <label className='active' htmlFor='frequency'>Times Per Day</label>
              <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.frequency : ''}</div>
            </div> */}
          </Row>
          <Row>
            <ol className='col l8 offset-l1'>
              {props.treatment.dosingDetails.specificDoses.map((dose, index) =>
                <li className='row' key={index}>
                  <div className="col s4">
                    <TimePicker
                      showSecond={false}
                      value={moment(dose.time)}
                      className="xxx browser-default"
                      onChange={(newDoseTime) => props.handleDosingDetailsChange({type: 'specificDoses', index, targetProperty: 'time', changedValue: newDoseTime.valueOf()})}
                      format={'h:mm a'}
                      use12Hours
                    />
                  </div>
                  <div className="col s2">
                    <div className="input-field">
                      <input type="number"  id={`${props.treatment.name}_${dose.time}_dose`} value={dose.quantity} step='1' min="1" onChange={(e) => props.handleDosingDetailsChange({type: 'specificDoses', index, targetProperty: 'quantity', changedValue: e.target.value})}/>
                      <label className='active' htmlFor={`${props.treatment.name}_${dose.time}_dose`}>Amount</label>
                    </div>
                  </div>
                </li>
              )}
            </ol>
          </Row>
        </Row>
        :
        props.treatment.dosingFormat === 'byHours' ?
        <Row className='rx-detail-form'>
          <div className="col s1 offset-l1">
            <span className='dosing-form__text'>Take</span>
          </div>
          <div className={`input-field ${props.treatment.dose_type === 'pills' ? 'col l2' : 'col l1'}`}>
            {/* <input type="number" id="amount" name="amount" min="1" value={props.treatment.amount} onChange={props.handleChange.bind(this)} disabled={props.treatment.dosingFormat !== 'default' && props.treatment.dosingFormat !== 'other'}/>
            <label className='active' htmlFor='amount'>Amount</label> */}
            {/* <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.amount : ''}</div> */}
            <input type="number" id={`${props.treatment.name}_hourlyDoseQuantity`} value={props.treatment.dosingDetails.recurringDose.quantity} step='1' min="1" onChange={(e) => props.handleDosingDetailsChange({type: 'recurringDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
            <label className='active' htmlFor={`${props.treatment.name}_hourlyDoseQuantity`}>Amount</label>
          </div>

          {props.treatment.dose_type !== 'pills' &&
            <RxDoseInput
              props={props}
              col='col l1'/>
            // <div className="input-field col l2">
            //   <input
            //     className={`ui ${props.treatment.dose_type === 'pills' && 'disabled'} input`}
            //     type="number" id="dose" name="dose" value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose} min="0" step="25"
            //     onChange={(e) => {
            //       if (props.treatment.dose_type !== 'pills') {
            //         props.handleChange(e);
            //       }
            //     }}
            //   />
            //   <label className='active' htmlFor='dose'>Dose</label>
            //   <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
            // </div>
          }

          <RxDoseTypeDropdown
            props={props}
            col={props.treatment.dose_type !== 'pills' ? 2 : 2} />
          {/* <Input s={props.treatment.dose_type !== 'pills' ? 1 : 2} type='select' name="dose_type" value={props.treatment.dose_type} onChange={props.handleChange.bind(this)}>
            <option value="mg">mg</option>
            <option value="iu">iu</option>
            <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
          </Input> */}

          {/* <select className="col s2 browser-default" value={props.treatment.dosingDetails.hourlyDose.hourInterval} onChange={(e) => props.handleDosingDetailsChange({type: 'hourlyDose', targetProperty: 'hourInterval', changedValue: e.target.value})} > */}

          <div className="col s1">
            <span className='dosing-form__text'>Every</span>
          </div>

          <Input
            s={2}
            type='select'
            value={props.treatment.dosingDetails.recurringDose.recurringInterval}
            // label={`Every ${props.treatment.dosingDetails.hourlyDose.hourInterval} ${props.treatment.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}`}
            // label='Recurring Interval'
            onChange={(e) => props.handleDosingDetailsChange({type: 'recurringDose', targetProperty: 'recurringInterval', changedValue: e.target.value})}>
              {props.treatment.dosingDetails.recurringDose.timeUnit === 'hour' ?
                [1,2,3,4,5,6,7,8,9,10,11,12].map(hour =>
                  <option key={hour} value={hour}>{hour}</option>
                )
              : props.treatment.dosingDetails.recurringDose.timeUnit === 'day' ?
                [1,2,3,4,5,6,7].map(day =>
                  <option key={day} value={day}>{day}</option>
                )
              :
                [1,2,3,4].map(week =>
                  <option key={week} value={week}>{week}</option>
                )
              }
          </Input>
          {/* <span className='col l4'>{props.treatment.dosingDetails.hourlyDose.hourInterval == 1 ? 'hour' : 'hours'}</span> */}

          <Input
            s={2}
            type='select'
            value={props.treatment.dosingDetails.recurringDose.timeUnit}
            // label='Time Unit'
            onChange={(e) => props.handleDosingDetailsChange({type: 'recurringDose', targetProperty: 'timeUnit', changedValue: e.target.value})}>
            <option value='hour'>{props.treatment.dosingDetails.recurringDose.recurringInterval == 1 ? `Hour` : 'Hours'}</option>
            <option value='day'>{props.treatment.dosingDetails.recurringDose.recurringInterval == 1 ? `Day` : 'Days'}</option>
            <option value='week'>{props.treatment.dosingDetails.recurringDose.recurringInterval == 1 ? `Week` : 'Weeks'}</option>
          </Input>

        </Row>
        : props.treatment.dosingFormat === 'prn' ?
        <Row className='rx-detail-form'>
          <div className="col s2 offset-l1">
            <span className='dosing-form__text'>Take up to</span>
          </div>

          <div className={`input-field ${props.treatment.dose_type === 'pills' ? 'col l2' : 'col l1'}`}>
            <input type="number" id={`${props.treatment.name}_hourlyDoseQuantity`} value={props.treatment.dosingDetails.prnDose.quantity} step='1' min="1" onChange={(e) => props.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'quantity', changedValue: e.target.value})}/>
            <label className='active' htmlFor={`${props.treatment.name}_hourlyDoseQuantity`}>Amount</label>
          </div>

          {props.treatment.dose_type !== 'pills' &&
            <RxDoseInput
              props={props}
              col='col l2'/>
            // <div className="input-field col l2">
            //   <input className={`ui ${props.treatment.dose_type === 'pills' && 'disabled'} input`}
            //     type="number" id="dose" name="dose" value={props.treatment.dose_type === 'pills' ? '' : props.treatment.dose} min="0" step="25"
            //     onChange={(e) => {
            //       if (props.treatment.dose_type !== 'pills') {
            //         props.handleChange(e);
            //       }
            //     }}
            //   />
            //   <label className='active' htmlFor='dose'>Dose</label>
            //   <div className="input-response red-text text-darken-2">{props.showErrors ? props.treatment.errors.dose : ''}</div>
            // </div>
          }

          <RxDoseTypeDropdown
            props={props}
            col={props.treatment.dose_type !== 'pills' ? 2 : 2} />
          {/* <Input s={props.treatment.dose_type !== 'pills' ? 1 : 2} type='select' name="dose_type" value={props.treatment.dose_type} onChange={props.handleChange.bind(this)}>
            <option value="mg">mg</option>
            <option value="iu">iu</option>
            <option value="pills">{props.treatment.amount == 1 ? 'pill' : 'pills'}</option>
          </Input> */}

          <div className="col s1">
            <span className='dosing-form__text'>Every</span>
          </div>
          <Input
            s={2}
            type='select'
            value={props.treatment.dosingDetails.prnDose.hourInterval}
            // label={`Every ${props.treatment.dosingDetails.prnDose.hourInterval} ${props.treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : 'hours'}`}
            label={`${props.treatment.dosingDetails.prnDose.hourInterval == 1 ? 'hour' : 'hours'}`}
            onChange={(e) => props.handleDosingDetailsChange({type: 'prnDose', targetProperty: 'hourInterval', changedValue: e.target.value})}>
              {[24,12,6,4,3,2,1].map(hour =>
                // <option key={hour} value={hour}>{hour === 0 ? 'x': hour}</option>
                <option key={hour} value={hour}>{hour}</option>
              )}
          </Input>
        </Row>
        :
        <Row className='rx-detail-form'>
          <div className='input-field col l8 offset-l2'>
            <textarea className="materialize-textarea" id="otherDosingInstructions" value={props.treatment.dosingDetails.other.dosingInstructions} onChange={(e) => props.handleDosingDetailsChange({type: 'other', targetProperty: 'dosingInstructions', changedValue: e.target.value})}></textarea>
            <label htmlFor="otherDosingInstructions" className='active'>Dosing Instructions</label>
          </div>
        </Row>
      }
    </div>
  );
}
