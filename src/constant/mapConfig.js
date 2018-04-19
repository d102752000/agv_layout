// import _ from 'lodash';

const mapConfig = () => {
  // let ignoreBlocks = [/*
  //   [[3, 2], [3, 3], [3, 4], [2, 4]],
  //   [[0, 2], [0, 3], [0, 4], [1, 4]],*/
  // ];
  let ignoreBlocks = [
    [[3, 2], [3, 3], [3, 4], [2, 4]],
    [[0, 2], [0, 3], [0, 4], [1, 4]],
  ];
  let materialAndFinishBlocks = [
    [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [3, 0]],
    [[0, 0], [1, 0], [2, 0], [2, 2], [3, 0], [3, 2], ],
  ];
  let station = [
    [[3, 1], [2 ,2], [2 ,3], [1, 4]],
    [[0, 1], [1 ,2], [1 ,3], [2, 4]],
  ];
  let betteryChargingArea = [[[0, 4]]];
  // compare is point same as ignore blocks or not
  // const comparePoints = (ignore) => {
  //   const carPoint = [_.random(4-1), _.random(5-1)];
  //   let sameAsIgnore = false;

  //   _.each(ignore, value => {
  //     if( _.isEqual(value, carPoint)) {
  //       sameAsIgnore = true;
  //       return false;
  //     }
  //   });

  //   if (sameAsIgnore) return comparePoints(ignore);
  //   return carPoint;
  // }

  return {
    width: 4,
    height: 5,
    // rack: [[0, 0], [1, 0], [2, 0], [3, 0], [2, 2], [3, 2]],
    // car: comparePoints(ignoreBlocks),
    size: 70,
    station,
    betteryChargingArea,
    materialAndFinishBlocks,
    ignoreBlocks,
  };
}

export default mapConfig;
