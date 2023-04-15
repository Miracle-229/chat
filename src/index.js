import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, useNavigate} from 'react-router-dom'
import axios from "axios";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
    failedQueue.forEach((prom) => {//отлавливаем ошибки и кидаем в очередь
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

axios.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;//для каждого запроса достаём токен из локал и кидаем в хедер
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        originalRequest.headers = JSON.parse(
            JSON.stringify(originalRequest.headers || {})
        );
        const refreshToken = localStorage.getItem('refreshToken');

        const handleError = (error) => {
            processQueue(error);
            return Promise.reject(error);
        };

        if (refreshToken == null && originalRequest?.url !== 'http://localhost:8080/api/auth/refresh') {
            window.location.href = '/';
        }

        if (
            refreshToken &&
            error.response?.status === 401 &&
            originalRequest?.url !== 'http://localhost:8080/api/auth/refresh' &&
            originalRequest?._retry !== true
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axios(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }
            isRefreshing = true;
            originalRequest._retry = true;
            originalRequest._retry = true;
            return axios
                .post('http://localhost:8080/api/auth/refresh', {
                    refreshToken: refreshToken,
                })
                .then((res) => {
                    localStorage.setItem('accessToken', res?.data['accessToken']);
                    localStorage.setItem('refreshToken', res?.data['refreshToken']);

                    return axios(originalRequest);
                }).catch(() => {
                    window.location.href = '/';
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        if (
            error.response?.status === 401 &&
            error.response?.data?.message === "TokenExpiredError"
        ){
            window.location.href = '/';
            return handleError(error);
        }
        
        return Promise.reject(error);
    }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

);
