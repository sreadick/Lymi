import React from 'react';
import { Meteor } from 'meteor/meteor';

export class TreatmentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: 1,
      dose: 0,
      dose_type: 'milligrams',
      frequency: 1
    };
  }

  componentDidMount() {
    const { name, amount, dose, dose_type, frequency } = this.props.treatment;
    this.setState({
      name, amount, dose, dose_type, frequency
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    Meteor.call('userTreatments.update', this.props.treatment._id, {
      [e.target.name]: e.target.value
    });
  }

  handleRemove() {
    Meteor.call('userTreatments.remove', this.props.treatment._id)
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
              <input type="text" name="name" value={this.state.name} placeholder="Medication/Supplement" onChange={this.handleChange.bind(this)}/>
            </div>

            <div className="fields">
              <div className="five wide field">
                <label>Amount</label>
                <input type="number" name="amount" min="1" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
              </div>

              <div className="six wide field">
                <label>Dose</label>
                <div className="ui input">
                  <input type="number" name="dose" value={this.state.dose} min="0" step="25" onChange={this.handleChange.bind(this)}/>
                  <div>
                    <select className="ui basic dropdown" name="dose_type" onChange={this.handleChange.bind(this)}>
                      <option value="milligrams" defaultValue>mg</option>
                      <option value="units">iu</option>
                      <option value="pills">pills</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="five wide field">
                <label>Frequency</label>
                <div className="ui right labeled input">
                  <input type="number" name="frequency" value={this.state.frequency} min="1" onChange={this.handleChange.bind(this)}/>
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
