import { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import NativeKitBottomSheetNativeComponent from './NativeKitBottomSheetNativeComponent';
import type {
  NativeKitBottomSheetProps,
  NativeKitBottomSheetState,
  NativeKitBottomSheetVariant,
} from './NativeKitBottomSheet.types';

/** Variants whose sheet is taller than its content, so the content is stretched to fill it. */
const FILL_VARIANTS: ReadonlySet<NativeKitBottomSheetVariant> = new Set([
  'halfExpanded',
  'expanded',
  'fullScreen',
]);

type SheetSize = { width: number; height: number };

export function NativeKitBottomSheet({
  visible,
  variant = 'modal',
  backgroundColor,
  actions,
  style,
  children,
  onDismiss,
  onStateChange,
  onActionPress,
  ...rest
}: NativeKitBottomSheetProps) {
  const window = useWindowDimensions();
  // The size the native sheet gives its content; window size until the sheet reports it.
  const [sheetSize, setSheetSize] = useState<SheetSize | null>(null);

  const handleSheetLayout = useCallback(
    ({ nativeEvent }: { nativeEvent: SheetSize }) => {
      const { width, height } = nativeEvent;
      setSheetSize((current) =>
        current &&
        Math.abs(current.width - width) < 0.5 &&
        Math.abs(current.height - height) < 0.5
          ? current
          : { width, height }
      );
    },
    []
  );

  const width = sheetSize?.width ?? window.width;
  const height = sheetSize?.height ?? window.height;
  const fills = FILL_VARIANTS.has(variant);

  return (
    <NativeKitBottomSheetNativeComponent
      {...rest}
      visible={visible}
      variant={variant}
      sheetBackgroundColor={backgroundColor}
      actions={actions?.map(({ title, role, disabled }) => ({
        title,
        role,
        disabled,
      }))}
      // The native side moves the children into the sheet, so the host itself is never visible.
      // It only gives Yoga the frame to lay the content out in.
      style={[
        styles.host,
        { width },
        fills ? { height } : { maxHeight: height },
      ]}
      onSheetLayout={handleSheetLayout}
      onSheetDismiss={onDismiss ? () => onDismiss() : undefined}
      onSheetStateChange={
        onStateChange
          ? ({ nativeEvent }) =>
              onStateChange(nativeEvent.state as NativeKitBottomSheetState)
          : undefined
      }
      onActionPress={({ nativeEvent: { index } }) => {
        const action = actions?.[index];
        if (!action) return;
        action.onPress?.();
        onActionPress?.(index, action);
      }}
    >
      {variant === 'actionSheet' ? null : (
        <View collapsable={false} style={[fills && styles.fill, style]}>
          {children}
        </View>
      )}
    </NativeKitBottomSheetNativeComponent>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  fill: {
    flex: 1,
  },
});
