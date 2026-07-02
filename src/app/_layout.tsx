import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useBootstrap } from '@/store/bootstrap';

import '@/global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const ready = useBootstrap();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {ready ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="entry" options={{ presentation: 'modal' }} />
            <Stack.Screen name="category-edit" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" />
            <Stack.Screen name="categories" />
          </Stack>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
