import { observable, computed, action, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { BaseStore } from './baseStore';
import { toast } from 'react-toastify';

export class UserStore extends BaseStore {
    @observable private currentUser: User | null = null;
    @observable private userToken: string | null = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        // Initialize token from localStorage
        this.userToken = window.localStorage.getItem('jwt');
        if (this.userToken) {
            this.loadUser();
        }
    }

    @computed get user() {
        return this.currentUser;
    }

    @computed get isLoggedIn() {
        return !!this.currentUser;
    }

    @computed get token() {
        return this.userToken;
    }

    @computed get isLoading() {
        return this.getLoadingState('auth');
    }

    @action setToken = (token: string | null) => {
        this.userToken = token;
        if (token) {
            window.localStorage.setItem('jwt', token);
        } else {
            window.localStorage.removeItem('jwt');
        }
    };

    @action login = async (values: UserFormValues) => {
        try {
            const user = await this.executeAction(
                'auth',
                () => agent.User.login(values),
                'user login'
            );
            
            runInAction(() => {
                if (user) {
                    this.currentUser = user;
                    this.setToken(user.token);
                    this.rootStore.modalStore.closeModal();
                    history.push('/activities');
                }
            });
        } catch (error) {
            toast.error('Invalid email or password');
            throw error;
        }
    };

    @action register = async (values: UserFormValues) => {
        try {
            const user = await this.executeAction(
                'auth',
                () => agent.User.register(values),
                'user registration'
            );
            
            runInAction(() => {
                if (user) {
                    this.currentUser = user;
                    this.setToken(user.token);
                    this.rootStore.modalStore.closeModal();
                    history.push('/activities');
                }
            });
        } catch (error) {
            toast.error('Problem registering user');
            throw error;
        }
    };

    @action loadUser = async () => {
        try {
            const user = await this.executeAction(
                'auth',
                () => agent.User.current(),
                'loading user'
            );
            
            runInAction(() => {
                if (user) {
                    this.currentUser = user;
                }
            });
        } catch (error) {
            this.logout();
        }
    };

    @action logout = () => {
        this.currentUser = null;
        this.setToken(null);
        history.push('/');
    };

    @action updateUser = async (user: Partial<User>) => {
        try {
            const updatedUser = await this.executeAction(
                'auth',
                () => agent.User.update(user),
                'updating user'
            );
            
            runInAction(() => {
                if (updatedUser) {
                    this.currentUser = { ...this.currentUser, ...updatedUser };
                }
            });
        } catch (error) {
            toast.error('Problem updating user');
            throw error;
        }
    };
}