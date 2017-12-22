import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card } from 'react-materialize';

export default TreatmentInstructions2 = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div className='treatment-editor2__section--instructions row'>
      <h1 className='treatment-editor2__section__header center-align green white-text'>
        <i className='medium left material-icons button--icon grey-text text-lighten-2' onClick={() => props.changeModalView('dosing')}>keyboard_arrow_left</i>
        {/* Instructions */}
        Any Special Instructions?
        <i className='medium right material-icons button--icon grey-text text-lighten-2' onClick={() => props.changeModalView('info')}>keyboard_arrow_right</i>
      </h1>
      {/* <p className='treatment-editor2__section__subheader center-align'>Any Special Instructions?</p> */}

      <Row className='treatment-editor__column-group__flex-wrapper'>
        <Col className="white z-depth-2 treatment-editor__column-group">
          <div className='treatment-editor__column-group__title'>
            Food Instructions:
          </div>
          {['None', 'With Food', 'With Fatty Food', 'On Empty Stomach'].map(mealInstruction =>
            <p key={mealInstruction}>
              <input
                type="radio"
                name={`${props.treatment.name}_meals`}
                id={`${props.treatment.name}_mealInstructions_${mealInstruction}`}
                value={mealInstruction}
                checked={props.treatment.otherInstructions.meals === mealInstruction}
                onChange={(e) => props.handleInstructionsChange('meals', e.target.value)}/>
              <label htmlFor={`${props.treatment.name}_mealInstructions_${mealInstruction}`}>{mealInstruction}</label>
            </p>
          )}
        </Col>
        <Col className="white z-depth-2 treatment-editor__column-group">
          <div className='treatment-editor__column-group__title'>
            Antibiotic/Probiotic Cycle:
          </div>
          {['None', 'antibiotic', 'probiotic'].map(contraindicatedInstruction =>
            <p key={contraindicatedInstruction}>
              <input
                type="radio"
                name={`${props.treatment.name}_contraindications`}
                id={`${props.treatment.name}_contraindicatedInstructions_${contraindicatedInstruction}`}
                value={contraindicatedInstruction}
                checked={props.treatment.otherInstructions.contraindications === contraindicatedInstruction}
                onChange={(e) => props.handleInstructionsChange('contraindications', e.target.value)}/>
              <label htmlFor={`${props.treatment.name}_contraindicatedInstructions_${contraindicatedInstruction}`}>
                {contraindicatedInstruction !== 'None' ? "Take between " + contraindicatedInstruction + " doses"  : 'N/A'}
              </label>
            </p>
          )}
        </Col>
        <Col className="white z-depth-2 treatment-editor__column-group">
          <div className='treatment-editor__column-group__title'>
            Other:
          </div>
          <div className="input-field">
            <textarea
              className="materialize-textarea"
              name={`${props.treatment.name}_userDefined`}
              id={`${props.treatment.name}_userDefinedInstructions`}
              value={props.treatment.otherInstructions.userDefined}
              onChange={(e) => props.handleInstructionsChange('userDefined', e.target.value)}>
            </textarea>
            <label className='active' htmlFor={`${props.treatment.name}_userDefinedInstructions`}>Specify</label>
          </div>
        </Col>
      </Row>
    </div>
  );
}
