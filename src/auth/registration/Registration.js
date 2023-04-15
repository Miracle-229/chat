import React, { useState } from 'react';
import AuthService from '../../api/AuthService';
import '../css/auth.css';
import {useNavigate} from "react-router-dom";

function Registration () {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState({login: '', password: '', rPassword: ''});
    const [loginValid, setLoginValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [response, setResponse] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(passwordValid && loginValid && confirmPasswordValid) {
            AuthService.signUp(login, password).then(response => {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('accessToken', response.data['accessToken']);
                localStorage.setItem('refreshToken', response.data['refreshToken']);
                navigate('/chat');
            }).catch(error => {
                setResponse(error['response']['data']['message']);
            });
        }
    }

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLoginInput = (e) => {
        let value = e.target.value;
        let flag = value.match(/^[a-z0-9-]{4,}$/i) || value === '';
        setLogin(value);
        setLoginValid(flag);
        setFormErrors({login: flag ? '' : 'Login is invalid', password: formErrors.password, rPassword: formErrors.rPassword}) 
    }

    const handlePasswordInput = (e) => {
        let value = e.target.value;
        let flag = value.length >= 6 || value.length === 0;
        setPassword(value);
        setPasswordValid(flag);
        setFormErrors({login: formErrors.login, password: flag ? '': 'Password is short', rPassword: formErrors.rPassword}) 
    }

    const handleRepeatPasswordInput = (e) => {
        let value = e.target.value;
        let flag = password === value;
        setConfirmPassword(value);
        setConfirmPasswordValid(flag);
        setFormErrors({login: formErrors.login, password: formErrors.password, rPassword: flag ? '' : 'Password mismatch'}) 
    }

    return (<form className="main" onSubmit={handleSubmit}>
        <div className="content">
            <div className="label"><h1>Registration</h1></div>
            <br/><br/><br/>
            <div className="label">Login</div>
            <div className="dscError" >{formErrors['login']}</div>
            <input type="text"
                   required
                   name="login"
                   value={login}
                   className={loginValid ? '' :  'error'}
                   onChange={(e) => {handleLoginInput(e)}}/>
            <div className="label">Password</div>
            <div className="dscError" >{formErrors['password']}</div>
            <input type="password"
                   required
                   name="password"
                   value={password}
                   className={passwordValid ? '' :  'error'}
                   onChange={(e) => {handlePasswordInput(e)}}/>
            <div className="label">Confirm password</div>
            <div className="dscError" >{formErrors['rPassword']}</div>
            <input type="password"
                   required
                   name="password2"
                   value={confirmPassword}
                   className={confirmPasswordValid ? '' :  'error'}
                   onChange={(e) => {handleRepeatPasswordInput(e)}}/>
            <div className="dscError" >{response}</div>
            <input type="submit" value="Sign up" id="button"></input>
            <div className="label"><span onClick={() => handleClick('/login')}>login</span></div>

        </div>
    </form>);
};

export default Registration;