import * as actionTypes from './../constant/actionTypes';

const admin = (state = {}, action) => {
  switch(action.type) {
    case "MAP_DATA_PASS":
      return {
        ...state,
        ...action,
      }
    case actionTypes.DO_LOGIN_REQUEST:
    case actionTypes.DO_LOGIN_SUCCESS:
    case actionTypes.DO_LOGIN_FAILURE:
      return {
        ...state,
        ...action,
      }
    case actionTypes.DO_RACK_ARRIVAL_REQUEST:
    case actionTypes.DO_RACK_ARRIVAL_SUCCESS:
    case actionTypes.DO_RACK_ARRIVAL_FAILURE:
      return {
        ...state,
        ...action,
      }
    case actionTypes.DO_RACK_REQUEST:
    case actionTypes.DO_RACK_SUCCESS:
    case actionTypes.DO_RACK_FAILURE:
      return {
        ...state,
        ...action,
      }
    case actionTypes.DO_TURN_RACK_REQUEST:
    case actionTypes.DO_TURN_RACK_SUCCESS:
    case actionTypes.DO_TURN_RACK_FAILURE:
      return {
        ...state,
        ...action,
      }
    case actionTypes.DO_IN_OUT_REQUEST:
    case actionTypes.DO_IN_OUT_SUCCESS:
    case actionTypes.DO_IN_OUT_FAILURE:
      return {
        ...state,
        ...action,
      }
    default:
      return {
        ...state,
        ...action,
      }
  }
};

export default admin;