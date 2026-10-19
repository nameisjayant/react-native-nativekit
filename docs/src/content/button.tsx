import { CodeBlock } from "@/components/CodeBlock";
import { Table } from "@/components/Table";
import { PACKAGE } from "@/lib/data";

export const sections = [
  { id: "usage", title: "Usage" },
  { id: "variants", title: "Variants" },
  { id: "sizes", title: "Sizes" },
  { id: "colors", title: "Colors" },
  { id: "loading", title: "Loading and disabled" },
  { id: "shape", title: "Shape and typography" },
  { id: "layout", title: "Layout and sizing" },
  { id: "liquid-glass", title: "Liquid Glass" },
  { id: "full-example", title: "Full example" },
  { id: "props", title: "Props" },
  { id: "platform", title: "Platform mapping" },
];

const USAGE = `import { NativeKitButton } from '${PACKAGE}';

<NativeKitButton
  title="Continue"
  variant="filled"
  size="large"
  color="#2E7D32"
  loading={isSubmitting}
  onPress={submit}
/>`;

const VARIANTS = `<NativeKitButton title="Filled"   variant="filled" />
<NativeKitButton title="Tonal"    variant="tonal" />
<NativeKitButton title="Outlined" variant="outlined" />
<NativeKitButton title="Text"     variant="text" />
<NativeKitButton title="Elevated" variant="elevated" />
<NativeKitButton title="Glass"    variant="glass" />`;

const SIZES = `<NativeKitButton title="Small"  size="small" />
<NativeKitButton title="Medium" size="medium" />
<NativeKitButton title="Large"  size="large" />`;

const COLORS = `// Custom background
<NativeKitButton title="Confirm" color="#2E7D32" />

// Custom background + label
<NativeKitButton title="Warning" color="#FFE082" textColor="#4E342E" />

// Accent-colored outline
<NativeKitButton title="Delete" variant="outlined" color="#C62828" />

// Tinted glass
<NativeKitButton title="Explore" variant="glass" color="#6A1B9A" />`;

const LOADING = `const [submitting, setSubmitting] = useState(false);

const submit = async () => {
  setSubmitting(true);
  await api.placeOrder();
  setSubmitting(false);
};

<NativeKitButton
  title={submitting ? 'Placing order…' : 'Place order'}
  loading={submitting}
  onPress={submit}
/>

<NativeKitButton title="Unavailable" disabled />`;

const SHAPE = `// Square corners
<NativeKitButton title="Square" cornerRadius={0} />

// Pill-ish rounded corners
<NativeKitButton title="Rounded" cornerRadius={24} />

// Custom font
<NativeKitButton title="Bold & big" fontSize={20} fontWeight="bold" />`;

const LAYOUT = `// Fixed width, centered
<NativeKitButton
  title="Fixed width"
  style={{ width: 200, alignSelf: 'center' }}
/>

// Custom height
<NativeKitButton title="Tall" style={{ height: 64 }} />

// Side-by-side
<View style={{ flexDirection: 'row', gap: 12 }}>
  <NativeKitButton title="Cancel" variant="outlined" style={{ flex: 1 }} />
  <NativeKitButton title="Save" style={{ flex: 1 }} />
</View>`;

const GLASS = `<ImageBackground source={hero} style={{ padding: 24 }}>
  <NativeKitButton title="Get started" variant="glass" size="large" />
  <NativeKitButton title="Tinted" variant="glass" color="#0A84FF" />
</ImageBackground>`;

const FULL = `import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  NativeKitButton,
  type NativeKitButtonVariant,
} from '${PACKAGE}';

const VARIANTS: NativeKitButtonVariant[] = [
  'filled',
  'tonal',
  'outlined',
  'text',
  'elevated',
  'glass',
];

export default function App() {
  const [lastPressed, setLastPressed] = useState('none');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Last pressed: {lastPressed}</Text>

      {VARIANTS.map((variant) => (
        <NativeKitButton
          key={variant}
          title={variant}
          variant={variant}
          onPress={() => setLastPressed(variant)}
        />
      ))}

      <NativeKitButton
        title="Submit"
        size="large"
        color="#2E7D32"
        fontWeight="semibold"
        loading={loading}
        onPress={submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
});`;

const TYPES = `import type {
  NativeKitButtonProps,
  NativeKitButtonVariant,
  NativeKitButtonSize,
  NativeKitButtonFontWeight,
} from '${PACKAGE}';`;

const KOTLIN = `Button(
  onClick = { if (!state.loading) onPress() },
  modifier = Modifier.fillMaxSize(),
  enabled = !state.disabled,
  shape = if (state.cornerRadius >= 0f) RoundedCornerShape(state.cornerRadius.dp)
          else ButtonDefaults.shape,
  colors = ButtonDefaults.buttonColors(containerColor = accent, contentColor = content),
  contentPadding = PaddingValues(horizontal = 24.dp),
) {
  if (state.loading) {
    CircularProgressIndicator(Modifier.size(18.dp), color = LocalContentColor.current, strokeWidth = 2.dp)
    Spacer(Modifier.width(8.dp))
  }
  Text(state.title, style = MaterialTheme.typography.labelLarge, maxLines = 1)
}`;

const SWIFT = `Button(action: { if !model.loading { model.onPress?() } }) {
  HStack(spacing: 8) {
    if model.loading {
      ProgressView().tint(contentColor).controlSize(.small)
    }
    Text(model.title).font(font).lineLimit(1)
  }
  .frame(maxWidth: .infinity, maxHeight: .infinity)
}
.buttonStyle(.borderedProminent)   // varies by \`variant\`
.buttonBorderShape(borderShape)
.controlSize(controlSize)
.tint(accent)
.disabled(model.disabled)`;

export function ButtonDoc() {
  return (
    <>
      <h2 id="usage">Usage</h2>
      <p>
        A real platform button: <strong>Material 3</strong> (Jetpack Compose) on Android and <strong>SwiftUI</strong>{" "}
        on iOS, driven from a single React Native API. You get native ripple, elevation and state layers on Android,
        and native press feedback, materials and Liquid Glass on iOS. It accepts all <code>View</code> props (
        <code>style</code>, <code>testID</code>, <code>accessibilityLabel</code>, …).
      </p>
      <CodeBlock code={USAGE} title="Usage.tsx" />

      <h2 id="variants">Variants</h2>
      <p>Six styles that map to each platform&apos;s native button family.</p>
      <CodeBlock code={VARIANTS} title="Variants" />
      <Table
        head={["Variant", "Android (Compose M3)", "iOS (SwiftUI)"]}
        rows={[
          ["`filled` (default)", "`Button`", "`.borderedProminent`"],
          ["`tonal`", "`FilledTonalButton`", "`.bordered`"],
          ["`outlined`", "`OutlinedButton`", "`.borderless` + stroked border"],
          ["`text`", "`TextButton`", "`.borderless`"],
          ["`elevated`", "`ElevatedButton`", "`.borderedProminent` + shadow"],
          ["`glass`", "`FilledTonalButton` (fallback)", "`.glass` / `.glassProminent` on iOS 26+, `.ultraThinMaterial` blur below"],
        ]}
      />

      <h2 id="sizes">Sizes</h2>
      <CodeBlock code={SIZES} title="Sizes" />
      <Table
        head={["Size", "Default height", "Android padding / text style", "iOS control size / font"]}
        rows={[
          ["`small`", "36", "12dp · `labelMedium`", "`.small` · `.subheadline`"],
          ["`medium` (default)", "44", "24dp · `labelLarge`", "`.regular` · `.body`"],
          ["`large`", "52", "32dp · `titleMedium`", "`.large` · `.title3`"],
        ]}
      />

      <h2 id="colors">Colors</h2>
      <p>
        <code>color</code> is the accent: the <strong>background</strong> for <code>filled</code>, <code>tonal</code>{" "}
        and <code>elevated</code>, the <strong>tint</strong> for <code>glass</code>, and the{" "}
        <strong>label + border</strong> color for <code>outlined</code> and <code>text</code>. <code>textColor</code>{" "}
        overrides the label (and spinner) color.
      </p>
      <CodeBlock code={COLORS} title="Colors" />
      <p className="callout">
        Any React Native <code>ColorValue</code> works: hex, <code>rgb()</code>, named colors, or{" "}
        <code>PlatformColor</code>.
      </p>

      <h2 id="loading">Loading and disabled</h2>
      <p>
        <code>loading</code> shows a native spinner next to the title (<code>CircularProgressIndicator</code> on
        Android, <code>ProgressView</code> on iOS) and ignores presses while active.
      </p>
      <CodeBlock code={LOADING} title="Loading" />

      <h2 id="shape">Shape and typography</h2>
      <CodeBlock code={SHAPE} title="Shape" />
      <p>
        <code>fontWeight</code> accepts <code>&apos;default&apos; | &apos;regular&apos; | &apos;medium&apos; |
        &apos;semibold&apos; | &apos;bold&apos;</code>. Leave <code>cornerRadius</code> unset to keep the
        platform&apos;s default shape (fully rounded on Material 3, automatic on iOS).
      </p>

      <h2 id="layout">Layout and sizing</h2>
      <p>
        Native views can&apos;t report an intrinsic size to Fabric, so <code>NativeKitButton</code> gives itself a
        sensible default frame: it <strong>stretches to its parent&apos;s width</strong> with a height based on{" "}
        <code>size</code>. Anything you pass in <code>style</code> wins.
      </p>
      <CodeBlock code={LAYOUT} title="Layout" />

      <h2 id="liquid-glass">Liquid Glass (iOS 26+)</h2>
      <p>The <code>glass</code> variant adapts to what the device supports:</p>
      <Table
        head={["Platform", "Rendering"]}
        rows={[
          ["iOS 26+", "Apple's **Liquid Glass**: `.glass`, or `.glassProminent` when `color` is set"],
          ["iOS < 26", "Frosted `.ultraThinMaterial` blur with an optional `color` tint and hairline border"],
          ["Android", "Falls back to Material 3 `FilledTonalButton`"],
        ]}
      />
      <CodeBlock code={GLASS} title="Glass" />
      <p className="callout">Glass looks best over imagery or colorful content. Place it on top of a background to see the effect.</p>

      <h2 id="full-example">Full example</h2>
      <CodeBlock code={FULL} title="App.tsx" />

      <h2 id="props">Props</h2>
      <Table
        head={["Prop", "Type", "Default", "Description"]}
        rows={[
          ["`title`", "`string`", "—", "Button label. **Required.**"],
          ["`variant`", "`'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'glass'`", "`'filled'`", "Visual style. See [Variants](#variants)."],
          ["`size`", "`'small' | 'medium' | 'large'`", "`'medium'`", "Default height (36 / 44 / 52), padding and font."],
          ["`color`", "`ColorValue`", "theme", "Background for `filled`/`tonal`/`elevated`, tint for `glass`, label + border for `outlined`/`text`."],
          ["`textColor`", "`ColorValue`", "per variant", "Label and spinner color."],
          ["`disabled`", "`boolean`", "`false`", "Disables the button and renders its disabled state."],
          ["`loading`", "`boolean`", "`false`", "Shows a spinner next to the title and ignores presses."],
          ["`cornerRadius`", "`number`", "platform", "Corner radius in pt/dp."],
          ["`fontSize`", "`number`", "per size", "Label font size in pt/sp."],
          ["`fontWeight`", "`'default' | 'regular' | 'medium' | 'semibold' | 'bold'`", "`'default'`", "Label font weight."],
          ["`onPress`", "`() => void`", "—", "Called when the button is tapped."],
          ["`...ViewProps`", "`ViewProps`", "—", "`style`, `testID`, `accessibilityLabel`, etc."],
        ]}
      />
      <p>All types are exported:</p>
      <CodeBlock code={TYPES} title="TypeScript" />

      <h2 id="platform">Platform mapping</h2>
      <p>
        <strong>Android, Jetpack Compose (Material 3).</strong> Each button is rendered by a Compose{" "}
        <code>ComposeView</code> inside <code>MaterialTheme</code>. A trimmed look at what the <code>filled</code>{" "}
        variant renders:
      </p>
      <CodeBlock code={KOTLIN} lang="kotlin" title="NativeKitButton.kt" />
      <ul>
        <li>Ripple, state layers and elevation come straight from Material 3.</li>
        <li>Colors left unset fall back to the Material theme&apos;s color scheme.</li>
        <li><code>glass</code> has no Android equivalent and renders as <code>FilledTonalButton</code>.</li>
      </ul>
      <p>
        <strong>iOS, SwiftUI.</strong> Each button is a SwiftUI <code>Button</code> hosted in a{" "}
        <code>UIHostingController</code> inside the Fabric component view. A trimmed look:
      </p>
      <CodeBlock code={SWIFT} lang="swift" title="NativeKitButton.swift" />
      <ul>
        <li>Uses the system accent color when <code>color</code> is not set.</li>
        <li><code>glass</code> uses <code>.glass</code> / <code>.glassProminent</code> on iOS 26+ and a <code>.ultraThinMaterial</code> blur on older versions.</li>
      </ul>
    </>
  );
}
