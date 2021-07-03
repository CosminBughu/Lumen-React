import React, {Fragment, useEffect, useState} from 'react';
import AuthCard from '../Reusable/AuthCard';
import {Alert, Button, Form, FormFeedback, FormGroup, Input, Label} from 'reactstrap';

import {Link} from 'react-router-dom';
import http from '../../libs/http';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const mapStateToProps = function(store) {
    return {
        user: store.user
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

function ForgotPassword(props) {
    const [showCode, setShowCode] = useState(false);
    const [email, setEmail] = useState('');
    const [codeEmail, setCodeEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [errors, setErrors] = useState(false);
    const [info, setInfo] = useState({type: '', show: false, text: ''});

    useEffect(() => {
        if (props.user && props.user.user) {
            props.history.push('/');
        }
    }, [props]);

    const _forgot = async (e) => {
        e.preventDefault();

        let data = {
            email
        };

        let res = await http.route('forgot-password').post(data);

        if (!res.isError) {
            setCodeEmail(email);
            setEmail('');
            setErrors(false);
            setInfo({type: 'info', show: true, text: 'Insert code received on email!'});
            setShowCode(true);
        } else {
            setErrors(res.errorMessages);
        }
    };

    const _change = async (e) => {
        e.preventDefault();

        setInfo({type: '', show: false, text: ''});
        setErrors(false);

        let data = {
            email: codeEmail,
            code,
            password,
            retypePassword
        };

        let res = await http.route('change-password').post(data);

        if (!res.isError) {
            setCodeEmail('');
            setCode('');
            setPassword('');
            setRetypePassword('');
            setInfo({type: 'success', show: true, text: 'Password changed, you can login now!'});
        } else {
            setErrors(res.errorMessages);
        }
    };

    const _setShowCode = (value) => {
        setErrors(false);
        setShowCode(value);
    };

    const _renderMain = () => {
        return <Fragment>
            {errors && errors.forgot && <Alert color={'warning'}>{errors.forgot}</Alert>}
            {errors && errors.account && <Alert color={'warning'}>{errors.account}</Alert>}
            <Form onSubmit={_forgot}>
                <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={email}
                           placeholder="Email"
                           onChange={(e) => setEmail(`${e.target.value}`)}
                           {...(errors && errors.email ? {
                               invalid: true
                           } : {})}
                    />
                    {errors && errors.email && <FormFeedback>
                        {errors.email}
                    </FormFeedback>}
                </FormGroup>
                <Button type={'submit'} onClick={_forgot}>Submit</Button>
            </Form>
            <Link to={'login'}>Login</Link><br />
            <span className={'fake-link'}
                  onClick={() => _setShowCode(true)}>I have a code!</span>
        </Fragment>;
    };

    const _renderCode = () => {
        return <Fragment>
            {info.show && <Alert color={info.type}>{info.text}</Alert>}
            {errors && errors.forgot && <Alert color={'warning'}>{errors.forgot}</Alert>}
            <Form onSubmit={_change}>
                <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={codeEmail}
                           placeholder="Email"
                           onChange={(e) => setCodeEmail(`${e.target.value}`)}
                           {...(errors && errors.email ? {
                               invalid: true
                           } : {})}
                    />
                    {errors && errors.email && <FormFeedback>
                        {errors.email}
                    </FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label>Code</Label>
                    <Input type="text" name="code" value={code}
                           placeholder="Code"
                           onChange={(e) => setCode(`${e.target.value}`)}
                           {...(errors && errors.code ? {
                               invalid: true
                           } : {})}
                    />
                    {errors && errors.code && <FormFeedback>
                        {errors.code}
                    </FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" name="password" value={password}
                           placeholder="Password"
                           onChange={(e) => setPassword(`${e.target.value}`)}
                           {...(errors && errors.password ? {
                               invalid: true
                           } : {})}
                    />
                    {errors && errors.password && <FormFeedback>
                        {errors.password}
                    </FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label>Retype password</Label>
                    <Input type="password" name="retypePassword" value={retypePassword}
                           placeholder="Retype password"
                           onChange={(e) => setRetypePassword(`${e.target.value}`)}
                           {...(errors && errors.retypePassword ? {
                               invalid: true
                           } : {})}
                    />
                    {errors && errors.retypePassword && <FormFeedback>
                        {errors.retypePassword}
                    </FormFeedback>}
                </FormGroup>
                <Button type={'submit'} onClick={_change}>Submit Code</Button>
            </Form>
            <Link to={'login'}>Login</Link><br />
            <span className={'fake-link'}
                  onClick={() => _setShowCode(false)}>Resend code</span>
        </Fragment>;
    };

    return <AuthCard title="Forgot password">
        {!showCode && _renderMain()}
        {showCode && _renderCode()}
    </AuthCard>;
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
