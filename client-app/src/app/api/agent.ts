import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { User, UserFormValues } from '../models/user';
import { router } from '../router/Routes';
import { ServerError } from '../models/serverError';
import { Comment } from '../stores/commentStore';
import { store } from '../stores/store';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.userStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(async response => {
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            } else {
                throw data;
            }
        case 401:
            throw 'Unauthorized';
        case 403:
            throw 'Forbidden';
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.modalStore.setError(data);
            throw data;
    }
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
};

const Comments = {
    list: (activityId: string) => requests.get<Comment[]>(`/activities/${activityId}/comments`),
    create: (activityId: string, comment: Comment) => requests.post<Comment>(`/activities/${activityId}/comments`, comment),
    delete: (commentId: string) => requests.del(`/comments/${commentId}`)
};

const agent = {
    Activities,
    Account,
    Comments
};

export default agent;
