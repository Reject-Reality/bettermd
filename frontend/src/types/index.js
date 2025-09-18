export interface TemplateInfo {
  name: string;
  title: string;
  description: string;
  author: string;
  version: string;
  tags: string[];
  created_at: string;
}

export interface MarkdownProcessResponse {
  filename: string;
  html_content: string;
  template?: string;
}