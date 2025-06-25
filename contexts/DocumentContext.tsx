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
    console.log('🔍 DocumentContext: Attempting to add document:', {
      id: document.id,
      name: document.name,
      uri: document.uri,
      type: document.type,
      size: document.size
    });
    
    console.log('📚 DocumentContext: Current documents in library:', documents.length);
    console.log('📚 DocumentContext: Existing URIs:', documents.map(doc => doc.uri));
    
    setDocuments(prev => {
      // Check if document already exists
      const exists = prev.some(doc => doc.uri === document.uri);
      
      if (exists) {
        console.log('⚠️ DocumentContext: Document already exists with URI:', document.uri);
        return prev;
      }
      
      console.log('✅ DocumentContext: Adding new document to library');
      const newDocuments = [...prev, document];
      console.log('📚 DocumentContext: New library size:', newDocuments.length);
      return newDocuments;
    });
  };

  const removeDocument = (id: string) => {
    console.log('🗑️ DocumentContext: Removing document with ID:', id);
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.id !== id);
      console.log('📚 DocumentContext: Library size after removal:', filtered.length);
      return filtered;
    });
  };

  const getDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    console.log('🔍 DocumentContext: Getting document with ID:', id, document ? 'found' : 'not found');
    return document;
  };

  // Log whenever documents array changes
  useEffect(() => {
    console.log('📚 DocumentContext: Documents array updated. Current count:', documents.length);
    console.log('📚 DocumentContext: Current documents:', documents.map(doc => ({ id: doc.id, name: doc.name })));
  }, [documents]);

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