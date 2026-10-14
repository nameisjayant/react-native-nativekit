import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  title?: string;
  onPress?: CodegenTypes.DirectEventHandler<null>;
}

export default codegenNativeComponent<NativeProps>('NativekitView');
