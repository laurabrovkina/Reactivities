export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: IPhoto[];
    following?: boolean;
    followersCount: number;
    followingCount: number;
}

export class ProfileFormValues {
    displayName: string = '';
    bio: string = '';

    constructor(profile?: Profile) {
        if (profile) {
            this.displayName = profile.displayName;
            this.bio = profile.bio || '';
        }
    }
} 