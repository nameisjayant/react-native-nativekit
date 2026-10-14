import { StyleSheet } from 'react-native';
import NativeKitButtonNativeComponent from './NativeKitButtonNativeComponent';
import type {
  NativeKitButtonProps,
  NativeKitButtonSize,
} from './NativeKitButton.types';

const HEIGHTS: Record<NativeKitButtonSize, number> = {
  small: 36,
  medium: 44,
  large: 52,
};

export function NativeKitButton({
  onPress,
  size = 'medium',
  style,
  ...rest
}: NativeKitButtonProps) {
  return (
    <NativeKitButtonNativeComponent
      {...rest}
      size={size}
      // Native views can't report an intrinsic size to Fabric, so give the button a
      // sensible default frame; any width/height in `style` takes precedence.
      style={[styles.button, { height: HEIGHTS[size] }, style]}
      onButtonPress={onPress ? () => onPress() : undefined}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
  },
});
