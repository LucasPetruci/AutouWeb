import { ClassifyEmail } from './contracts/Email.contract';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const route = '/api/classify';

export const classifyEmail = (
    body: ClassifyEmail.Body
): Promise<ClassifyEmail.Response> => {
    if (body.file) {
        const formData = new FormData();
        formData.append('file', body.file);

        return fetch(`${API_URL}${route}/file`, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.json()
                        .then(errorData => {
                            throw new Error(errorData.detail || 'Failed to classify email file.');
                        })
                        .catch(() => {
                            throw new Error('Failed to classify email file.');
                        });
                }
                return response.json() as Promise<ClassifyEmail.File.Response>;
            });
    }

    if (body.content) {
        return fetch(`${API_URL}${route}/text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                content: body.content,
                ...(body.language && { language: body.language })
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json()
                        .then(errorData => {
                            throw new Error(errorData.detail || 'Failed to classify email text.');
                        })
                        .catch(() => {
                            throw new Error('Failed to classify email text.');
                        });
                }
                return response.json() as Promise<ClassifyEmail.Text.Response>;
            });
    }

    throw new Error('Either content or file must be provided.');
};
