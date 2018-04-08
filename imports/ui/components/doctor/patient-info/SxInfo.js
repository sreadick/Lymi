import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input } from 'react-materialize';
import {capitalizePhrase, sortSymptoms, getColor } from '/imports/utils/utils';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';

import SymptomChart from '../../patient/SymptomChart';
import PtInfoSideNav from '../PtInfoSideNav';

configureAnchors({offset: -120, scrollDuration: 800});

// const randomNum = Math.floor(Math.random() * Math.floor(15));
const randomNum = Math.floor(Math.random() * (5 - 10)) + 5;

export default class SxInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      graphedSymptoms: [],
      // activeLink: 'selectFive',
      // navLinks: ['selectFive', 'systems', 'worst', 'changes', 'sxTable']
    };

    this.handleScrolling = this.handleScrolling.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.selectFiveSection = document.querySelector('#pt-summary__subsection--symptoms--select-five').getBoundingClientRect().top;
    this.systemsSection = document.querySelector('#pt-summary__subsection--symptoms--systems').getBoundingClientRect().top;
    this.worstSection = document.querySelector('#pt-summary__subsection--symptoms--worst').getBoundingClientRect().top;
    this.changesSection = document.querySelector('#pt-summary__subsection--symptoms--changes').getBoundingClientRect().top;
    this.tableSection = document.querySelector('#pt-summary__subsection--symptoms--table').getBoundingClientRect().top;

    this.s5Link = document.getElementById('pt-summary__navbar__link--selectFive');
    this.systemsLink = document.getElementById('pt-summary__navbar__link--systems');
    this.worstLink = document.getElementById('pt-summary__navbar__link--worst');
    this.changesLink = document.getElementById('pt-summary__navbar__link--changes');
    this.tableLink = document.getElementById('pt-summary__navbar__link--sxTable');

    this.s5Link.classList.add('active');
    document.addEventListener('scroll', this.handleScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrolling);
  }

  handleScrolling() {
    this.s5Link.classList.remove('active');
    this.systemsLink.classList.remove('active');
    this.worstLink.classList.remove('active');
    this.changesLink.classList.remove('active');
    this.tableLink.classList.remove('active');

    if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
      this.tableLink.classList.add('active');
    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.changesSection)) {
      this.changesLink.classList.add('active');

    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.worstSection)) {
      this.worstLink.classList.add('active');

    } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.systemsSection)) {
      this.systemsLink.classList.add('active');

    } else {
      this.s5Link.classList.add('active');
    }
    // if (window.scrollY + this.props.headerHeights >= Math.floor(this.tableSection)) {
    //   this.setState({activeLink: 'sxTable'})
    // } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.changesSection)) {
    //   this.setState({activeLink: 'changes'})
    // } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.worstSection)) {
    //   this.setState({activeLink: 'worst'})
    // } else if (window.scrollY + this.props.headerHeights >= Math.floor(this.systemsSection)) {
    //   this.setState({activeLink: 'systems'})
    // } else {
    //   this.setState({activeLink: 'selectFive'})
    // }
  }


  render() {
    const {props} = this;

    return (
      <div className='pt-summary__flex-wrapper'>
        <div className='pt-summary__content'>
          <div className='pt-summary__section'>
            <div className='pt-summary__subsection' id='pt-summary__subsection--symptoms--select-five'>
              <ScrollableAnchor id={'heading--selectFive'}>
                <div className='pt-summary__subheading'>Select up to Five Symptoms</div>
              </ScrollableAnchor>
              <div className='card'>
                {props.patientSymptoms.map(symptom => {
                  const graphedSymptoms = this.state.graphedSymptoms.slice();
                  const isChecked = graphedSymptoms.includes(symptom);
                  return (
                    <Input
                      key={symptom.name}
                      type='checkbox'
                      name='graphedSymptoms'
                      value={symptom.name}
                      label={
                        <span style={{color: isChecked ? getColor(graphedSymptoms.indexOf(symptom)) : 'grey'}}>
                          {capitalizePhrase(symptom.name)}
                        </span>
                      }
                      defaultChecked={isChecked}
                      disabled={graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
                      onChange={() => {
                        // const graphedSymptoms = this.state.graphedSymptoms.slice();
                        if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
                          const symptomIndex = graphedSymptoms.indexOf(symptom)
                          graphedSymptoms.splice(symptomIndex, 1);
                        } else {
                          graphedSymptoms.push(symptom)
                        }
                        this.setState({graphedSymptoms})
                      }}
                    />
                  );
                })}
                <SymptomChart
                  symptomNames={this.state.graphedSymptoms.map(symptom => symptom.name)}
                  symptomColors={this.state.graphedSymptoms.map((symptom, index) => getColor(index))}
                  checkins={props.checkins}
                  // currentSymptomNames={this.props.currentSymptomNames}
                  // startDate={this.props.startDate}
                  // endDate={this.props.endDate}
                  height={120}
                  padding={{top: 30, right: 30, bottom: 10, left: 0}}
                />
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--symptoms--systems'>
              <ScrollableAnchor id={'heading--systems'}>
                <div className='pt-summary__subheading'>Ordered by System</div>
              </ScrollableAnchor>
              <div className='card'>
                {props.patientSxSystems.map((system, systemIndex) => {
                  return (
                    <div key={system} className=''>
                      <h3 className='symptom-history__title--system'>{system}</h3>

                      {props.patientSymptoms.filter(symptom => symptom.system === system).map((symptom, symptomIndex) => (
                        <div key={symptom._id}>
                          <span
                            // className={`checkin-symptom-item ${!this.props.currentSymptomNames.find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
                            className={`checkin-symptom-item}`}
                            style={{
                              color: getColor(symptomIndex + (systemIndex * randomNum)),
                            }}>
                            {capitalizePhrase(symptom.name)}
                          </span>
                        </div>
                      ))}
                      <SymptomChart
                        // maxSymptomsPerSegment={this.props.maxSymptomsPerSegment}
                        symptomNames={props.patientSymptoms.filter(symptom => symptom.system === system).map(symptom => symptom.name)}
                        symptomColors={props.patientSymptoms.filter(symptom => symptom.system === system).map((symptom, symptomIndex) => getColor(symptomIndex + (systemIndex * randomNum)))}
                        // symptomColors={props.patientSymptoms.filter(symptom => symptom.system === system).map(symptom => symptom.color)}
                        checkins={props.checkins}
                        // currentSymptomNames={props.currentSymptomNames}
                        padding={{top: 30, right: 30, bottom: 10, left: 0}}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--symptoms--worst'>
              <ScrollableAnchor id={'heading--worst'}>
                <div className='pt-summary__subheading'>Highest Severity (weekly average)</div>
              </ScrollableAnchor>
              <div className='card'>
                {this.props.highestSeveritySymptoms.map((symptom, index) => (
                  <div key={symptom._id}>
                    <span
                      className={`checkin-symptom-item`}
                      style={{
                        color: getColor(index),
                      }}>
                      {capitalizePhrase(symptom.name)}
                    </span>
                  </div>
                ))}
                <SymptomChart
                  symptomNames={props.highestSeveritySymptoms.map(symptom => symptom.name)}
                  symptomColors={props.highestSeveritySymptoms.map((symptom, index) => getColor(index))}
                  checkins={props.checkins}
                  padding={{top: 30, right: 30, bottom: 10, left: 0}}
                  // currentSymptomNames={this.props.currentSymptomNames}
                  // startDate={this.props.startDate}
                  // endDate={this.props.endDate}
                />
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--symptoms--changes'>
              <ScrollableAnchor id={'heading--changes'}>
                <div className='pt-summary__subheading'>Greatest Changes (weekly average)</div>
              </ScrollableAnchor>
              <div className='card'>
                {this.props.biggestChangeSymptoms.map((symptom, index) => (
                  <div key={symptom._id}>
                    <span
                      className={`checkin-symptom-item`}
                      style={{
                        color: getColor(index + randomNum),
                      }}>
                      {capitalizePhrase(symptom.name)}
                    </span>
                  </div>
                ))}
                <SymptomChart
                  symptomNames={props.biggestChangeSymptoms.map(symptom => symptom.name)}
                  symptomColors={props.biggestChangeSymptoms.map((symptom, index) => getColor(index + randomNum))}
                  checkins={props.checkins}
                  padding={{top: 30, right: 30, bottom: 10, left: 0}}
                  // currentSymptomNames={this.props.currentSymptomNames}
                  // startDate={this.props.startDate}
                  // endDate={this.props.endDate}
                />
              </div>
            </div>

            <div className='pt-summary__subsection' id='pt-summary__subsection--symptoms--table'>
              <ScrollableAnchor id={'heading--sxTable'}>
                <div className='pt-summary__subheading'>Daily Record</div>
              </ScrollableAnchor>
              {props.checkins.slice().reverse().map(checkin =>
                <div className="section" key={checkin.date}>
                  <h4>{checkin.date}</h4>
                  <table className='striped'>
                    <thead>
                      <tr>
                        <th>Symptom</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkin.symptoms.map(checkinSymptom =>
                        <tr key={checkinSymptom.name}>
                          <td>{capitalizePhrase(checkinSymptom.name)}</td>
                          <td>{checkinSymptom.severity === 0 ? 'N/A' : checkinSymptom.severity}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
        <div className='pt-summary__navbar__wrapper'>
          <PtInfoSideNav
            // activeLink={this.state.activeLink}
            // links={this.state.navLinks
            links={[
              {
                name: 'selectFive',
                displayedName: 'Select Five'
              },
              {
                name: 'systems',
                displayedName: 'Ordered by System'
              },
              {
                name: 'worst',
                displayedName: 'Highest Severity'
              },
              {
                name: 'changes',
                displayedName: 'Greatest Changes'
              },
              {
                name: 'sxTable',
                displayedName: 'Daily Record'
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

// {props.patientSymptoms.map(symptom =>
//   <p key={symptom.name}>
//     <label htmlFor={symptom.name}>
//       <input
//         type="checkbox"
//         name='graphedSymptoms'
//         id={symptom.name}
//         value={symptom.name}
//         checked={this.state.graphedSymptoms.includes(symptom.name)}
//         disabled={this.state.graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name) === false && this.state.graphedSymptoms.length >= 5}
//         onChange={() => {
//           const graphedSymptoms = this.state.graphedSymptoms.slice();
//           if (graphedSymptoms.map(graphedSymptom => graphedSymptom.name).includes(symptom.name)) {
//             const symptomIndex = graphedSymptoms.indexOf(symptom)
//             graphedSymptoms.splice(symptomIndex, 1);
//           } else {
//             graphedSymptoms.push(symptom)
//           }
//           this.setState({graphedSymptoms})
//         }}
//        />
//       <span>{symptom.name}</span>
//     </label>
//   </p>
// )}

// export default createContainer((props) => {
//   console.log(sortSymptoms(props.patientSymptoms, props.checkins, props.checkins[0].date, props.checkins[props.checkins.length - 1].date));
//   const symptomsExtendedData = sortSymptoms(props.patientSymptoms, props.checkins, props.checkins[0].date, props.checkins[props.checkins.length - 1].date);
//   const symptomsSeveritySorted = symptomsExtendedData.slice().sort((symptomA, symptomB) => symptomB.severityAverage - symptomA.severityAverage);
//   const symptomsChangeSorted = symptomsExtendedData.slice().sort((symptomA, symptomB) => symptomB.biggestChangeAverage - symptomA.biggestChangeAverage);
//
//   console.log(symptomsSeveritySorted.slice(0, 5));
//   console.log(symptomsChangeSorted.slice(0, 5));
//
//   return {
//     highestSeveritySymptoms: symptomsSeveritySorted.slice(0, 5),
//     biggestChangeSymptoms: symptomsChangeSorted.slice(0, 5)
//   };
//
// }, SxInfo);
