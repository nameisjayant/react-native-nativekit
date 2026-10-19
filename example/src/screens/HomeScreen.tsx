import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Layout';
import { useTheme } from '../components/theme';

export type DemoRoute = 'button' | 'bottomSheet' | 'nativeView';

export const DEMOS: { route: DemoRoute; title: string; description: string }[] =
  [
    {
      route: 'button',
      title: 'Button',
      description: 'Variants, sizes, colors, shapes, disabled and loading.',
    },
    {
      route: 'bottomSheet',
      title: 'Bottom Sheet',
      description:
        'Modal, expanded, full screen, persistent and action sheets.',
    },
    {
      route: 'nativeView',
      title: 'Native View',
      description: 'The template native view and module.',
    },
  ];

export default function HomeScreen({
  onOpen,
}: {
  onOpen: (route: DemoRoute) => void;
}) {
  const theme = useTheme();
  return (
    <Screen title="NativeKit">
      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
        Native components for React Native. Tap one to see its demo.
      </Text>
      <View style={styles.list}>
        {DEMOS.map((demo) => (
          <Pressable
            key={demo.route}
            onPress={() => onOpen(demo.route)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: theme.card },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {demo.title}
              </Text>
              <Text
                style={[styles.cardDescription, { color: theme.secondaryText }]}
              >
                {demo.description}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.tertiaryText }]}>
              ›
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 15,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 28,
    marginLeft: 12,
  },
});
