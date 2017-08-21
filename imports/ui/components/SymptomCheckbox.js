import React from 'react';
import { Meteor } from 'meteor/meteor';
import Toggle from 'react-toggle';

export default class SymptomCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false
    }
  }

  componentDidMount() {
    this.setState({ isChecked: this.props.isChecked});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isChecked !== this.props.isChecked) {
      // console.log(prevProps)
      // console.log(this.props)
      this.setState({ isChecked: this.props.isChecked })
    }
  }

  handleChange(e) {
    // if (!e.target.checked) {
    if (this.props.isChecked) {
      Meteor.call('userSymptoms.remove', this.props.symptom);
    } else {
      Meteor.call('userSymptoms.insert', {
        name: this.props.symptom,
        color: this.props.nextColor
      });
    }
    this.setState({ isChecked: this.props.isChecked});
  }

  render() {
    return (
      // <div>
      //   <label className="symptom-group__item">
      //     <Toggle
      //       className="symptom_toggle"
      //       checked={this.state.isChecked}
      //       value="yes"
      //       onClick={this.handleChange.bind(this)} />
      //     <span className="symptom-group__item__title">{this.props.symptom}</span>
      //   </label>
      //   {/* <label onClick={this.handleChange.bind(this)}><input type='checkbox' checked={this.props.isChecked}/>{this.props.symptom}</label> */}
      // </div>
      <div className="switch">
        <label className={this.state.isChecked ? 'green-text text-darken-2' : 'black-text'}>
          {this.props.symptom}
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onClick={this.handleChange.bind(this)} />
          <span className="lever"></span>
        </label>
      </div>

    );
  }
};

// export default createContainer(() => {
//   const symptomHandle = Meteor.subscribe('userSymptoms');
//   const checkinHandle = Meteor.subscribe('checkinHistories')
//
//   const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
//
//   console.log(UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch());
//
//   return {
//     userSymptoms: UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch(),
//     checkinHistory: CheckinHistories.findOne(),
//     checkinHistoryIsReady
//   }
// }, SelectSymptomsPage);
