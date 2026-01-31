export namespace Email {
    export type Language = "pt" | "en" | "es";

    export type Category = 'Productive' | 'Unproductive';

    export type Model = {
        id: string;
        content: string;
        category: Category;
        suggestion: string;
        reasoning: string;
        confidence: number;
        createdAt: Date;
    };

    export namespace State {
        export type Model = {
            currentEmail: Email.Model | null;
            isLoading: boolean;
            error: string | null;
        };
    }
}