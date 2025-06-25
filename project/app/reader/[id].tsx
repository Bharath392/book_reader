import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useDocument } from '@/contexts/DocumentContext';
import { DocumentViewer } from '@/components/DocumentViewer';
import { WordLookupModal } from '@/components/WordLookupModal';
import { MenuBar } from '@/components/MenuBar';
import { useState, useEffect } from 'react';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark, toggleTheme } = useTheme();
  const { documents } = useDocument();
  const router = useRouter();
  
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const document = documents.find(doc => doc.id === id);

  useEffect(() => {
    if (!document) {
      Alert.alert('Error', 'Document not found');
      router.back();
    }
  }, [document]);

  const handleTripleTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setShowMenuBar(!showMenuBar);
        return 0;
      }
      return newCount;
    });

    // Reset tap count after 500ms
    setTimeout(() => setTapCount(0), 500);
  };

  const handleWordSelect = (word: string, position: { x: number; y: number }) => {
    setSelectedWord(word);
    setWordPosition(position);
  };

  const handleCloseWordLookup = () => {
    setSelectedWord(null);
    setWordPosition(null);
  };

  if (!document) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {document.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <MenuBar
        visible={showMenuBar}
        onClose={() => setShowMenuBar(false)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <View style={styles.content}>
        <DocumentViewer
          document={document}
          onTripleTap={handleTripleTap}
          onWordSelect={handleWordSelect}
        />
      </View>

      <WordLookupModal
        word={selectedWord}
        position={wordPosition}
        onClose={handleCloseWordLookup}
      />
    </SafeAreaView>
  );
}