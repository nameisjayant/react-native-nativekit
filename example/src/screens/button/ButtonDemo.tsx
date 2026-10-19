import { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  NativeKitButton,
  type NativeKitButtonSize,
  type NativeKitButtonVariant,
} from '@nameisjayant/react-native-nativekit';
import { Screen, Section, Status, Toggle } from '../../components/Layout';

const VARIANTS: NativeKitButtonVariant[] = [
  'filled',
  'tonal',
  'outlined',
  'text',
  'elevated',
  'glass',
];
const SIZES: NativeKitButtonSize[] = ['small', 'medium', 'large'];

export default function ButtonDemo({ onBack }: { onBack: () => void }) {
  const [lastPressed, setLastPressed] = useState('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const press = (name: string) => () => setLastPressed(name);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Screen title="Button" onBack={onBack}>
      <Status>Last pressed: {lastPressed}</Status>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  fixedWidth: {
    width: 180,
    alignSelf: 'center',
  },
});
