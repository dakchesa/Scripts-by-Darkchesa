/**
 * Scripts by Darkchesa
 * Mobile Screenplay Writing Application
 *
 * App Entry Point with animated startup splash screen displaying
 * the Darkchesa logo above "Scripts by Darkchesa" briefly on app open.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { THEME, FONTS } from './src/constants/theme';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'editor'
  const [activeScript, setActiveScript] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? THEME.dark : THEME.light;

  // Startup splash animation
  const splashFade = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // 1. Fade in & gently scale up
    Animated.parallel([
      Animated.timing(splashFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(splashScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Brief display duration (~1.8 seconds total), then smoothly dismiss
    const timer = setTimeout(() => {
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissSplash = () => {
    setShowSplash(false);
  };

  const handleOpenScript = (script) => {
    setActiveScript(script);
    setCurrentScreen('editor');
  };

  const handleGoBackToHome = () => {
    setActiveScript(null);
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.root, { backgroundColor: theme.background }]}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ExpoStatusBar style={isDarkMode ? 'light' : 'dark'} />
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />

        {showSplash ? (
          <TouchableOpacity
            style={styles.splashContainer}
            activeOpacity={1}
            onPress={handleDismissSplash}
          >
            <Animated.View
              style={[
                styles.splashContent,
                {
                  opacity: splashFade,
                  transform: [{ scale: splashScale }],
                },
              ]}
            >
              {/* Logo ABOVE the text */}
              <View style={styles.splashLogoContainer}>
                <Image
                  source={require('./assets/darkchesa-logo.png')}
                  style={styles.splashLogo}
                  resizeMode="contain"
                />
              </View>

              {/* Title & Brand */}
              <Text style={styles.splashTitle}>Scripts by Darkchesa</Text>
              <Text style={styles.splashSubtitle}>Professional Screenplay Writer</Text>
              <View style={styles.splashBadge}>
                <Text style={styles.splashBadgeText}>OFFLINE READY</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        ) : currentScreen === 'home' ? (
          <HomeScreen
            onOpenScript={handleOpenScript}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((prev) => !prev)}
            theme={theme}
          />
        ) : (
          <EditorScreen
            initialScript={activeScript}
            onGoBack={handleGoBackToHome}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#33333E',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  splashLogo: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: FONTS.ui,
    letterSpacing: -0.4,
    marginBottom: 6,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 14,
    color: '#9A9AA6',
    fontFamily: FONTS.ui,
    marginBottom: 16,
    textAlign: 'center',
  },
  splashBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 20, 60, 0.18)',
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  splashBadgeText: {
    color: '#DC143C',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    fontFamily: FONTS.ui,
  },
});
