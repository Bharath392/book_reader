export interface Document {
  id: string;
  name: string;
  uri: string;
  type: 'pdf' | 'docx';
  size: number;
  dateAdded: Date;
}

export interface WordDefinition {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}