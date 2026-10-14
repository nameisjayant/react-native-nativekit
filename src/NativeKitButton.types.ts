import type { ColorValue, ViewProps } from 'react-native';

export type NativeKitButtonVariant =
  'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'glass';

export type NativeKitButtonSize = 'small' | 'medium' | 'large';

export type NativeKitButtonFontWeight =
  'default' | 'regular' | 'medium' | 'semibold' | 'bold';

export type NativeKitButtonProps = ViewProps & {
  /** Label shown inside the button. */
  title: string;
  /**
   * Visual style. Maps to Material 3 buttons on Android and SwiftUI button styles on iOS.
   * `glass` is Liquid Glass on iOS 26+ (a blurred material on older iOS) and falls back
   * to `tonal` on Android.
   */
  variant?: NativeKitButtonVariant;
  /** Controls the default height, padding and font. Defaults to `medium`. */
  size?: NativeKitButtonSize;
  /**
   * Accent color: the background for `filled`, `tonal` and `elevated`, the glass tint for `glass`;
   * the label and border color for `outlined` and `text`.
   */
  color?: ColorValue;
  /** Label (and loading indicator) color. Overrides the variant's default. */
  textColor?: ColorValue;
  /** Disables the button and renders it in its disabled state. */
  disabled?: boolean;
  /** Shows a spinner next to the title and ignores presses. */
  loading?: boolean;
  /** Corner radius in points/dp. Omit to keep the platform's default shape. */
  cornerRadius?: number;
  /** Label font size in points/sp. Omit to use the size's default. */
  fontSize?: number;
  /** Label font weight. Defaults to the platform's button weight. */
  fontWeight?: NativeKitButtonFontWeight;
  onPress?: () => void;
};
