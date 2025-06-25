import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { PdfViewer } from './PdfViewer';
import { DocxViewer } from './DocxViewer';
import type { Document } from '@/types/document';

interface DocumentViewerProps {
  document: Document;
  onTripleTap: () => void;
  onWordSelect: (word: string, position: { x: number; y: number }) => void;
}

export function DocumentViewer({ document, onTripleTap, onWordSelect }: DocumentViewerProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    errorText: {
      fontSize: 18,
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (document.type === 'pdf') {
    return (
      <View style={styles.container}>
        <PdfViewer
          document={document}
          onTripleTap={onTripleTap}
          onWordSelect={onWordSelect}
        />
      </View>
    );
  }

  if (document.type === 'docx') {
    return (
      <View style={styles.container}>
        <DocxViewer
          document={document}
          onTripleTap={onTripleTap}
          onWordSelect={onWordSelect}
        />
      </View>
    );
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Unsupported file type</Text>
      <Text style={styles.errorSubtext}>
        Only PDF and DOCX files are supported
      </Text>
    </View>
  );
}