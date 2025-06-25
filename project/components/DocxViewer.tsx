import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { Document } from '@/types/document';

interface DocxViewerProps {
  document: Document;
  onTripleTap: () => void;
  onWordSelect: (word: string, position: { x: number; y: number }) => void;
}

export function DocxViewer({ document, onTripleTap, onWordSelect }: DocxViewerProps) {
  const { colors } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    loadDocxContent();
  }, [document]);

  const loadDocxContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For web compatibility, we'll show a placeholder
      // In a production app, you'd use mammoth.js or similar to parse DOCX
      setContent(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; line-height: 1.6;">
          <h1 style="color: ${colors.text}; margin-bottom: 20px;">DOCX Document</h1>
          <p style="color: ${colors.textSecondary}; margin-bottom: 20px;">
            <strong>File:</strong> ${document.name}
          </p>
          <div style="background-color: ${colors.surface}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: ${colors.text}; margin: 0;">
              This is a DOCX document viewer. In a production app, the content would be parsed and displayed here.
              You can triple-tap to show the menu bar and swipe over words to look up definitions.
            </p>
          </div>
          <p style="color: ${colors.text}; margin-bottom: 16px;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p style="color: ${colors.text}; margin-bottom: 16px;">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p style="color: ${colors.text};">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      `);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load DOCX content');
      setLoading(false);
    }
  };

  const handleTripleTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        onTripleTap();
        return 0;
      }
      return newCount;
    });

    setTimeout(() => setTapCount(0), 500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
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
    text: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    placeholder: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 8,
      marginBottom: 20,
    },
    placeholderText: {
      color: colors.text,
      lineHeight: 24,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading document...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load DOCX</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} onTouchStart={handleTripleTap}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>DOCX Document</Text>
          <Text style={styles.subtitle}>File: {document.name}</Text>
          
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              This is a DOCX document viewer. In a production app, the content would be parsed and displayed here.
              You can triple-tap to show the menu bar and swipe over words to look up definitions.
            </Text>
          </View>
          
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>
          
          <Text style={styles.text}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>
          
          <Text style={styles.text}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}