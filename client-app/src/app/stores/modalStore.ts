import { RootStore } from './rootStore';
import { observable, action, computed } from 'mobx';
import { BaseStore } from './baseStore';
import { makeAutoObservable } from 'mobx';
import { ServerError } from '../models/serverError';

interface ModalState {
    open: boolean;
    body: React.ReactNode | null;
    title?: string;
    size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
    className?: string;
}

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export class ModalStore extends BaseStore {
    @observable.shallow private modalState: ModalState = {
        open: false,
        body: null,
        title: undefined,
        size: 'small',
        className: undefined
    };
    modal: Modal = {
        open: false,
        body: null
    };
    error: ServerError | null = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeAutoObservable(this);
    }

    @computed get isOpen() {
        return this.modalState.open;
    }

    @computed get content() {
        return this.modalState.body;
    }

    @computed get modalProps() {
        const { title, size, className } = this.modalState;
        return {
            title,
            size,
            className
        };
    }

    @action openModal = (
        content: React.ReactNode,
        options: Partial<Omit<ModalState, 'open' | 'body'>> = {}
    ) => {
        this.modalState = {
            open: true,
            body: content,
            title: options.title,
            size: options.size || 'small',
            className: options.className
        };
    };

    @action closeModal = () => {
        this.modalState = {
            open: false,
            body: null,
            title: undefined,
            size: 'small',
            className: undefined
        };
    };

    setModal = (content: JSX.Element) => {
        this.modal.open = true;
        this.modal.body = content;
    };

    setError = (error: ServerError) => {
        this.error = error;
    };

    clearError = () => {
        this.error = null;
    };
}