import NativekitViewNativeComponent, {
  type NativeProps,
} from './NativekitViewNativeComponent';

export type NativekitViewProps = Omit<NativeProps, 'onPress'> & {
  onPress?: () => void;
};

export function NativekitView({ onPress, ...rest }: NativekitViewProps) {
  return (
    <NativekitViewNativeComponent
      {...rest}
      onPress={onPress ? () => onPress() : undefined}
    />
  );
}
