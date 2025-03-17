import { observable, computed, action, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { router } from "../router/Routes";
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
            const user = await this.executeAction<User>(
                'auth',
                () => agent.Account.login(values),
                'user login'
            );
            
            if (user) {
                runInAction(() => {
                    this.currentUser = user;
                    this.setToken(user.token);
                    this.rootStore.modalStore.closeModal();
                });
                router.navigate('/activities');
            }
        } catch (error) {
            toast.error('Invalid email or password');
            throw error;
        }
    };

    @action register = async (values: UserFormValues) => {
        try {
            const user = await this.executeAction<User>(
                'auth',
                () => agent.Account.register(values),
                'user registration'
            );
            
            if (user) {
                runInAction(() => {
                    this.currentUser = user;
                    this.setToken(user.token);
                    this.rootStore.modalStore.closeModal();
                });
                router.navigate('/activities');
            }
        } catch (error) {
            toast.error('Problem registering user');
            throw error;
        }
    };

    @action loadUser = async () => {
        try {
            const user = await this.executeAction<User>(
                'auth',
                () => agent.Account.current(),
                'loading user'
            );
            
            if (user) {
                runInAction(() => {
                    this.currentUser = user;
                });
            }
        } catch (error) {
            this.logout();
        }
    };

    @action logout = () => {
        this.currentUser = null;
        this.setToken(null);
        router.navigate('/');
    };

    @action updateUser = async (userUpdate: Partial<User>) => {
        try {
            const updatedUser = await this.executeAction<User>(
                'auth',
                () => agent.Account.update(userUpdate),
                'updating user'
            );
            
            if (updatedUser && this.currentUser) {
                runInAction(() => {
                    this.currentUser = {
                        ...this.currentUser,
                        ...updatedUser
                    };
                });
            }
        } catch (error) {
            toast.error('Problem updating user');
            throw error;
        }
    };
}