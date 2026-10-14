import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { multiply, NativekitView } from '@nameisjayant/react-native-nativekit';

const result = multiply(3, 7);

export default function App() {
  const [presses, setPresses] = useState(0);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <NativekitView
        style={styles.nativeView}
        title={`Native button · ${presses}`}
        onPress={() => setPresses((count) => count + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  nativeView: {
    width: 280,
    height: 80,
  },
});
