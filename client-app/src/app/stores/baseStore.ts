import { RootStore } from './rootStore';
import { action, runInAction } from 'mobx';
import { ServerErrorResponse } from '../models/serverError';

export abstract class BaseStore {
    protected rootStore: RootStore;
    protected loading = new Map<string, boolean>();

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    protected getLoadingState(key: string): boolean {
        return this.loading.get(key) || false;
    }

    @action protected setLoadingState(key: string, state: boolean): void {
        this.loading.set(key, state);
    }

    protected handleError(error: any, context: string): ServerErrorResponse {
        const serverError = ServerErrorResponse.fromAxiosError(error);
        runInAction(() => {
            console.error(`Error in ${context}:`, serverError.toString());
            if (serverError.isUnauthorized) {
                this.rootStore.userStore.logout();
            }
        });
        return serverError;
    }

    protected async executeAction<T>(
        key: string,
        action: () => Promise<T>,
        context: string
    ): Promise<T | undefined> {
        this.setLoadingState(key, true);
        try {
            const result = await action();
            runInAction(() => {
                this.setLoadingState(key, false);
            });
            return result;
        } catch (error) {
            const serverError = this.handleError(error, context);
            runInAction(() => {
                this.setLoadingState(key, false);
            });
            throw serverError;
        }
    }
} 