import React from 'react';
import moment from 'moment';

export default class TreatmentChart3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: []
    }
  }
  componentDidMount() {
    // var chart = new tauCharts.Chart({
    //   type: 'horizontal-stacked-bar',
    //   x: 'count',
    //   y: 'process',
    //   color: 'stage',
    //   guide: {
    //     color: {
    //       brewer:['#00FF00', '#00FF00', '#FFFF00', '#FF0000', '#00FF00']
    //     }
    //   },
    //   data: [
    //     {
    //         process: 'sales',
    //         stage: 'visit',
    //         count: 100
    //     },
    //     {
    //         process: 'sales',
    //         stage: 'trial',
    //         count: 50
    //     },
    //     {
    //         process: 'sales',
    //         stage: 'go away',
    //         count: 30
    //     },
    //     {
    //         process: 'sales',
    //         stage: 'buy',
    //         count: 15
    //     },
    //     {
    //         process: 'sales',
    //         stage: 'go away',
    //         count: 0
    //     }
    //   ]
    // });
    // chart.renderTo('#bar');




    const datasource = [];
    this.props.treatmentNames.forEach(treatmentName => {
      this.props.checkins.forEach(checkin => {
        const dateValue = moment(checkin.date, 'MMMM Do YYYY').startOf('day').valueOf();
        console.log(dateValue);
        const checkinTreatment = checkin.treatments.find(treatment => treatment.name === treatmentName)
        datasource.push({
          name: checkinTreatment.name,
          compliance: checkinTreatment.compliance,
          date: dateValue
        })
      });
    });
    // this.props.checkins.forEach(checkin => {
    //   console.log(moment(checkin.date, 'MMMM Do YYYY').valueOf());
    //   const dateValue = moment(checkin.date, 'MMMM Do YYYY').valueOf();
    //   checkin.treatments.filter(treatment => this.props.treatmentNames.includes(treatment.name)).forEach(treatment => {
    //     datasource.push({
    //       type: treatment.name,
    //       compliance: treatment.compliance,
    //       // date: `${checkin.date}${checkin.notableEvents ? '*' : '?'}`
    //       date: dateValue
    //     })
    //   });
    // });
    console.log(datasource);

    var chart = new tauCharts.Chart({
      data: datasource,
      type: 'horizontal-stacked-bar',
      x: 'date',
      y: 'name',
      color: 'compliance', // there will be two lines with different colors on the chart
      dimensions: {
        name: {
          type: 'category'
        },
        compliance: {
          type: 'order',
          order: ['Yes', 'No', 'Some', 'NPD']
        },
        date: {
          type: 'measure',
          sclae: 'time'
        }
      },
      guide: {
        x: {
          // tickPeriod: 'day',
          // tickFormat: 'day',
          label: 'Dates',
          // nice: false
        },
        y: {
          label: 'Treatments',
          nice: false
        },
        color: {
          // brewer: ['#00FF00', '#FF0000', '#FFFF00', '#CCCCCC']
          brewer: {
            Yes: '#00FF00',
            No: '#FF0000',
            Some: '#FFFF00',
            NPD: '#CCCCCC',
          }
        }
      },
      // dimensions: {
      //   name: { type: 'category', scale: 'ordinal' },
      //   age: { type: 'measure' },
      //   gender: { type: 'category' },
      // },
      plugins: [
        tauCharts.api.plugins.get('legend')()
        // tauCharts.api.plugins.get('tooltip')()
      ]
    });

    chart.renderTo('#bar');
  }
  componentDidUpdate(prevProps) {
    if (prevProps.treatmentNames !== this.props.treatmentNames) {
      const datasource = [];
      this.props.checkins.forEach(checkin => {
        checkin.treatments.filter(treatment => this.props.treatmentNames.includes(treatment.name)).forEach(treatment => {
          datasource.push({
            name: treatment.name,
            compliance: treatment.compliance,
            date: `${checkin.date}${checkin.notableEvents ? '*' : '?'}`
          })
        });
      })

      var chart = new tauCharts.Chart({
        data: datasource,
        type: 'horizontal-stacked-bar',
        x: 'date',
        y: 'compliance',
        color: 'compliance', // there will be two lines with different colors on the chart
        guide: {
          x: {
            label: 'Dates',
            nice: false
          },
          color: {
            brewer: ['#00FF00', '#FFFF00']
          }
        },
        plugins: [
          // tauCharts.api.plugins.get('legend')()
          // tauCharts.api.plugins.get('tooltip')()
        ]
      });

      chart.renderTo('#bar');
    }
  }

  render() {
    return <div ref='bar' id='bar'></div>
  }
}
