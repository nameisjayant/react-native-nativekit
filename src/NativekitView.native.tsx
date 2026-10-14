import NativekitViewNativeComponent, {
  type NativeProps,
} from './NativekitViewNativeComponent';

export type NativekitViewProps = Omit<NativeProps, 'onButtonPress'> & {
  onPress?: () => void;
};

export function NativekitView({ onPress, ...rest }: NativekitViewProps) {
  return (
    <NativekitViewNativeComponent
      {...rest}
      onButtonPress={onPress ? () => onPress() : undefined}
    />
  );
}
