import {combineReducers} from 'redux';

import responsive from './responsive';
import user from './user';
import error from './error';
import redirectAfterLogin from './redirectAfterLogin';

const reducers = {
    responsive,
    user,
    error,
    redirectAfterLogin
};

export default combineReducers(reducers);
