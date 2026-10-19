import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import { useTheme } from './theme';

export function Screen({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.header}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12}>
            <Text style={[styles.back, { color: theme.link }]}>‹ Back</Text>
          </Pressable>
        ) : null}
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggle}>
      <Body>{label}</Body>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export function Status({ children }: { children: ReactNode }) {
  return <Body style={styles.status}>{children}</Body>;
}

/** Text in the theme's primary color. */
export function Body({
  style,
  children,
}: {
  style?: TextStyle;
  children: ReactNode;
}) {
  const theme = useTheme();
  return <Text style={[{ color: theme.text }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingVertical: 48,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  back: {
    fontSize: 17,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  status: {
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
