import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card } from 'react-materialize';

export default TreatmentInstructions = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div>
      Meals:
      {['None', 'Take with', 'Take before', 'Take after'].map(mealInstruction =>
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
      Contraindications:
      {['None', 'antibiotic', 'probiotic'].map(contraindicatedInstruction =>
        <p key={contraindicatedInstruction}>
          <input
            type="radio"
            name={`${props.treatment.name}_contraindications`}
            id={`${props.treatment.name}_contraindicatedInstructions_${contraindicatedInstruction}`}
            value={contraindicatedInstruction}
            checked={props.treatment.otherInstructions.contraindications === contraindicatedInstruction}
            onChange={(e) => props.handleInstructionsChange('contraindications', e.target.value)}/>
          <label htmlFor={`${props.treatment.name}_contraindicatedInstructions_${contraindicatedInstruction}`}>{contraindicatedInstruction !== 'None' ? "Don't take within 3 hours of" : ''} {contraindicatedInstruction}</label>
        </p>
      )}
      Custom:
      <div className='container'>
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
      </div>
    </div>
  );
}
