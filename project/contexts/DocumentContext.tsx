import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Document } from '@/types/document';

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  getDocument: (id: string) => Document | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = (document: Document) => {
    setDocuments(prev => {
      // Check if document already exists
      const exists = prev.some(doc => doc.uri === document.uri);
      if (exists) return prev;
      
      return [...prev, document];
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      removeDocument,
      getDocument,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
}