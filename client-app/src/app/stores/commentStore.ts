import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './store';
import agent from '../api/agent';

export interface Comment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}

export class CommentStore {
    comments: Comment[] = [];
    loading = false;
    submitting = false;

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }

    loadComments = async (activityId: string) => {
        this.loading = true;
        try {
            const comments = await agent.Comments.list(activityId);
            runInAction(() => {
                this.comments = comments;
                this.loading = false;
            });
        } catch (error) {
            console.error('Error loading comments:', error);
            runInAction(() => {
                this.loading = false;
            });
            throw error;
        }
    };

    addComment = async (activityId: string, body: string) => {
        this.submitting = true;
        try {
            const user = this.rootStore.userStore.user!;
            const newComment: Comment = {
                id: Date.now().toString(), // This will be replaced by the server
                createdAt: new Date(),
                body,
                username: user.username,
                displayName: user.displayName,
                image: user.image || '/assets/user.png'
            };

            const createdComment = await agent.Comments.create(activityId, newComment);
            
            runInAction(() => {
                this.comments.unshift(createdComment);
                this.submitting = false;
            });

            return createdComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            runInAction(() => {
                this.submitting = false;
            });
            throw error;
        }
    };

    deleteComment = async (commentId: string) => {
        this.submitting = true;
        try {
            await agent.Comments.delete(commentId);

            runInAction(() => {
                this.comments = this.comments.filter(comment => comment.id !== commentId);
                this.submitting = false;
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            runInAction(() => {
                this.submitting = false;
            });
            throw error;
        }
    };

    clearComments = () => {
        this.comments = [];
        this.loading = false;
        this.submitting = false;
    };
} 