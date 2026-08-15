import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../shared/constants/theme';

/**
 * Root layout wrapping all screens with navigation.
 * Uses Stack navigator for modal presentation of Add screen.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}
