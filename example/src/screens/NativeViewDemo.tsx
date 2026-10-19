import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { multiply, NativekitView } from '@nameisjayant/react-native-nativekit';
import { Body, Screen, Section } from '../components/Layout';

const result = multiply(3, 7);

export default function NativeViewDemo({ onBack }: { onBack: () => void }) {
  const [presses, setPresses] = useState(0);

  return (
    <Screen title="Native View" onBack={onBack}>
      <Section title="Template">
        <Body>multiply(3, 7) = {result}</Body>
        <NativekitView
          style={styles.nativeView}
          title={`Native button · ${presses}`}
          onPress={() => setPresses((count) => count + 1)}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nativeView: {
    width: 280,
    height: 80,
    alignSelf: 'center',
  },
});
