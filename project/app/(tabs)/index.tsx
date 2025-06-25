import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Plus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useDocument } from '@/contexts/DocumentContext';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { documents, addDocument } = useDocument();
  const router = useRouter();

  const handleScanForBooks = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true,
      });

      if (!result.canceled) {
        result.assets.forEach((asset) => {
          addDocument({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: asset.name,
            uri: asset.uri,
            type: asset.mimeType?.includes('pdf') ? 'pdf' : 'docx',
            size: asset.size || 0,
            dateAdded: new Date(),
          });
        });
        
        Alert.alert('Success', `Added ${result.assets.length} document(s) to your library`);
        router.push('/library');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select documents');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    hero: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
    },
    scanButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    scanButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    stats: {
      marginTop: 48,
      paddingHorizontal: 24,
    },
    statText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <BookOpen size={64} color={colors.primary} strokeWidth={1.5} />
          <Text style={styles.title}>Document Reader</Text>
          <Text style={styles.subtitle}>
            Select PDF and DOCX files to read with instant word lookup
          </Text>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanForBooks}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Add Documents</Text>
        </TouchableOpacity>

        <View style={styles.stats}>
          <Text style={styles.statText}>
            {documents.length} document{documents.length !== 1 ? 's' : ''} in library
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}