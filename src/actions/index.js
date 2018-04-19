// import 'whatwg-fetch';

import fakeMap from './../constant/mapConfig';
import * as actionTypes from './../constant/actionTypes';
import _ from 'lodash';

const serverConfig = {
  // url: 'http://lmsr178.calcomp.co.th:5001/apis',
  // url: 'http://127.0.0.1:5001/apis',
  url: 'http://192.168.1.132:5001/apis',
};
//exhibitionadmin
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) return response;

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const parseJSON = (response) => {
  return response.json();
}

export const fakeMapConfig = (passProps) => {
  return dispatch => dispatch({
    type: "MAP_DATA_PASS",
    mapConfig: fakeMap(),
  });
}

export const doLoginRequest = (passProps) => {
  console.log(passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_LOGIN_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passProps)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_LOGIN_SUCCESS,
        userInfo: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_LOGIN_FAILURE,
        message: err,
      });
    });
  }
}

export const doRackArrivalRequest = (passProps) => {
  console.log(passProps, passProps.currentStockUuid);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_RACK_ARRIVAL_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/list/rackArrival/`
      + `${passProps.currentStockUuid}?stationIdentifier=${passProps.currentStationUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      const stockName = data.rackTask.rack.stock.stockName;
      const rackUuid = data.rackTask.rack.uuid;
      const rackName = data.rackTask.rack.rackName;
      const stationId = data.rackTask.rackRequests[0].stationIdentifier || '';

      // items on Rack
      const itemsOnRack = [];
      const tasksOnRack = [];
      const itemUuidCollect = [];
      _.map(data.rackTask.rack.items, (items, itemsKey) => {
        itemUuidCollect.push(items.uuid);
        _.map(items.positions, (itemPositions, positionKey) => {
          const obj = {};
          obj.itemName = items.itemName;
          obj.position = itemPositions.position;
          obj.quantity = itemPositions.quantity;
          itemsOnRack.push(obj);
        });
      });

      _.map(data.rackTask.rackRequests, (rackRequests, rackKey) => {
        const obj = {};
        obj.taskKey = `Task${rackKey}`;
        // item request
        if (rackRequests.options.filter) {
          // const itemIndex = _.indexOf(itemUuidCollect, rackRequests.options.filter.itemUuid);
          // obj.itemName = data.rackTask.rack.items[itemIndex].itemName;
          // obj.quantity = rackRequests.options.filter.quantity || '';
          obj.type = 'By Items';
        // rack request
        } else if (rackRequests.options.specificRack) {
          // obj.rackName = data.rackTask.rack.rackName;
          obj.type = 'By Rack';
        // empty rack
        } else {
          // obj.mostEmptyRack = true;
          obj.type = 'By Empty Rack';
        }
        tasksOnRack.push(obj);
      });

      dispatch({
        type: actionTypes.DO_RACK_ARRIVAL_SUCCESS,
        rackData: {
          rackName,
          stockName,
          rackUuid,
          itemsOnRack,
          tasksOnRack,
          stationId,
        }
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_RACK_ARRIVAL_FAILURE,
        message: err,
      });
    });
  }
}

export const doRackRequest = (passProps) => {
  console.log(passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_RACK_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/create/rackRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
      body: JSON.stringify(passProps.config)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_RACK_SUCCESS,
        rackInfo: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_RACK_FAILURE,
        message: err,
      });
    });
  }
}

export const doTurnRackRequest = (passProps) => {
  console.log('rotate: ', passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_TURN_RACK_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/rotateRack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token,
      },
      body: JSON.stringify(passProps.rotateInfo)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_TURN_RACK_SUCCESS,
        turnSuccess: data.success,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_TURN_RACK_FAILURE,
        message: err,
      });
    });
  }
}

export const doRackReturnRequest = (passProps) => {
  console.log('return: ', passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_RACK_RETURN_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/returnRack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token,
      },
      body: JSON.stringify(passProps.returnRack)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_RACK_RETURN_SUCCESS,
        returnSuccess: data.success,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_RACK_RETURN_FAILURE,
        message: err,
      });
    });
  }
}

export const doInOutRequest = (passProps) => {
  const requestType = passProps.type === 'in' ? 'inRequests' : 'outRequests';
  console.log('doInOutRequest: ', passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_IN_OUT_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/create/${requestType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
      body: JSON.stringify(passProps.config)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_IN_OUT_SUCCESS,
        detail: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_IN_OUT_FAILURE,
        message: err,
      });
    });
  }
}

export const doListItemRequest = (passProps) => {
  const tableData = [];
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_LIST_ITEM_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/list/itemDistributions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      // console.log(data.racks);
    for(let i = 0; i<_.size(data.racks); i++) {
      for(let j = 0; j< _.size(data.racks[i].items); j++) {
        _.map(data.racks[i].items[j].positions, (value) => {
              tableData.push({
                rackname: data.racks[i].rackName,
                quantity: value.quantity,
                location: value.position,
              });
            });
        }
      }
      dispatch({
        type: actionTypes.DO_LIST_ITEM_SUCCESS,
        itemInfo: tableData,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_LIST_ITEM_FAILURE,
        message: err,
      });
    });
  }
}

export const doListRackRequest = (passProps) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_LIST_RACK_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/list/racks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      const racksArrs = [];
      _.map(data.racks, (value, key) => {
        if (passProps.currentStockUuid === value.stock.uuid) {
          const obj = {};
          obj.rackName = value.rackName;
          obj.rackUuid = value.uuid;
          racksArrs.push(obj);
        } else {
          const obj = {};
          obj.rackName = value.rackName;
          obj.rackUuid = value.uuid;
          racksArrs.push(obj);
        }
      });
      dispatch({
        type: actionTypes.DO_LIST_RACK_SUCCESS,
        racksIdInfo: racksArrs,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.DO_LIST_RACK_FAILURE,
        message: err,
      });
    });
  }
}
