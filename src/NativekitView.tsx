import type { ViewProps } from 'react-native';

export type NativekitViewProps = ViewProps & {
  title?: string;
  onPress?: () => void;
};

export function NativekitView(_props: NativekitViewProps): never {
  throw new Error(
    "'@nameisjayant/react-native-nativekit' is only supported on native platforms."
  );
}
