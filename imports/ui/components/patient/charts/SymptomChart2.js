import React from 'react';

export default class SymptomChart2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: []
    }
  }
  componentDidMount() {
    const datasource = [];
    this.props.checkins.forEach(checkin => {
      checkin.symptoms.filter(symptom => this.props.symptomNames.includes(symptom.name)).forEach(symptom => {
        datasource.push({
          name: symptom.name,
          severity: symptom.severity,
          date: checkin.date
        })
      });
    });
    console.log(datasource);


    var chart = new tauCharts.Chart({
      data: datasource,
      type: 'line',
      x: 'date',
      y: 'severity',
      color: 'name', // there will be two lines with different colors on the chart
      guide: {
        x: {
          label: 'Dates',
          nice: false
        },
        y: {
          label: 'Severity',
          nice: false,
          min: 1,
          max: 7
        },
        // padding: {b: 70, l: 70, t: 10, r: 10},
        // showGridLines: 'xy',
        color: {
          brewer: this.props.symptomColors
        }
      },
      plugins: [
        // tauCharts.api.plugins.get('legend')()
        // tauCharts.api.plugins.get('tooltip')()
      ]
    });

    chart.renderTo('#line');
  }
  componentDidUpdate(prevProps) {
    if (prevProps.symptomNames !== this.props.symptomNames) {
      const datasource = [];
      this.props.checkins.forEach(checkin => {
        checkin.symptoms.filter(symptom => this.props.symptomNames.includes(symptom.name)).forEach(symptom => {
          datasource.push({
            name: symptom.name,
            severity: symptom.severity,
            date: checkin.date
          })
        });
      })

      var chart = new tauCharts.Chart({
        data: datasource,
        type: 'line',
        x: 'date',
        y: 'severity',
        color: 'name', // there will be two lines with different colors on the chart
        guide: {
          showGridLines: 'xy',
          color: {
            brewer: this.props.symptomColors
          }
        }
      });

      chart.renderTo('#line');
    }
  }

  render() {
    return <div ref='line' id='line'></div>
  }
}
