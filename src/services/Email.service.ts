import { ClassifyRequest, ClassifyFileResponse, ClassifyTextResponse } from "./contracts/Email.contract";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const EmailService = {
  async classify(data: ClassifyRequest): Promise<ClassifyFileResponse | ClassifyTextResponse> {
    if (data.file) {
      const formData = new FormData();
      formData.append('file', data.file);

      const response = await fetch(`${API_URL}/api/classify/file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to classify email file.');
      }

      return response.json() as Promise<ClassifyFileResponse>;
    }

    if (data.content) {
      const response = await fetch(`${API_URL}/api/classify/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: data.content,
          ...(data.language && { language: data.language })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to classify email text.');
      }

      return response.json() as Promise<ClassifyTextResponse>;
    }

    throw new Error('Either content or file must be provided.');
  }
};
