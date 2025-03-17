export interface User {
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}

export class UserFormError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserFormError';
    }
}

export class UserForm {
    private readonly _values: UserFormValues;

    private constructor(values: UserFormValues) {
        this._values = values;
    }

    get values(): UserFormValues {
        return { ...this._values };
    }

    get email(): string {
        return this._values.email;
    }

    get password(): string {
        return this._values.password;
    }

    get displayName(): string | undefined {
        return this._values.displayName;
    }

    get username(): string | undefined {
        return this._values.username;
    }

    static createEmpty(): UserForm {
        return new UserForm({
            email: '',
            password: '',
        });
    }

    static fromFormValues(values: Partial<UserFormValues>): UserForm {
        const defaultValues: UserFormValues = {
            email: '',
            password: '',
        };

        return new UserForm({
            ...defaultValues,
            ...values,
        });
    }

    updateField<K extends keyof UserFormValues>(
        field: K,
        value: UserFormValues[K]
    ): UserForm {
        return new UserForm({
            ...this._values,
            [field]: value,
        });
    }

    validate(): string[] {
        const errors: string[] = [];

        if (!this._values.email) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(this._values.email)) {
            errors.push('Invalid email format');
        }

        if (!this._values.password) {
            errors.push('Password is required');
        } else if (this._values.password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export class UserStore {
    private readonly _user: User | null;

    private constructor(user: User | null) {
        this._user = user;
    }

    get currentUser(): User | null {
        return this._user ? { ...this._user } : null;
    }

    get isLoggedIn(): boolean {
        return !!this._user;
    }

    get token(): string | null {
        return this._user?.token ?? null;
    }

    static createEmpty(): UserStore {
        return new UserStore(null);
    }

    static fromUser(user: User): UserStore {
        return new UserStore(user);
    }
}