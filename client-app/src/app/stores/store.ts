import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { ActivityStore } from './activityStore';
import { UserStore } from './userStore';
import { ModalStore } from './modalStore';
import { CommentStore } from './commentStore';
import { CommonStore } from './commonStore';
import { ServerError } from '../models/serverError';

// Configure MobX with strict settings
configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: false
});

export interface StoreConfig {
    activityStore: ActivityStore;
    userStore: UserStore;
    modalStore: ModalStore;
    commentStore: CommentStore;
    commonStore: CommonStore;
}

export class Store implements StoreConfig {
    activityStore: ActivityStore;
    userStore: UserStore;
    modalStore: ModalStore;
    commentStore: CommentStore;
    commonStore: CommonStore;

    constructor() {
        // Initialize stores
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.modalStore = new ModalStore(this);
        this.commentStore = new CommentStore(this);
        this.commonStore = new CommonStore(this);

        // Setup store interactions
        this.setupStoreInteractions();
    }

    private setupStoreInteractions() {
        // Setup token synchronization between stores
        this.userStore.setToken = (token: string | null) => {
            this.commonStore.setToken(token);
        };

        // Setup error handling between stores
        this.handleError = (error: ServerError) => {
            this.modalStore.setError(error);
            this.commonStore.setError(error);
        };
    }

    handleError = (error: ServerError) => {
        this.modalStore.setError(error);
        this.commonStore.setError(error);
    };
}

// Create a singleton store instance
export const store = new Store();

// Create the React context with type safety
export const StoreContext = createContext<Store>(store);

// Type-safe hook for accessing stores
export function useStore(): Store;
export function useStore<K extends keyof StoreConfig>(storeName: K): StoreConfig[K];
export function useStore<K extends keyof StoreConfig>(storeName?: K) {
    const context = useContext(StoreContext);
    
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }

    return storeName ? context[storeName] : context;
}

// Export store types for better type inference
export type RootStore = Store;
export type { ActivityStore, UserStore, ModalStore, CommentStore, CommonStore };

// Example usage:
// const store = useStore();                    // Get entire store
// const activityStore = useStore('activityStore'); // Get specific store 