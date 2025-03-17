import { Profile } from './profile';

export interface Activity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    host?: Profile;
    isHost?: boolean;
    isGoing?: boolean;
    attendees?: Profile[];
}

export interface ActivityFormValues {
    id?: string;
    title: string;
    description: string;
    category: string;
    date?: Date;
    time?: Date;
    city: string;
    venue: string;
}

export class ActivityFormError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ActivityFormError';
    }
}

export class ActivityForm {
    private readonly _values: ActivityFormValues;

    private constructor(values: ActivityFormValues) {
        this._values = values;
    }

    get values(): ActivityFormValues {
        return { ...this._values };
    }

    get isNew(): boolean {
        return !this._values.id;
    }

    get combinedDateTime(): Date {
        if (!this._values.date || !this._values.time) {
            throw new ActivityFormError('Both date and time must be set');
        }

        const date = new Date(this._values.date);
        const time = new Date(this._values.time);

        if (isNaN(date.getTime()) || isNaN(time.getTime())) {
            throw new ActivityFormError('Invalid date or time format');
        }

        const combined = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            0 // Reset seconds
        );

        if (isNaN(combined.getTime())) {
            throw new ActivityFormError('Failed to combine date and time');
        }

        return combined;
    }

    toActivity(): Activity {
        if (!this._values.id) {
            throw new ActivityFormError('Cannot convert to Activity without an ID');
        }

        return {
            id: this._values.id,
            title: this._values.title,
            description: this._values.description,
            category: this._values.category,
            date: this.combinedDateTime,
            city: this._values.city,
            venue: this._values.venue
        };
    }

    static createEmpty(): ActivityForm {
        return new ActivityForm({
            title: '',
            description: '',
            category: '',
            city: '',
            venue: ''
        });
    }

    static fromActivity(activity: Activity): ActivityForm {
        if (!activity.date) {
            throw new ActivityFormError('Activity must have a date');
        }

        const date = new Date(activity.date);
        
        if (isNaN(date.getTime())) {
            throw new ActivityFormError('Invalid activity date');
        }

        return new ActivityForm({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            category: activity.category,
            date: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ),
            time: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes()
            ),
            city: activity.city,
            venue: activity.venue
        });
    }

    static fromFormValues(values: Partial<ActivityFormValues>): ActivityForm {
        const defaultValues: ActivityFormValues = {
            title: '',
            description: '',
            category: '',
            city: '',
            venue: ''
        };

        return new ActivityForm({
            ...defaultValues,
            ...values,
            date: values.date ? new Date(values.date) : undefined,
            time: values.time ? new Date(values.time) : undefined
        });
    }

    updateField<K extends keyof ActivityFormValues>(
        field: K,
        value: ActivityFormValues[K]
    ): ActivityForm {
        return new ActivityForm({
            ...this._values,
            [field]: value
        });
    }

    setDateTime(date?: Date, time?: Date): ActivityForm {
        return new ActivityForm({
            ...this._values,
            date: date ? new Date(date) : undefined,
            time: time ? new Date(time) : undefined
        });
    }

    validate(): string[] {
        const errors: string[] = [];

        if (!this._values.title) errors.push('Title is required');
        if (!this._values.description) errors.push('Description is required');
        if (!this._values.category) errors.push('Category is required');
        if (!this._values.city) errors.push('City is required');
        if (!this._values.venue) errors.push('Venue is required');
        if (!this._values.date) errors.push('Date is required');
        if (!this._values.time) errors.push('Time is required');

        try {
            this.combinedDateTime;
        } catch (error) {
            if (error instanceof ActivityFormError) {
                errors.push(error.message);
            }
        }

        return errors;
    }
}