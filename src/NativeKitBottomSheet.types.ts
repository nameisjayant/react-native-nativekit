import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Presentation style of the sheet.
 *
 * | Variant | Android (Compose M3) | iOS (UIKit sheets) |
 * | ------- | -------------------- | ------------------ |
 * | `modal` | `ModalBottomSheet` sized to its content | Sheet with a content-fit detent (iOS 16+) |
 * | `halfExpanded` | `ModalBottomSheet` opening half-expanded | `.medium` detent, expandable to `.large` |
 * | `expanded` | `ModalBottomSheet` filling the screen height | `.large` detent |
 * | `fullScreen` | Edge-to-edge `ModalBottomSheet`, square corners | Full-screen cover |
 * | `persistent` | Non-modal standard sheet that can't be hidden | Undimmed drawer that can't be dismissed |
 * | `expandable` | Non-modal standard sheet: peek / expand / hide | Undimmed drawer: peek / expand / dismiss |
 * | `actionSheet` | `ModalBottomSheet` with a native action list | `UIAlertController` action sheet |
 */
export type NativeKitBottomSheetVariant =
  | 'modal'
  | 'halfExpanded'
  | 'expanded'
  | 'fullScreen'
  | 'persistent'
  | 'expandable'
  | 'actionSheet';

/**
 * Resting position of the sheet, reported through `onStateChange`.
 * `collapsed` is the peek position of `persistent` / `expandable` sheets.
 */
export type NativeKitBottomSheetState =
  'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';

export type NativeKitBottomSheetActionRole =
  'default' | 'cancel' | 'destructive';

export type NativeKitBottomSheetAction = {
  /** Label of the action row. */
  title: string;
  /**
   * `destructive` is drawn in the error/red color. `cancel` is separated from the other
   * actions (the bottom button on iOS, the last row on Android). Defaults to `default`.
   */
  role?: NativeKitBottomSheetActionRole;
  /** Renders the action disabled. */
  disabled?: boolean;
  /** Called when the action is chosen, right before the sheet dismisses. */
  onPress?: () => void;
};

export type NativeKitBottomSheetProps = Omit<ViewProps, 'style'> & {
  /** Whether the sheet is presented. The sheet is controlled: update this from `onDismiss`. */
  visible: boolean;
  /** Presentation style. Defaults to `modal`. */
  variant?: NativeKitBottomSheetVariant;
  /**
   * Whether the user can dismiss the sheet by swiping down, tapping the scrim or pressing back.
   * Defaults to `true`. `persistent` sheets are never user-dismissible.
   */
  dismissible?: boolean;
  /** Shows the drag handle / grabber. Defaults to `true` (ignored by `fullScreen` and `actionSheet`). */
  showDragHandle?: boolean;
  /** Top corner radius in dp/pt. Omit to keep the platform default. */
  cornerRadius?: number;
  /** Sheet background color. Defaults to the platform's sheet surface color. */
  backgroundColor?: ColorValue;
  /**
   * Visible height (dp/pt) of a `persistent` or `expandable` sheet when collapsed.
   * Defaults to 120. Needs iOS 16+; iOS 15 uses the `.medium` detent instead.
   */
  peekHeight?: number;
  /** `actionSheet` header title. */
  title?: string;
  /** `actionSheet` header message. */
  message?: string;
  /** Rows of the `actionSheet` variant. */
  actions?: NativeKitBottomSheetAction[];
  /** Style of the view wrapping `children` inside the sheet. */
  style?: StyleProp<ViewStyle>;
  /**
   * Called when the sheet was dismissed natively: by a swipe, the scrim, the back button, or an
   * `actionSheet` action. Set `visible` to `false` here.
   */
  onDismiss?: () => void;
  /** Called when the sheet settles in a new position. */
  onStateChange?: (state: NativeKitBottomSheetState) => void;
  /** Called with the index of the chosen `actionSheet` action. */
  onActionPress?: (index: number, action: NativeKitBottomSheetAction) => void;
  /** Sheet content. Ignored by the `actionSheet` variant. */
  children?: ReactNode;
};
