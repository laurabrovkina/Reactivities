import { createContext } from 'react';
import { configure } from 'mobx';
import { ActivityStore } from './activityStore';
import { UserStore } from './userStore';
import { ModalStore } from './modalStore';
import { CommonStore } from './commonStore';

// Configure MobX
configure({ 
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: false
});

export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    modalStore: ModalStore;
    commonStore: CommonStore;

    constructor() {
        // Initialize stores
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.modalStore = new ModalStore(this);
        this.commonStore = new CommonStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());