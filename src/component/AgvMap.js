import React from 'react';
import _ from 'lodash';
// import D3 from 'd3';

import car from '../images/agv.png';
import rack from '../images/rack1.png';
import carAndRack from '../images/agvAndRack.png';
import mapConfig from './../constant/mapConfig';

class AgvMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preCarPosition: [],
    };
    this.drawMap = this.drawMap.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(this.props.mapConfig) && !_.isEmpty(nextProps.mapConfig))
      this.setState({ preCarPosition: this.props.mapConfig.car});
  }
  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.mapConfig) this.setState({ preCarPosition: prevProps.mapConfig.car });
  }
  drawMap = (configs, agvData, side) => {
    const wid = configs.width * configs.size;
    const hei = configs.height * configs.size;
    const sideNumber = side === 'left' ? 0 : 1;

    const mapRoads = [];
    const carArrs = [];
    _.times(configs.width, (i) => {
      _.times(configs.height, (j) => {
        let fillColor = "#ffff99";
        let isStationMatch = false;
        let isIgnoreBlocks = false;
        let strokeWidth = 3;

        // match the station blocks
        _.each(configs.station[sideNumber], value => {
          if( _.isEqual(value, [i, j])) {
            isStationMatch = true;
            return;
          }
        });

        // match the ignore blocks
        _.each(configs.ignoreBlocks[sideNumber], value => {
          if( _.isEqual(value, [i, j])) {
            isIgnoreBlocks = true;
            strokeWidth = 0;
            return;
          }
        });

        // determine rect type and color
        if (isStationMatch) fillColor = "#6666ff";
        // else if (i === configs.car[0] && j === configs.car[1]) fillColor = "green";
        else if (isIgnoreBlocks) fillColor = "white";
        // else {
        //   _.filter(configs.rack, (component) => {
        //     if(component[0] === i && component[1] === j) fillColor = "yellow";
        //   });
        // }

        if (fillColor === '#ffff99') strokeWidth = 1;
        mapRoads.push(
          <rect
            className="roadMap"
            x={i * configs.size}
            y={j * configs.size}
            key={`rect${i}-${j}`}
            width={configs.size}
            height={configs.size}
            style={{ "fill": fillColor, "strokeWidth": strokeWidth, "stroke": "black", webkitTransform: 'rotateX(30)' }}
          />
        );
      });
    })

    // draw racks
    _.map(agvData.Table, (value, key) => {
      const rackLocation = value.Location.split('-'); // block-x-y

      // <rect
      //       x={parseInt(rackLocation[1], 10) * configs.size}
      //       y={parseInt(rackLocation[2], 10) * configs.size}
      //       key={`rack${rackLocation[1]}-${rackLocation[2]}`}
      //       width={configs.size}
      //       height={configs.size}
      //       style={{ "fill": 'yellow', "strokeWidth": 3, "stroke": "black" }}
      //     />
      if (parseInt(rackLocation[0], 10) === sideNumber) {
        const xAxis = parseInt(rackLocation[1], 10);
        const yAxis = parseInt(rackLocation[2], 10);
        mapRoads.push(
          <image
            xlinkHref={rack}
            x={105 + 73*xAxis - 55*yAxis}
            y={0 + 14*xAxis + 30*yAxis}
            height="80px"
            width="80px"

            key={value.Name}
            style={{ zIndex: 3 }}
          />
        );
      }
    });

    // draw agv's cars
    _.map(agvData.AGV, (value, key) => {
      const agvLocation = value.Location.split('-'); // block-x-y
      if (parseInt(agvLocation[0], 10) === sideNumber) {
        const xAxis = parseInt(agvLocation[1], 10);
        const yAxis = parseInt(agvLocation[2], 10);
        carArrs.push(
          <image
            xlinkHref={car}
            x={120 + 73*xAxis - 55*yAxis}
            y={35 + 14*xAxis + 30*yAxis}
            height="50px"
            width="50px"
            key={value.Name}
            style={{ zIndex: 1 }}
          />
        );
      }
      // <animate
      //         attributeName="x"
      //         from={`${fromX - 10}`}
      //         to={`${toX - 10}`}
      //         dur="2s"
      //         repeatCount="indefinite"
      //       />
      //       <animate
      //         attributeName="y"
      //         from={`${fromY}`}
      //         to={`${toY}`}
      //         dur="2s"
      //         repeatCount="indefinite"
      //       />
    })

    // console.log('x: ', `${this.state.preCarPosition[0]*20}`, `${this.state.preCarPosition[1]*20}`)
    // console.log('y: ', `${this.props.mapConfig.car[0]*20}`, `${this.props.mapConfig.car[1]*20}`)
    // const fromX = `${this.state.preCarPosition[0]*configs.size}`;
    // const toX = `${this.props.mapConfig.car[0]*configs.size}`;
    // const fromY = `${this.state.preCarPosition[1]*configs.size}`;
    // const toY = `${this.props.mapConfig.car[1]*configs.size}`;

    return (
      <div>
        <svg width={600} height={500} style={{ paddingLeft: '135px' }}>
          {mapRoads}
          {carArrs}
          {/* <circle cx="10" cy="10" r="10" stroke="black" strokeWidth="4" fill="url(#this_image)"> */}
          {/* <image xlinkHref={car} x={fromX} y={fromY} height="65px" width="65px"> */}
            {/* <animateMotion xlinkHref={car} begin="0s" fill="freeze" dur="2s" rotate="auto-reverse" repeatCount="indefinite">
              <mpath xlinkHref="#carPath" />
            </animateMotion> */}
            {/* <animate
              attributeName="x"
              from={`${fromX - 10}`}
              to={`${toX - 10}`}
              dur="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              from={`${fromY}`}
              to={`${toY}`}
              dur="0.5s"
              repeatCount="indefinite"
            /> */}
            {/* <animateTransform attributeName="transform"
              type="rotate"
              from={`0 ${this.state.preCarPosition[0]*20} ${this.state.preCarPosition[1]*20}`}
              to={`90 ${this.props.mapConfig.car[0]*20 + 20} ${this.props.mapConfig.car[1]*20}`}
              dur="0.1s"
              repeatCount="1"
            /> */}
          {/* </circle> */}
          {/* </image> */}
        </svg>
      </div>
    );
  }
  render() {
    const { data, side } = this.props;
    // console.log(data);
    return (
      <div>
        {data ? this.drawMap(mapConfig(), data, side) : ''}
      </div>
    );
  }
}

export default AgvMap;
