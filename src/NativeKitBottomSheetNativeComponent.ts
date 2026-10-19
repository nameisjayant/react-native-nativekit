import {
  codegenNativeComponent,
  type CodegenTypes,
  type ColorValue,
  type ViewProps,
} from 'react-native';

type ActionSheetAction = Readonly<{
  title: string;
  // A plain string: codegen can't generate enums nested in object arrays.
  // 'default' | 'cancel' | 'destructive'
  role?: string;
  disabled?: CodegenTypes.WithDefault<boolean, false>;
}>;

export interface NativeProps extends ViewProps {
  visible?: CodegenTypes.WithDefault<boolean, false>;
  variant?: CodegenTypes.WithDefault<
    | 'modal'
    | 'halfExpanded'
    | 'expanded'
    | 'fullScreen'
    | 'persistent'
    | 'expandable'
    | 'actionSheet',
    'modal'
  >;
  dismissible?: CodegenTypes.WithDefault<boolean, true>;
  showDragHandle?: CodegenTypes.WithDefault<boolean, true>;
  cornerRadius?: CodegenTypes.WithDefault<CodegenTypes.Float, -1>;
  // Not `backgroundColor`: that one is a style prop and would paint the (invisible) host view.
  sheetBackgroundColor?: ColorValue;
  peekHeight?: CodegenTypes.WithDefault<CodegenTypes.Float, 0>;
  title?: string;
  message?: string;
  actions?: ReadonlyArray<ActionSheetAction>;
  onSheetDismiss?: CodegenTypes.DirectEventHandler<null>;
  onSheetStateChange?: CodegenTypes.DirectEventHandler<
    Readonly<{ state: string }>
  >;
  onActionPress?: CodegenTypes.DirectEventHandler<
    Readonly<{ index: CodegenTypes.Int32 }>
  >;
  /** Size available to the content inside the sheet, so JS can lay children out to fit it. */
  onSheetLayout?: CodegenTypes.DirectEventHandler<
    Readonly<{ width: CodegenTypes.Float; height: CodegenTypes.Float }>
  >;
}

export default codegenNativeComponent<NativeProps>('NativeKitBottomSheet');
