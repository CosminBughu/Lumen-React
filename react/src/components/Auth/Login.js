import React, {useEffect, useState} from 'react';
import AuthCard from "../Reusable/AuthCard";
import {Alert, Button, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import userActions from '../../actions/user';

const mapStateToProps = function (store) {
    return {
        user: store.user,
        width: store.responsive.width,
        height: store.responsive.height
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({...userActions}, dispatch);
};

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loginErrorTimeout, setLoginErrorTimeout] = useState(false);

    const {loginErrors} = props.user;
    const {setUserErrors} = props;

    useEffect(() => {
        if (props.user && props.user.user) {
            props.history.push("/");
        }
    }, [props]);

    useEffect(() => {
        if (loginErrors) {
            setLoginErrorTimeout(setTimeout(() => {
                setUserErrors(false);
            }, 5000));
        }
    }, [loginErrors, setUserErrors]);

    const _login = async (e) => {
        e.preventDefault();

        clearTimeout(loginErrorTimeout);

        const {loginUser} = props;

        let data = {
            email,
            password
        };

        if (remember) {
            data.remember = true;
        }

        loginUser && loginUser(data);
    };

    return <AuthCard title="Login">
        {loginErrors && loginErrors.account && <Alert color={'warning'}>{loginErrors.account}</Alert>}
        {loginErrors && loginErrors.credentials && <Alert color={'danger'}>{loginErrors.credentials}</Alert>}
        <Form onSubmit={_login}>
            <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={email}
                       placeholder="Email"
                       onChange={(e) => setEmail(`${e.target.value}`)}
                       {...(loginErrors && loginErrors.email ? {
                           invalid: true
                       } : {})}
                />
                {loginErrors && loginErrors.email && <FormFeedback>
                    {loginErrors.email}
                </FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input type="password" name="password" value={password}
                       placeholder="Password"
                       onChange={(e) => setPassword(`${e.target.value}`)}
                       {...(loginErrors && loginErrors.password ? {
                           invalid: true
                       } : {})}
                />
                {loginErrors && loginErrors.password && <FormFeedback>
                    {loginErrors.password}
                </FormFeedback>}
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input name="remember" type="checkbox" checked={remember}
                           onChange={(e) => setRemember(e.target.checked)}/>{' '}
                    Remember me
                </Label>
            </FormGroup>
            <Button type={'submit'} onClick={_login}>Submit</Button>
        </Form>
        <Link to={'forgot-password'}>Forgot password</Link>
    </AuthCard>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
