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
    <Row className='treatment-editor__column-group__flex-wrapper'>
      <Col className="white z-depth-2 treatment-editor__column-group">
        <div className='treatment-editor__column-group__title'>
          Treatment Type:
        </div>
        {['N/A', 'Medication', 'Antibiotic/Antimicrobal', 'Herb', 'Supplement', 'Binder', 'Probiotic', 'Other'].map(treatmentType =>
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
        {props.treatment.info.type === 'Other' &&
          <div className="input-field inline">
            <input
              name={`${props.treatment.name}_treatmentTypeOtherValue`}
              id={`${props.treatment.name}_otherType`}
              value={props.treatment.info.typeOtherValue}
              // disabled={props.treatment.info.type !== 'Other'}
              onChange={(e) => props.handleInfoChange('typeOtherValue', e.target.value)} />
            <label className='active' htmlFor={`${props.treatment.name}_otherType`}>Specify</label>
          </div>
        }
      </Col>
      { props.treatment.info.type === 'Medication' &&
        <Col className="white z-depth-2 treatment-editor__column-group">
          <div className='treatment-editor__column-group__title'>
            Drug Class:
          </div>
          <div className="input-field">
            <input
              name={`${props.treatment.name}_treatmentCategory`}
              value={props.treatment.info.category}
              placeholder='e.g. SSRI'
              onChange={(e) => props.handleInfoChange('category', e.target.value)} />
          </div>
        </Col>
      }
      <Col className="white z-depth-2 treatment-editor__column-group">
        <div className='treatment-editor__column-group__title'>
          Used to treat:
        </div>
        <div className="input-field">
          <input
            name={`${props.treatment.name}_usedToTreat`}
            value={props.treatment.info.usedToTreat}
            placeholder='e.g. Depression'
            onChange={(e) => props.handleInfoChange('usedToTreat', e.target.value)} />
        </div>
      </Col>
    </Row>
  );
}
