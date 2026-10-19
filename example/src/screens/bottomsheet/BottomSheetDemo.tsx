import { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  NativeKitBottomSheet,
  NativeKitButton,
  type NativeKitBottomSheetAction,
  type NativeKitBottomSheetVariant,
} from '@nameisjayant/react-native-nativekit';
import { Body, Screen, Section, Status } from '../../components/Layout';

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

export default function BottomSheetDemo({ onBack }: { onBack: () => void }) {
  const [lastPressed, setLastPressed] = useState('none');
  const [sheet, setSheet] = useState<NativeKitBottomSheetVariant | null>(null);
  const [sheetState, setSheetState] = useState('hidden');
  const closeSheet = () => setSheet(null);

  const press = (name: string) => () => setLastPressed(name);

  return (
    <Screen title="Bottom Sheet" onBack={onBack}>
      <Status>Last pressed: {lastPressed}</Status>
      <Status>Sheet state: {sheetState}</Status>

      <Section title="Variants">
        {SHEET_VARIANTS.map((variant) => (
          <NativeKitButton
            key={variant}
            title={`Open ${variant}`}
            variant="tonal"
            onPress={() => setSheet(variant)}
          />
        ))}
      </Section>

      <Section title="Action sheet">
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
          <Body style={styles.sheetTitle}>{variant} sheet</Body>
          <Body>
            Rendered by Jetpack Compose on Android and UIKit sheets on iOS, with
            React Native content inside.
          </Body>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    padding: 24,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
});
