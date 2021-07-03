import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {AccountWrapper} from './components/Helpers/AccountWrapper';

import Home from './components/Home';
import Profile from './components/Account';
import Boards from './components/Boards';
import Logout from './components/Auth/Logout';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = function (store) {
    return {
        error: store.error
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

function Router(props) {
    const {error} = props;

    if (error) {
        return <div>{error}</div>
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={AccountWrapper(Login, false)}/>
                <Route exact path="/forgot-password" component={AccountWrapper(ForgotPassword, false)}/>

                <Route exact path="/" component={AccountWrapper(Home, false)}/>
                <Route exact path="/profile" component={AccountWrapper(Profile, true)}/>
                <Route exact path="/boards" component={AccountWrapper(Boards, true)}/>

                <Route exact path="/logout" component={AccountWrapper(Logout, true)}/>
            </Switch>
        </BrowserRouter>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
