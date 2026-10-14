import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  title?: string;
  // Not `onPress`: iOS's base view config already registers `topPress` as a bubbling event.
  onButtonPress?: CodegenTypes.DirectEventHandler<null>;
}

export default codegenNativeComponent<NativeProps>('NativekitView');
