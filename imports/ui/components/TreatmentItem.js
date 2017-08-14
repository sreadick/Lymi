import React from 'react';
import { Meteor } from 'meteor/meteor';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    const { name, amount, dose, dose_type, frequency } = props.treatment;

    this.state = {
      name,
      amount,
      dose,
      dose_type,
      frequency
    };
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

  uppercase(treatmentName) {
    const words = treatmentName.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  render() {
    return (
      <div className="ui raised fluid card">
        <div className="content">

          <div className="ui form">
            <div className="treatment-item__heading">
              <span className="treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}><i className="remove right floated big red icon"></i></span>
              <div className={`ui ${this.state.name.trim().length > 0 ? 'black' : 'grey'} big header`}>
                {this.state.name.trim().length > 0 ? this.uppercase(this.state.name) : '[Untitled Symptom]'}
              </div>
            </div>

            <div className="field">
              <label>Name</label>
              {(this.props.showErrors && this.props.errors.name) && <p className="ui negative message">{this.props.errors.name}</p>}
              <input type="text" name="name" ref="name" value={this.state.name} placeholder="Medication/Supplement" onChange={this.handleChange.bind(this)} autoFocus/>
            </div>

            <div className="fields">
              <div className="five wide field">
                <label>Amount</label>
                {(this.props.showErrors && this.props.errors.amount) && <p className="ui negative message">{this.props.errors.amount}</p>}
                <input type="number" name="amount" ref="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
              </div>

              <div className="six wide field">
                <label>Dose</label>
                {(this.props.showErrors && this.props.errors.dose) && <p className="ui negative message">{this.props.errors.dose}</p>}
                <div className="ui input">
                  <input className={`ui ${this.state.dose_type === 'pills' && 'disabled'} input`}
                    type="number" name="dose" ref="dose" value={this.state.dose_type === 'pills' ? '' : this.state.dose} disabled={this.state.dose_type === 'pills'} min="0" step="25"
                    onChange={(e) => {
                      if (this.state.dose_type !== 'pills') {
                        this.handleChange(e);
                      }
                    }}
                  />
                  <div>
                    <select className="ui basic dropdown" ref="dose_type" name="dose_type" value={this.state.dose_type} onChange={this.handleChange.bind(this)}>
                      <option value="mg">mg</option>
                      <option value="iu">iu</option>
                      <option value="pills">pills</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="five wide field">
                <label>Frequency</label>
                {(this.props.showErrors && this.props.errors.frequency) && <p className="ui negative message">{this.props.errors.frequency}</p>}
                <div className="ui right labeled input">
                  <input type="number" name="frequency" ref="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
                  <div className="ui basic label">
                    {this.state.frequency == "1" ? "time" : "times" } per day
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
};
