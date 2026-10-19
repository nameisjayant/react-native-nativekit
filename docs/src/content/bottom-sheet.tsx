import { CodeBlock } from "@/components/CodeBlock";
import { Table } from "@/components/Table";
import { PACKAGE } from "@/lib/data";

export const sections = [
  { id: "usage", title: "Usage" },
  { id: "variants", title: "Variants" },
  { id: "action-sheet", title: "Action sheet" },
  { id: "customizing", title: "Customizing" },
  { id: "content-sizing", title: "Content sizing" },
  { id: "props", title: "Props" },
];

const USAGE = `import { useState } from 'react';
import { Text } from 'react-native';
import {
  NativeKitBottomSheet,
  NativeKitButton,
} from '${PACKAGE}';

const [open, setOpen] = useState(false);

<NativeKitButton title="Show sheet" onPress={() => setOpen(true)} />

<NativeKitBottomSheet
  visible={open}
  variant="halfExpanded"
  onDismiss={() => setOpen(false)}
  style={{ padding: 24, gap: 12 }}
>
  <Text>Any React Native content</Text>
  <NativeKitButton title="Close" onPress={() => setOpen(false)} />
</NativeKitBottomSheet>`;

const VARIANTS = `<NativeKitBottomSheet variant="modal" />         // sized to its content
<NativeKitBottomSheet variant="halfExpanded" />  // opens at half height, drag up to expand
<NativeKitBottomSheet variant="expanded" />      // opens at full height
<NativeKitBottomSheet variant="fullScreen" />    // covers the whole screen
<NativeKitBottomSheet variant="persistent" />    // non-modal, always on screen
<NativeKitBottomSheet variant="expandable" />    // non-modal, peek / expand / swipe away
<NativeKitBottomSheet variant="actionSheet" actions={[...]} />`;

const ACTION_SHEET = `<NativeKitBottomSheet
  visible={open}
  variant="actionSheet"
  title="Photo options"
  message="Choose what to do with this photo."
  actions={[
    { title: 'Share', onPress: share },
    { title: 'Archive', disabled: true },
    { title: 'Delete', role: 'destructive', onPress: remove },
    { title: 'Cancel', role: 'cancel' },
  ]}
  onDismiss={() => setOpen(false)}
/>`;

const CUSTOMIZING = `<NativeKitBottomSheet
  visible={open}
  variant="expandable"
  peekHeight={160}            // collapsed height of persistent / expandable sheets
  cornerRadius={28}
  backgroundColor="#FFF8E1"
  showDragHandle={false}
  dismissible={false}         // no swipe / scrim / back dismissal
  onStateChange={(state) => console.log(state)} // 'collapsed' | 'halfExpanded' | 'expanded' | 'hidden'
  onDismiss={() => setOpen(false)}
>
  …
</NativeKitBottomSheet>`;

const SCROLL = `<NativeKitBottomSheet visible={open} variant="modal" onDismiss={() => setOpen(false)}>
  <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ padding: 24 }}>
    {items.map((item) => (
      <Text key={item.id}>{item.name}</Text>
    ))}
  </ScrollView>
</NativeKitBottomSheet>`;

const TYPES = `import type {
  NativeKitBottomSheetProps,
  NativeKitBottomSheetVariant,
  NativeKitBottomSheetState,
  NativeKitBottomSheetAction,
  NativeKitBottomSheetActionRole,
} from '${PACKAGE}';`;

export function BottomSheetDoc() {
  return (
    <>
      <h2 id="usage">Usage</h2>
      <p>
        A real platform bottom sheet: <strong>Material 3</strong> sheets (Jetpack Compose) on Android and{" "}
        <strong>UIKit sheets</strong> (<code>UISheetPresentationController</code> / <code>UIAlertController</code>) on
        iOS. Your React Native <code>children</code> are rendered inside the native sheet, so you get native drag
        physics, detents, scrim, back handling and predictive back, while writing the content in React.
      </p>
      <CodeBlock code={USAGE} title="Usage.tsx" />
      <p className="callout">
        The sheet is <strong>controlled</strong>: show it with <code>visible</code>, and set <code>visible</code> back
        to <code>false</code> in <code>onDismiss</code>, which fires whenever the user closes the sheet (swipe, scrim
        tap, back button, or an action-sheet row).
      </p>

      <h2 id="variants">Variants</h2>
      <CodeBlock code={VARIANTS} title="Variants" />
      <Table
        head={["Variant", "Android (Compose M3)", "iOS (UIKit)"]}
        rows={[
          ["`modal` (default)", "`ModalBottomSheet`, wraps content", "Sheet with a content-fit custom detent (iOS 16+, `.large` on iOS 15)"],
          ["`halfExpanded`", "`ModalBottomSheet` with `skipPartiallyExpanded = false`, opens half-expanded", "Detents `[.medium, .large]`, opens at `.medium`"],
          ["`expanded`", "`ModalBottomSheet`, full height", "Detent `[.large]`"],
          ["`fullScreen`", "Edge-to-edge `ModalBottomSheet`, square corners, no drag handle", "`.fullScreen` modal presentation"],
          ["`persistent`", "Standard sheet (`BottomSheetScaffold`), no scrim, can't be hidden by the user", "Undimmed sheet, detents `[peek, content]`, `isModalInPresentation`"],
          ["`expandable`", "Standard sheet: collapsed (peek) / expanded / swipe to hide", "Undimmed sheet, detents `[peek, content]`, swipe to dismiss"],
          ["`actionSheet`", "`ModalBottomSheet` with a Material list of actions", "`UIAlertController` with `.actionSheet` style (popover on iPad)"],
        ]}
      />
      <p>
        <code>persistent</code> and <code>expandable</code> sheets don&apos;t block the screen: the app underneath
        stays scrollable and tappable.
      </p>

      <h2 id="action-sheet">Action sheet</h2>
      <CodeBlock code={ACTION_SHEET} title="ActionSheet.tsx" />
      <p>
        Choosing an action calls its <code>onPress</code> (and <code>onActionPress(index, action)</code>), then closes
        the sheet and fires <code>onDismiss</code>. <code>destructive</code> rows are red; the <code>cancel</code> row
        is separated from the others.
      </p>
      <p className="callout">iOS allows a single <code>cancel</code> action; extra ones are shown as regular rows.</p>

      <h2 id="customizing">Customizing</h2>
      <CodeBlock code={CUSTOMIZING} title="Customizing" />

      <h2 id="content-sizing">Content sizing</h2>
      <p>
        The content is laid out at the sheet&apos;s width. For <code>halfExpanded</code>, <code>expanded</code> and{" "}
        <code>fullScreen</code> it is stretched to the sheet&apos;s height, so <code>flex: 1</code> children (for
        example a <code>ScrollView</code>) fill the sheet.
      </p>
      <p>
        For the other variants the sheet wraps the content, capped at the tallest the sheet can get; give a long{" "}
        <code>ScrollView</code> <code>flexShrink: 1</code> so it scrolls instead of overflowing:
      </p>
      <CodeBlock code={SCROLL} title="Scrolling content" />

      <h2 id="props">Props</h2>
      <Table
        head={["Prop", "Type", "Default", "Description"]}
        rows={[
          ["`visible`", "`boolean`", "—", "Whether the sheet is shown. **Required.**"],
          ["`variant`", "`'modal' | 'halfExpanded' | 'expanded' | 'fullScreen' | 'persistent' | 'expandable' | 'actionSheet'`", "`'modal'`", "Presentation style. See [Variants](#variants)."],
          ["`dismissible`", "`boolean`", "`true`", "Allow dismissing by swipe, scrim tap and back button. `persistent` is never user-dismissible."],
          ["`showDragHandle`", "`boolean`", "`true`", "Drag handle (Android) / grabber (iOS). Not shown by `fullScreen` and `actionSheet`."],
          ["`cornerRadius`", "`number`", "platform", "Top corner radius in dp/pt."],
          ["`backgroundColor`", "`ColorValue`", "platform", "Sheet background color."],
          ["`peekHeight`", "`number`", "`120`", "Collapsed height of `persistent` / `expandable` sheets (iOS 16+; `.medium` on iOS 15)."],
          ["`title` / `message`", "`string`", "—", "`actionSheet` header."],
          ["`actions`", "`NativeKitBottomSheetAction[]`", "—", "`actionSheet` rows: `{ title, role?, disabled?, onPress? }`."],
          ["`style`", "`StyleProp<ViewStyle>`", "—", "Style of the view wrapping `children` inside the sheet."],
          ["`onDismiss`", "`() => void`", "—", "The user dismissed the sheet. Set `visible` to `false` here."],
          ["`onStateChange`", "`(state) => void`", "—", "The sheet settled at `'collapsed'`, `'halfExpanded'`, `'expanded'` or `'hidden'`."],
          ["`onActionPress`", "`(index, action) => void`", "—", "An `actionSheet` action was chosen."],
        ]}
      />
      <p>All types are exported:</p>
      <CodeBlock code={TYPES} title="TypeScript" />
    </>
  );
}
