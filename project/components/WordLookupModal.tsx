import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { WordDefinition } from '@/types/document';

interface WordLookupModalProps {
  word: string | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export function WordLookupModal({ word, position, onClose }: WordLookupModalProps) {
  const { colors } = useTheme();
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (word) {
      fetchDefinition(word);
    }
  }, [word]);

  const fetchDefinition = async (searchWord: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setDefinition(data[0]);
      } else {
        throw new Error('No definition found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch definition');
    } finally {
      setLoading(false);
    }
  };

  const getFirstDefinition = () => {
    if (!definition || !definition.meanings || definition.meanings.length === 0) {
      return null;
    }
    
    const firstMeaning = definition.meanings[0];
    if (!firstMeaning.definitions || firstMeaning.definitions.length === 0) {
      return null;
    }
    
    return {
      partOfSpeech: firstMeaning.partOfSpeech,
      definition: firstMeaning.definitions[0].definition,
      example: firstMeaning.definitions[0].example,
    };
  };

  const firstDef = getFirstDefinition();

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      maxWidth: 320,
      width: '100%',
      maxHeight: '80%',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    word: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    partOfSpeech: {
      fontSize: 14,
      color: colors.primary,
      fontStyle: 'italic',
      marginBottom: 8,
      textTransform: 'capitalize',
    },
    definition: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 12,
    },
    exampleLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    example: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textSecondary,
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
    },
    scrollView: {
      maxHeight: 200,
    },
  });

  if (!word) {
    return null;
  }

  return (
    <Modal
      visible={!!word}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modal} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <View style={styles.header}>
            <Text style={styles.word}>{word}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Looking up definition...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {firstDef && !loading && !error && (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.partOfSpeech}>{firstDef.partOfSpeech}</Text>
              <Text style={styles.definition}>{firstDef.definition}</Text>
              
              {firstDef.example && (
                <>
                  <Text style={styles.exampleLabel}>Example:</Text>
                  <Text style={styles.example}>"{firstDef.example}"</Text>
                </>
              )}
            </ScrollView>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}