import { makeAutoObservable, reaction } from 'mobx';
import { RootStore } from './rootStore';
import { ServerError } from '../models/serverError';

export class CommonStore {
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    setToken = (token: string | null) => {
        this.token = token;
    };

    setError = (error: ServerError | null) => {
        this.error = error;
    };

    setAppLoaded = () => {
        this.appLoaded = true;
    };
}
