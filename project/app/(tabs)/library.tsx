import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, File, Trash2, BookOpen } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useDocument } from '@/contexts/DocumentContext';
import { useRouter } from 'expo-router';
import type { Document } from '@/types/document';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const { documents, removeDocument } = useDocument();
  const router = useRouter();

  const handleDocumentPress = (document: Document) => {
    router.push(`/reader/${document.id}`);
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to remove this document from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeDocument(id) },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={[styles.documentItem, { backgroundColor: colors.surface }]}
      onPress={() => handleDocumentPress(item)}
    >
      <View style={styles.documentIcon}>
        {item.type === 'pdf' ? (
          <FileText size={32} color={colors.primary} />
        ) : (
          <File size={32} color={colors.secondary} />
        )}
      </View>
      
      <View style={styles.documentInfo}>
        <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.documentDetails, { color: colors.textSecondary }]}>
          {item.type.toUpperCase()} • {formatFileSize(item.size)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteDocument(item.id)}
      >
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    list: {
      paddingHorizontal: 16,
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 4,
      marginHorizontal: 8,
      borderRadius: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    documentIcon: {
      marginRight: 16,
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    documentDetails: {
      fontSize: 14,
    },
    deleteButton: {
      padding: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (documents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <Text style={styles.subtitle}>Your documents</Text>
        </View>
        
        <View style={styles.emptyState}>
          <BookOpen size={64} color={colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Documents</Text>
          <Text style={styles.emptySubtitle}>
            Add PDF and DOCX files from the Home tab to start reading
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}