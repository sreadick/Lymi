import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card } from 'react-materialize';
import { Session } from 'meteor/session';
import Autosuggest from 'react-autosuggest';

export default TreatmentName2 = (props) => {
  const { name, errors } = props.treatment;
  return (
    <div className='treatment-editor2__section treatment-editor2__section--name row'>
      <h3 className='treatment-editor2__section__header name'>
        <i className='small left material-icons button--icon black-text'>keyboard_arrow_left</i>
        Enter your treatment's name
        <i className='small right material-icons button--icon grey-text text-lighten-2' onClick={() => props.changeModalView('dates')}>keyboard_arrow_right</i>
      </h3>
      <Row>
        <div className="input-field col l4 offset-l4">
          <Autosuggest
            suggestions={props.treatmentSuggestions}
            onSuggestionsFetchRequested={props.onSuggestionsFetchRequested.bind(this)}
            onSuggestionsClearRequested={props.onSuggestionsClearRequested.bind(this)}
            getSuggestionValue={props.getSuggestionValue.bind(this)}
            renderSuggestion={props.renderSuggestion.bind(this)}
            onSuggestionSelected={props.onSuggestionSelected.bind(this)}
            inputProps={{className: 'treatment-editor__title center-align', name:'name', value: name, placeholder: "Treatment Name", onChange: props.handleChange.bind(this), autoFocus: true}}
          />
          {(Session.get('showErrors') && props.treatment.errors.name) &&
            <div className="treatment-editor2__error-message">{props.treatment.errors.name}</div>
          }
        </div>
      </Row>
      <p className='center-align'>If you see your treatment in the dropdown list, select it to prefill the form with Rx data.</p>
    </div>
  );
}
