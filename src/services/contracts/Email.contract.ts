import { Email } from "@/src/types/Email";

export namespace ClassifyEmail {
    export type Body = {
        content?: string;
        file?: File;
        language?: string;
    };

    export namespace File {
        export type Classification = {
            category: Email.Category;
            confidence: number;
            suggested_response: string;
            reasoning: string;
            processed_at: string;
        };

        export type Response = {
            filename: string;
            size: number;
            content_extracted: string;
            classification: Classification;
        };
    }

    export namespace Text {
        export type Response = {
            category: Email.Category;
            confidence: number;
            suggested_response: string;
            reasoning: string;
            processed_at: string;
        };
    }

    export type Response = ClassifyEmail.File.Response | ClassifyEmail.Text.Response;
}
