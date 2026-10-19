import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  multiply,
  NativekitView,
  NativeKitBottomSheet,
  NativeKitButton,
  type NativeKitBottomSheetAction,
  type NativeKitBottomSheetVariant,
  type NativeKitButtonSize,
  type NativeKitButtonVariant,
} from '@nameisjayant/react-native-nativekit';

const result = multiply(3, 7);

const VARIANTS: NativeKitButtonVariant[] = [
  'filled',
  'tonal',
  'outlined',
  'text',
  'elevated',
  'glass',
];
const SIZES: NativeKitButtonSize[] = ['small', 'medium', 'large'];

const SHEET_VARIANTS: NativeKitBottomSheetVariant[] = [
  'modal',
  'halfExpanded',
  'expanded',
  'fullScreen',
  'persistent',
  'expandable',
];

const SHEET_ACTIONS: NativeKitBottomSheetAction[] = [
  { title: 'Share' },
  { title: 'Duplicate' },
  { title: 'Archive', disabled: true },
  { title: 'Delete', role: 'destructive' },
  { title: 'Cancel', role: 'cancel' },
];

export default function App() {
  const [presses, setPresses] = useState(0);
  const [lastPressed, setLastPressed] = useState('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<NativeKitBottomSheetVariant | null>(null);
  const [sheetState, setSheetState] = useState('hidden');
  const closeSheet = () => setSheet(null);

  const press = (name: string) => () => setLastPressed(name);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Section title="Template">
        <Text>Result: {result}</Text>
        <NativekitView
          style={styles.nativeView}
          title={`Native button · ${presses}`}
          onPress={() => setPresses((count) => count + 1)}
        />
      </Section>

      <Text style={styles.status}>Last pressed: {lastPressed}</Text>

      <Section title="Variants">
        {VARIANTS.map((variant) => (
          <NativeKitButton
            key={variant}
            title={variant}
            variant={variant}
            onPress={press(variant)}
          />
        ))}
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <NativeKitButton
            key={size}
            title={`Size ${size}`}
            size={size}
            onPress={press(`size ${size}`)}
          />
        ))}
      </Section>

      <Section title="Colors">
        <NativeKitButton
          title="Custom color"
          color="#2E7D32"
          onPress={press('green filled')}
        />
        <NativeKitButton
          title="Custom text color"
          color="#FFE082"
          textColor="#4E342E"
          onPress={press('amber filled')}
        />
        <NativeKitButton
          title="Outlined accent"
          variant="outlined"
          color="#C62828"
          onPress={press('red outlined')}
        />
        <NativeKitButton
          title="Tinted glass"
          variant="glass"
          color="#6A1B9A"
          onPress={press('purple glass')}
        />
      </Section>

      <Section title="Shape & typography">
        <NativeKitButton
          title="Square corners"
          cornerRadius={0}
          onPress={press('square')}
        />
        <NativeKitButton
          title="Radius 12 · bold 18"
          cornerRadius={12}
          fontSize={18}
          fontWeight="bold"
          onPress={press('radius 12')}
        />
        <NativeKitButton
          title="Fixed width"
          variant="tonal"
          style={styles.fixedWidth}
          onPress={press('fixed width')}
        />
      </Section>

      <Section title="States">
        <Toggle label="Disabled" value={disabled} onChange={setDisabled} />
        <NativeKitButton
          title="Can be disabled"
          disabled={disabled}
          onPress={press('disabled demo')}
        />
        <NativeKitButton
          title="Outlined, can be disabled"
          variant="outlined"
          disabled={disabled}
          onPress={press('disabled outlined demo')}
        />
        <NativeKitButton
          title={loading ? 'Submitting…' : 'Submit (loads for 2s)'}
          loading={loading}
          onPress={submit}
        />
      </Section>

      <Section title="Bottom sheets">
        <Text>Sheet state: {sheetState}</Text>
        {SHEET_VARIANTS.map((variant) => (
          <NativeKitButton
            key={variant}
            title={`Open ${variant}`}
            variant="tonal"
            onPress={() => setSheet(variant)}
          />
        ))}
        <NativeKitButton
          title="Open actionSheet"
          variant="tonal"
          onPress={() => setSheet('actionSheet')}
        />
      </Section>

      {SHEET_VARIANTS.map((variant) => (
        <NativeKitBottomSheet
          key={variant}
          visible={sheet === variant}
          variant={variant}
          onDismiss={closeSheet}
          onStateChange={setSheetState}
          style={styles.sheetContent}
        >
          <Text style={styles.sheetTitle}>{variant} sheet</Text>
          <Text>
            Rendered by Jetpack Compose on Android and UIKit sheets on iOS, with
            React Native content inside.
          </Text>
          <NativeKitButton
            title="Native button in a sheet"
            onPress={press(`${variant} sheet button`)}
          />
          <NativeKitButton
            title="Close"
            variant="outlined"
            onPress={closeSheet}
          />
        </NativeKitBottomSheet>
      ))}

      <NativeKitBottomSheet
        visible={sheet === 'actionSheet'}
        variant="actionSheet"
        title="Photo options"
        message="Choose what to do with this photo."
        actions={SHEET_ACTIONS}
        onActionPress={(_, action) => press(`action ${action.title}`)()}
        onDismiss={closeSheet}
      />
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Toggle({
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
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 48,
    gap: 24,
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
  nativeView: {
    width: 280,
    height: 80,
    alignSelf: 'center',
  },
  fixedWidth: {
    width: 180,
    alignSelf: 'center',
  },
  sheetContent: {
    padding: 24,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
