import {
  codegenNativeComponent,
  type CodegenTypes,
  type ColorValue,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  title?: string;
  variant?: CodegenTypes.WithDefault<
    'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'glass',
    'filled'
  >;
  size?: CodegenTypes.WithDefault<'small' | 'medium' | 'large', 'medium'>;
  color?: ColorValue;
  textColor?: ColorValue;
  disabled?: CodegenTypes.WithDefault<boolean, false>;
  loading?: CodegenTypes.WithDefault<boolean, false>;
  cornerRadius?: CodegenTypes.WithDefault<CodegenTypes.Float, -1>;
  fontSize?: CodegenTypes.WithDefault<CodegenTypes.Float, 0>;
  fontWeight?: CodegenTypes.WithDefault<
    'default' | 'regular' | 'medium' | 'semibold' | 'bold',
    'default'
  >;
  // Not `onPress`: iOS's base view config already registers `topPress` as a bubbling event.
  onButtonPress?: CodegenTypes.DirectEventHandler<null>;
}

export default codegenNativeComponent<NativeProps>('NativeKitButton');
