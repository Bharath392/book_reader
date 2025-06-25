import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface MenuBarProps {
  visible: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function MenuBar({ visible, onClose, onToggleTheme, isDark }: MenuBarProps) {
  const { colors } = useTheme();
  const translateY = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.background,
      marginLeft: 12,
    },
    themeText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 8,
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 14,
      color: colors.primary,
    },
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.title}>Reader Options</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.themeButton} onPress={onToggleTheme}>
          {isDark ? (
            <Sun size={20} color={colors.text} />
          ) : (
            <Moon size={20} color={colors.text} />
          )}
          <Text style={styles.themeText}>
            {isDark ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}