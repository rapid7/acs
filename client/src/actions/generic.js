import axios from 'axios';

export const requestSecret = (endpoint, requestAction, successAction, failureAction) => {
  return (filter) => async (dispatch) => {
    dispatch(requestAction(filter));
    let response;

    try {
      response = await axios.post(endpoint, filter);
    } catch (err) {
      return dispatch(failureAction(err.response));
    }

    return dispatch(successAction(response.data));
  };
};
