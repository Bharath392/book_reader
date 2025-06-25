import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/contexts/ThemeContext';
import type { Document } from '@/types/document';

interface PdfViewerProps {
  document: Document;
  onTripleTap: () => void;
  onWordSelect: (word: string, position: { x: number; y: number }) => void;
}

export function PdfViewer({ document, onTripleTap, onWordSelect }: PdfViewerProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'TRIPLE_TAP') {
        onTripleTap();
      } else if (data.type === 'WORD_SELECT') {
        onWordSelect(data.word, data.position);
      }
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  };

  const pdfViewerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${colors.background};
          color: ${colors.text};
          line-height: 1.6;
        }
        .pdf-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .pdf-embed {
          width: 100%;
          height: 100%;
          border: none;
        }
        .fallback {
          text-align: center;
          padding: 40px;
        }
        .fallback-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
          color: ${colors.text};
        }
        .fallback-subtitle {
          font-size: 16px;
          color: ${colors.textSecondary};
          margin-bottom: 24px;
        }
        .open-button {
          background-color: ${colors.primary};
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .selected-word {
          background-color: ${colors.primary}33;
          padding: 2px 4px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <div class="fallback">
          <div class="fallback-title">PDF Viewer</div>
          <div class="fallback-subtitle">${document.name}</div>
          <p style="color: ${colors.textSecondary}; margin-bottom: 24px;">
            Triple-tap anywhere to show the menu bar.<br>
            Swipe over text to look up word definitions.
          </p>
          <a href="${document.uri}" target="_blank" class="open-button">
            Open PDF
          </a>
        </div>
      </div>

      <script>
        let tapCount = 0;
        let tapTimeout;

        document.addEventListener('click', function(e) {
          tapCount++;
          
          if (tapCount === 1) {
            tapTimeout = setTimeout(function() {
              tapCount = 0;
            }, 500);
          } else if (tapCount === 3) {
            clearTimeout(tapTimeout);
            tapCount = 0;
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'TRIPLE_TAP'
            }));
          }
        });

        document.addEventListener('mouseup', function(e) {
          const selection = window.getSelection();
          const selectedText = selection.toString().trim();
          
          if (selectedText && selectedText.split(' ').length === 1) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'WORD_SELECT',
              word: selectedText,
              position: {
                x: rect.left + rect.width / 2,
                y: rect.top
              }
            }));
          }
        });

        // Touch events for mobile
        let touchStartTime = 0;
        let touchCount = 0;

        document.addEventListener('touchstart', function(e) {
          const now = Date.now();
          if (now - touchStartTime < 500) {
            touchCount++;
          } else {
            touchCount = 1;
          }
          touchStartTime = now;

          if (touchCount === 3) {
            touchCount = 0;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'TRIPLE_TAP'
            }));
          }
        });
      </script>
    </body>
    </html>
  `;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    webView: {
      flex: 1,
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load PDF</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        source={{ html: pdfViewerHtml }}
        onMessage={handleMessage}
        onError={(e) => setError(e.nativeEvent.description)}
        onLoad={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
      />
    </View>
  );
}