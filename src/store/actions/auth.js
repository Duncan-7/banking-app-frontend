import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const loginSuccess = (token, userId, fullName, admin) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    idToken: token,
    userId: userId,
    fullName: fullName,
    admin: admin,
  };
};

export const createAccountSuccess = () => {
  return {
    type: actionTypes.CREATE_ACCOUNT_SUCCESS,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const authInit = () => {
  return {
    type: actionTypes.AUTH_INIT
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

//set timer to logout when token expires
export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (data, isSignUp, isEdit) => {
  return dispatch => {
    dispatch(authStart());
    const authData = data
    let url;
    if (isEdit) {
      url = 'users/' + data.userId + '/edit';
    } else if (isSignUp) {
      url = 'users/signup';
    } else {
      url = 'users/login';
    }

    axios.post(url, authData)
      .then(response => {
        if (isSignUp) {
          dispatch(createAccountSuccess());
        } else {
          const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('expirationDate', expirationDate);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('admin', response.data.admin);
          localStorage.setItem('fullName', response.data.fullName);
          dispatch(loginSuccess(response.data.token, response.data.userId, response.data.fullName, response.data.admin));
          dispatch(checkAuthTimeout(response.data.expiresIn));
        }
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

//check for presence of unexpired token in localStorage on starting App
export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        let admin = localStorage.getItem('admin');
        let fullName = localStorage.getItem('fullName');
        //convert admin back to boolean
        admin = admin === 'true' ? true : false;
        dispatch(loginSuccess(token, userId, fullName, admin));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
}

export const getUserData = (userId) => {
  return dispatch => {
    axios.get('/users/' + userId)
      .then(response => {

      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
}