import React from 'react';
import { Meteor } from 'meteor/meteor';

// import { TreatmentErrors } from '../../api/ui';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    const { name, amount, dose, dose_type, frequency, errors } = props.treatment;

    this.state = {
      // name: '',
      // amount: 1,
      // dose: 0,
      // dose_type: 'milligrams',
      // frequency: 1,
      name,
      amount,
      dose,
      dose_type,
      frequency,
      errors,
      // showErrors: false
    };
  }

  componentDidMount() {
    const errors = this.getErrors();
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      errors
    });
    this.setState({
      errors
    });
  }

  handleChange(e) {
    const errors = this.getErrors();
    this.setState({
      [e.target.name]: e.target.value,
      errors
    });
    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [e.target.name]: e.target.value,
      errors
    });
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
  }

  getErrors() {
    const errors = {};
    if (this.refs.name.value.length  < 3) {
      errors.name = "needs to be at least three characters.";
    }
    if (parseInt(this.refs.amount.value) !== parseFloat(this.refs.amount.value) || parseInt(this.refs.amount.value) <= 0) {
      errors.amount = "should be a positive whole number."
    }
    if (this.refs.dose.value <= 0) {
      errors.dose = "Dose must be greater than 0";
    }
    if (parseInt(this.refs.frequency.value) !== parseFloat(this.refs.frequency.value) || parseInt(this.refs.frequency.value) <= 0) {
      errors.frequency = "should be a positive whole number."
    }
    return errors
  }

  render() {
    return (
      <div className="ui raised fluid card">
        <div className="content">
          <div className="ui form">
            <div className="treatment-item__header">
              <span className="treatment-item__remove-icon" onClick={this.handleRemove.bind(this)}><i className="remove right floated big red icon"></i></span>
              <h2>{this.state.name}</h2>
            </div>
            <div className="field">
              <label>Name</label>
              {(this.props.showErrors && this.state.errors.name) && <p className="ui negative message">{this.state.errors.name}</p>}
              <input type="text" name="name" ref="name" value={this.state.name} placeholder="Medication/Supplement" onChange={this.handleChange.bind(this)} autoFocus/>
            </div>

            <div className="fields">
              <div className="five wide field">
                <label>Amount</label>
                {(this.props.showErrors && this.state.errors.amount) && <p className="ui negative message">{this.state.errors.amount}</p>}
                <input type="number" name="amount" ref="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
              </div>

              <div className="six wide field">
                <label>Dose</label>
                {(this.props.showErrors && this.state.errors.dose) && <p className="ui negative message">{this.state.errors.dose}</p>}
                <div className="ui input">
                  <input type="number" name="dose" ref="dose" value={this.state.dose} min="0" step="25" onChange={this.handleChange.bind(this)}/>
                  <div>
                    <select className="ui basic dropdown" ref="dose_type" name="dose_type" onChange={this.handleChange.bind(this)}>
                      <option value="milligrams" defaultValue>mg</option>
                      <option value="units">iu</option>
                      <option value="pills">pills</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="five wide field">
                <label>Frequency</label>
                {(this.props.showErrors && this.state.errors.frequency) && <p className="ui negative message">{this.state.errors.frequency}</p>}
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
