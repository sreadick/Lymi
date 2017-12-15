import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input, Button, Card } from 'react-materialize';

export default TreatmentInfo = (props) => {
  if (props.isFetching) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return (
    <div>
      <div className='col l3'>
        Type:
        {['N/A', 'Medication', 'Supplement', 'Other'].map(treatmentType =>
          <p key={treatmentType}>
            <input
              type="radio"
              name={`${props.treatment.name}_treatmentType`}
              id={`${props.treatment.name}_type_${treatmentType}`}
              value={treatmentType}
              checked={props.treatment.info.type === treatmentType}
              onChange={(e) => props.handleInfoChange('type', e.target.value)}/>
            <label htmlFor={`${props.treatment.name}_type_${treatmentType}`}>{treatmentType}</label>
          </p>
        )}
        <div className="input-field inline">
          <input
            name={`${props.treatment.name}_treatmentTypeOtherValue`}
            id={`${props.treatment.name}_otherType`}
            value={props.treatment.info.typeOtherValue}
            disabled={props.treatment.info.type !== 'Other'}
            onChange={(e) => props.handleInfoChange('typeOtherValue', e.target.value)} />
          <label className='active' htmlFor={`${props.treatment.name}_otherType`}>Specify</label>
        </div>
      </div>
      <div className='col l3'>
        Category:
        <div className="input-field">
          <input
            name={`${props.treatment.name}_treatmentCategory`}
            value={props.treatment.info.category}
            placeholder='e.g. SSRI'
            onChange={(e) => props.handleInfoChange('category', e.target.value)} />
        </div>
      </div>
      <div className='col l3'>
        Used to treat:
        <div className="input-field">
          <input
            name={`${props.treatment.name}_usedToTreat`}
            value={props.treatment.info.usedToTreat}
            placeholder='e.g. Depression'
            onChange={(e) => props.handleInfoChange('usedToTreat', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
