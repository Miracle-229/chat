import React, {useState} from 'react';
import AuthService from '../../api/AuthService';
import '../css/auth.css';
import {useNavigate} from "react-router-dom";

function Login () {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({login: '', password: ''});
    const [loginValid, setLoginValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [response, setResponse] = useState('');

    const navigation = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(passwordValid && loginValid) {
            AuthService.login(login, password).then(response => {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('accessToken', response.data['accessToken']);
                localStorage.setItem('refreshToken', response.data['refreshToken']);
                navigation('/chat');
            }).catch(error => {
                setResponse(error['response']['data']['message']);
            });
        }
    }

    const handleClick = (path) => {
        navigation(path);
    };

    const handleLoginInput = (e) => {
        let value = e.target.value;
        let flag = value.match(/^[a-z0-9-]{4,}$/i) || value === '';
        setLogin(value);
        setLoginValid(flag);
        setFormErrors({login: flag ? '' : 'Login is invalid', password: formErrors.password}) 
    }

    const handlePasswordInput = (e) => {
        let value = e.target.value;
        let flag = value.length >= 6 || value.length === 0;
        setPassword(value);
        setPasswordValid(flag);
        setFormErrors({login: formErrors.login, password: flag ? '': 'Password is short'}) 
    }

    return <form className="main" onSubmit={(e) => handleSubmit(e)}>
            <div className="content">
                <div className="label">Login</div>
                <div className="dscError" >{formErrors['login']}</div>
                <input type="text"
                       name="login"
                       required
                       value={login}
                       className={loginValid ? '' : 'error'}
                       onChange={(e) => {handleLoginInput(e)}}/>
                <div className="label">Password</div>
                <div className="dscError" >{formErrors['password']}</div>
                <input type="password"
                       name="password"
                       required
                       value={password}
                       className={passwordValid ? '' : 'error'}
                       onChange={(e) => {handlePasswordInput(e)}}/>
                <div className="dscError" >{response}</div>
                <input type="submit" value="Login" id="button"></input>
                <div className="label">
                    <span onClick={() => handleClick('/registration')}>sign up</span>
                </div>
            </div>
        </form>;

}

export default Login;