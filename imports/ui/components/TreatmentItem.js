import React from 'react';
import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import Datetime from 'react-datetime';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    const { name, amount, dose, dose_type, frequency, includeDetails, daysOfWeek } = props.treatment;

    this.state = {
      name,
      amount,
      dose,
      dose_type,
      frequency,
      includeDetails,
      daysOfWeek,
      startDate: moment(),
      endDate: moment(),
    };

    this.handleWeekdayChange = this.handleWeekdayChange.bind(this);
  }

  handleChange(e) {
    if (e.target.name === 'dose_type' && e.target.value === 'pills') {
      this.setState({
        dose_type: 'pills',
        dose: 0,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }

    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [e.target.name]: e.target.value,
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.props.getAllErrors();
      }
    });
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
  }

  handleWeekdayChange(e, day) {
    e.preventDefault();
    if (this.state.daysOfWeek.includes(day)) {
      Meteor.call('userTreatments.update', this.props.treatment._id, {
        daysOfWeek: this.state.daysOfWeek.filter((dayOfWeek) => dayOfWeek !== day)
      });
      this.setState({
        daysOfWeek: this.state.daysOfWeek.filter((dayOfWeek) => dayOfWeek !== day)
      });
    } else {
      Meteor.call('userTreatments.update', this.props.treatment._id, {
        daysOfWeek: [
          day,
          ...this.state.daysOfWeek
        ]
      });
      this.setState({
        daysOfWeek: [
          day,
          ...this.state.daysOfWeek
        ]
      });
    }
  }

  // handleDateChange(startDate) {
  //   this.setState({ startDate })
  // }

  uppercase(treatmentName) {
    const words = treatmentName.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  render() {
    return (
      <div className="">
        <div className="card hoverable treatment-item">

          <div className="card-content">
            {/* <div className="treatment-item__heading">
              <span className="treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}><i className="remove right floated big red icon"></i></span>
              <div className={`ui ${this.state.name.trim().length > 0 ? 'black' : 'grey'} big header`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
              </div>
            </div> */}
            <div className='row'>
              <span className={`card-title ${this.state.name.trim().length > 0 ? 'black-text' : 'grey-text'}`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
                <a><i className="material-icons small grey-text right treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}>delete_forever</i></a>
              </span>
            </div>


            <div className='row'>
              <div className="input-field">
                <input type="text" id="name" name="name" ref="name" value={this.state.name} onChange={this.handleChange.bind(this)} autoFocus/>
                <label className='active' htmlFor='name'>Medication/Supplement</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.name : ''}</div>
              </div>
            </div>


            <div className="row">
              <div className="input-field col l4">
                <input type="number" id="amount" name="amount" ref="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
                <label className='active' htmlFor='amount'>Amount</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.amount : ''}</div>
              </div>

              <div className="input-field col l3">
                <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                  type="number" id="dose" name="dose" ref="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} disabled={this.state.dose_type === 'pills'} min="0" step="25"
                  onChange={(e) => {
                    if (this.state.dose_type !== 'pills') {
                      this.handleChange(e);
                    }
                  }}
                />
                <label className='active' htmlFor='dose'>Dose</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.dose : ''}</div>
              </div>

              <div className="input-field col l1">
                <select className="browser-default" ref="dose_type" name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                  <option value="mg">mg</option>
                  <option value="iu">iu</option>
                  <option value="pills">pills</option>
                </select>
                {/* <label className='active' htmlFor='dose_type'>dose type</label> */}
              </div>


              <div className="input-field col l4">
                {/* <div className="ui right labeled input"> */}
                  <input type="number" name="frequency" ref="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
                {/* </div> */}
                {/* <label className='active' htmlFor='frequency'>{this.state.frequency == "1" ? "time" : "times" } per day</label> */}
                <label className='active' htmlFor='frequency'>Times Per Day</label>
                <div className="input-response red-text text-darken-2">{this.props.showErrors ? this.props.errors.frequency : ''}</div>
              </div>

              <button className='btn-flat' onClick={() => {
                this.setState({includeDetails: !this.state.includeDetails})
                Meteor.call('userTreatments.update', this.props.treatment._id, {
                  includeDetails: !this.state.includeDetails
                });
              }}>

              { this.state.includeDetails ?
                <span>Exclude Details<i className='material-icons'>expand_less</i></span>
                :
                <span>Include Details<i className='material-icons'>expand_more</i></span>
              }
              </button>
              {this.state.includeDetails &&
                <div className='treatment-details-section z-depth-1'>
                  <div className='col l3'>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) =>
                      <div key={day}>
                        <input type="checkbox" id={`${this.props.treatment._id}_${day}`} checked={this.state.daysOfWeek.includes(day)} onChange={(e) => this.handleWeekdayChange(e, day)}/>
                        <label htmlFor={`${this.props.treatment._id}_${day}`}>{day}</label>
                      </div>
                    )}
                  </div>
                  <div className='col l4'>
                    <div className='date-picker-wrapper'>
                      <Datetime
                        open={true}
                        timeFormat={false}
                        onChange={(date) => this.setState({ startDate: date })}
                        value={this.state.startDate}
                      />
                    </div>
                  </div>
                  <div className='col l1'>
                    to...
                  </div>
                  <div className='col l4'>
                    <div className='date-picker-wrapper'>
                      <Datetime
                        open={true}
                        timeFormat={false}
                        onChange={(date) => this.setState({ endDate: date })}
                        value={this.state.endDate}
                      />
                    </div>
                  </div>
                </div>
              }
            </div>

          </div>
        </div>

        {/* <div className="input-field col s12">
          <select>
            <option value="" disabled selected>Choose your option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
          <label>Materialize Select</label>
        </div> */}

        {/* <div className="input-field col s12">
          <select multiple>
            <option value="" disabled selected>Choose your option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
          <label>Materialize Multiple Select</label>
        </div> */}

        {/* <div className="input-field col s12">
          <select>
            <optgroup label="team 1">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </optgroup>
            <optgroup label="team 2">
              <option value="3">Option 3</option>
              <option value="4">Option 4</option>
            </optgroup>
          </select>
          <label>Optgroups</label>
        </div>

        <div className="input-field col s12 m6">
          <select className="icons">
            <option value="" disabled selected>Choose your option</option>
            <option value="" data-icon="images/sample-1.jpg" className="circle">example 1</option>
            <option value="" data-icon="images/office.jpg" className="circle">example 2</option>
            <option value="" data-icon="images/yuna.jpg" className="circle">example 3</option>
          </select>
          <label>Images in select</label>
        </div>
        <div className="input-field col s12 m6">
          <select className="icons">
            <option value="" disabled selected>Choose your option</option>
            <option value="" data-icon="images/sample-1.jpg" className="left circle">example 1</option>
            <option value="" data-icon="images/office.jpg" className="left circle">example 2</option>
            <option value="" data-icon="images/yuna.jpg" className="left circle">example 3</option>
          </select>
          <label>Images in select</label>
        </div>

        <label>Browser Select</label>
        <select className="browser-default">
          <option value="" disabled selected>Choose your option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select> */}

      </div>
    );
  }
};
