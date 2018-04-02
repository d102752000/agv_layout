// import 'whatwg-fetch';

import fakeMap from './../constant/mapConfig';
import * as actionTypes from './../constant/actionTypes';
import _ from 'lodash';

const serverConfig = {
  // url: 'http://lmsr178.calcomp.co.th:5001/apis',
  // url: 'http://127.0.0.1:5001/apis',
  url: 'http://192.168.1.150:5001/apis',
};

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
  console.log(passProps);
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_RACK_ARRIVAL_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/list/rackArrival/`
      + `${passProps.stockUuid}?stationIdentifier=${passProps.stationIdentifier}`, {
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
          stockName,
          rackUuid,
          itemsOnRack,
          tasksOnRack,
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
        success: data.success,
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

export const doInOutRequest = (passProps) => {
  const requestType = passProps.type === 'in' ? 'inRequests' : 'outRequests';
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
  return (dispatch) => {
    dispatch({
      type: actionTypes.DO_LIST_ITEM_REQUEST,
    });
    fetch(`${serverConfig.url}/v1/auth/auth/list/items?itemName=${passProps.itemName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "wms-access-token": passProps.token
      },
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: actionTypes.DO_LIST_ITEM_SUCCESS,
        itemInfo: data,
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