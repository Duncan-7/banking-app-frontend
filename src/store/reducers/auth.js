import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  token: null,
  userId: null,
  fullName: null,
  admin: false,
  error: null,
  loading: false,
  userCreated: false
}

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
}

const authInit = (state, action) => {
  return updateObject(state, { error: null, userCreated: false });
}

const loginSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    admin: action.admin,
    fullName: action.fullName,
    error: null,
    loading: false
  });
}

const createAccountSuccess = (state, action) => {
  return updateObject(state, { error: null, loading: false, userCreated: true });
}

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
}

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    userId: null,
    fullName: null,
    admin: false,
    error: null,
    loading: false,
    userCreated: false
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.CREATE_ACCOUNT_SUCCESS:
      return createAccountSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_INIT:
      return authInit(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state
  }
}

export default reducer;