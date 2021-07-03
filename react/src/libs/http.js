import axios from 'axios';
import qs from 'qs';

import {setError} from '../actions/error';

import store from '../store';

class Http {
    constructor() {
        axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.interceptors.request.use((request) => {
            if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                request.data = qs.stringify(request.data);
            }

            return request;
        });
        this._axios = axios.create({});
        this._url = process.env.REACT_APP_API_ENDPOINT;
        this._route = false;
        this._response = false;
    }

    static _getAuthConfig() {
        let axiosConfig = {};

        const token = sessionStorage.getItem('token');

        if (token) {
            axiosConfig = Object.assign({}, {
                headers: {'Authorization': 'Bearer ' + token}
            });
        }

        return axiosConfig;
    }

    _validate() {
        if (!this._route) {
            throw new Error('Method was not specified.');
        }
    }

    route(apiMethod) {
        this._route = apiMethod;

        return this;
    }

    build() {
        let response = this._response && this._response.data ? {...this._response.data} : false;
        this._response = false;

        let isError = false;
        let errorMessages = {};
        let data = false;
        let pagination = false;

        if (response) {
            if (response.isError) {
                if (response.userFault) {
                    isError = true;

                    for (let error in response.errorMessages) {
                        if (response.errorMessages.hasOwnProperty(error)) {
                            if (Array.isArray(response.errorMessages[error])) {
                                errorMessages = {
                                    ...errorMessages,
                                    [error]: response.errorMessages[error][0]
                                };
                            } else {
                                errorMessages = {...errorMessages, [error]: response.errorMessages[error]};
                            }
                        }
                    }
                } else {
                    store.dispatch(setError(response.errorMessages['application']));
                }
            } else {
                data = response.result;
                pagination = response.pagination ? response.pagination : false;
            }
        }

        return {
            isError,
            errorMessages,
            data,
            pagination
        };
    }

    clearStorage() {
        sessionStorage.clear();
        localStorage.removeItem('rememberToken');
    }

    async get(options = {}) {
        this._validate();

        let url = `${this._url}/${this._route}`;
        this._route = false;

        let authConfig = Http._getAuthConfig();

        try {
            this._response = await this._axios.get(url, {
                params: {
                    ...options
                },
                ...authConfig
            });
        } catch (e) {
            if (+e.response.status === 401) {
                this.clearStorage();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                let error = 'Something went wrong!';

                store.dispatch(setError(error));
            }
        }

        return this.build();
    }

    async post(data = {}) {
        this._validate();

        let url = `${this._url}/${this._route}`;
        this._route = false;

        let authConfig = Http._getAuthConfig();

        try {
            this._response = await this._axios.post(url, data, authConfig);
        } catch (e) {
            if (+e.response.status === 401) {
                this.clearStorage();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                let error = 'Something went wrong!';

                store.dispatch(setError(error));
            }
        }

        return this.build();
    }

    async delete(data = {}) {
        this._validate();

        let url = `${this._url}/${this._route}`;
        this._route = false;

        let authConfig = Http._getAuthConfig();

        try {
            this._response = await this._axios.delete(url, {...authConfig, params: {...data}});
        } catch (e) {
            if (+e.response.status === 401) {
                this.clearStorage();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                let error = 'Something went wrong!';

                store.dispatch(setError(error));
            }
        }

        return this.build();
    }

    async put(data = {}) {
        this._validate();

        let url = `${this._url}/${this._route}`;
        this._route = false;

        let authConfig = Http._getAuthConfig();

        try {
            this._response = await this._axios.put(url, {
                ...data
            }, authConfig);
        } catch (e) {
            if (+e.response.status === 401) {
                this.clearStorage();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                let error = 'Something went wrong!';

                store.dispatch(setError(error));
            }
        }

        return this.build();
    }

    async patch(data = {}) {
        this._validate();

        let url = `${this._url}/${this._route}`;
        this._route = false;

        let authConfig = Http._getAuthConfig();

        try {
            this._response = await this._axios.patch(url, {
                ...data
            }, authConfig);
        } catch (e) {
            if (+e.response.status === 401) {
                this.clearStorage();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                let error = 'Something went wrong!';

                store.dispatch(setError(error));
            }
        }

        return this.build();
    }
}

export default new Http();
