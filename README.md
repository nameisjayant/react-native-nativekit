<div align="center">

# @nameisjayant/react-native-nativekit

**Truly native UI components for React Native.**
Jetpack Compose on Android · SwiftUI on iOS · Built for the New Architecture

[![npm version](https://img.shields.io/npm/v/@nameisjayant/react-native-nativekit.svg?style=flat-square)](https://www.npmjs.com/package/@nameisjayant/react-native-nativekit)
[![license](https://img.shields.io/npm/l/@nameisjayant/react-native-nativekit.svg?style=flat-square)](LICENSE)
![platforms](https://img.shields.io/badge/platforms-android%20%7C%20ios-blue.svg?style=flat-square)
![new architecture](https://img.shields.io/badge/new%20architecture-required-success.svg?style=flat-square)

</div>

---

## Installation

```sh
npm install @nameisjayant/react-native-nativekit
# or
yarn add @nameisjayant/react-native-nativekit
```

Then install the iOS pods:

```sh
cd ios && pod install
```

### Requirements

| Platform | Requirement |
| -------- | ----------- |
| React Native | New Architecture (Fabric) enabled |
| Android | `minSdkVersion` 24+, Kotlin 2.x (Jetpack Compose + Material 3 are bundled) |
| iOS | SwiftUI; Liquid Glass needs iOS 26+ and Xcode 26 (Swift 6.2) |

> [!NOTE]
> The components render real platform views, so they are **not** available on web.

---

## Components

### Button

```tsx
import { NativeKitButton } from '@nameisjayant/react-native-nativekit';

<NativeKitButton
  title="Continue"
  variant="filled"
  size="large"
  color="#2E7D32"
  loading={isSubmitting}
  onPress={submit}
/>
```

A real platform button: **Material 3** (Jetpack Compose) on Android and **SwiftUI** on iOS, driven from a single React Native API. You get native ripple, elevation and state layers on Android, and native press feedback, materials and Liquid Glass on iOS. It accepts all `View` props (`style`, `testID`, `accessibilityLabel`, …).

#### Variants

Six styles that map to each platform's native button family.

```tsx
<NativeKitButton title="Filled"   variant="filled" />
<NativeKitButton title="Tonal"    variant="tonal" />
<NativeKitButton title="Outlined" variant="outlined" />
<NativeKitButton title="Text"     variant="text" />
<NativeKitButton title="Elevated" variant="elevated" />
<NativeKitButton title="Glass"    variant="glass" />
```

| Variant | 🤖 Android (Compose M3) | 🍎 iOS (SwiftUI) |
| ------- | ---------------------- | ---------------- |
| `filled` *(default)* | `Button` | `.borderedProminent` |
| `tonal` | `FilledTonalButton` | `.bordered` |
| `outlined` | `OutlinedButton` | `.borderless` + stroked border |
| `text` | `TextButton` | `.borderless` |
| `elevated` | `ElevatedButton` | `.borderedProminent` + shadow |
| `glass` | `FilledTonalButton` *(fallback)* | `.glass` / `.glassProminent` on iOS 26+, `.ultraThinMaterial` blur below |

#### Sizes

```tsx
<NativeKitButton title="Small"  size="small" />
<NativeKitButton title="Medium" size="medium" />
<NativeKitButton title="Large"  size="large" />
```

| Size | Default height | Android padding / text style | iOS control size / font |
| ---- | -------------- | ---------------------------- | ----------------------- |
| `small` | 36 | 12dp · `labelMedium` | `.small` · `.subheadline` |
| `medium` *(default)* | 44 | 24dp · `labelLarge` | `.regular` · `.body` |
| `large` | 52 | 32dp · `titleMedium` | `.large` · `.title3` |

#### Colors

`color` is the accent: the **background** for `filled`, `tonal` and `elevated`, the **tint** for `glass`, and the **label + border** color for `outlined` and `text`. `textColor` overrides the label (and spinner) color.

```tsx
// Custom background
<NativeKitButton title="Confirm" color="#2E7D32" />

// Custom background + label
<NativeKitButton title="Warning" color="#FFE082" textColor="#4E342E" />

// Accent-colored outline
<NativeKitButton title="Delete" variant="outlined" color="#C62828" />

// Tinted glass
<NativeKitButton title="Explore" variant="glass" color="#6A1B9A" />
```

Any React Native `ColorValue` works — hex, `rgb()`, named colors, or `PlatformColor`.

#### Loading & disabled

`loading` shows a native spinner next to the title (`CircularProgressIndicator` on Android, `ProgressView` on iOS) and ignores presses while active.

```tsx
const [submitting, setSubmitting] = useState(false);

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

<NativeKitButton title="Unavailable" disabled />
```

#### Shape & typography

```tsx
// Square corners
<NativeKitButton title="Square" cornerRadius={0} />

// Pill-ish rounded corners
<NativeKitButton title="Rounded" cornerRadius={24} />

// Custom font
<NativeKitButton title="Bold & big" fontSize={20} fontWeight="bold" />
```

`fontWeight` accepts `'default' | 'regular' | 'medium' | 'semibold' | 'bold'`. Leave `cornerRadius` unset to keep the platform's default shape (fully rounded on Material 3, automatic on iOS).

#### Layout & sizing

Native views can't report an intrinsic size to Fabric, so `NativeKitButton` gives itself a sensible default frame: it **stretches to its parent's width** with a height based on `size`. Anything you pass in `style` wins.

```tsx
// Fixed width, centered
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
</View>
```

#### Liquid Glass (iOS 26+)

The `glass` variant adapts to what the device supports:

| Platform | Rendering |
| -------- | --------- |
| iOS 26+ | Apple's **Liquid Glass** — `.glass`, or `.glassProminent` when `color` is set |
| iOS < 26 | Frosted `.ultraThinMaterial` blur with an optional `color` tint and hairline border |
| Android | Falls back to Material 3 `FilledTonalButton` |

```tsx
<ImageBackground source={hero} style={{ padding: 24 }}>
  <NativeKitButton title="Get started" variant="glass" size="large" />
  <NativeKitButton title="Tinted" variant="glass" color="#0A84FF" />
</ImageBackground>
```

> [!TIP]
> Glass looks best over imagery or colorful content — place it on top of a background to see the effect.

#### Full example

```tsx
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  NativeKitButton,
  type NativeKitButtonVariant,
} from '@nameisjayant/react-native-nativekit';

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
});
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | — | Button label. **Required.** |
| `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'elevated' \| 'glass'` | `'filled'` | Visual style. See [Variants](#variants). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Default height (36 / 44 / 52), padding and font. |
| `color` | `ColorValue` | theme | Background for `filled`/`tonal`/`elevated`, tint for `glass`, label + border for `outlined`/`text`. |
| `textColor` | `ColorValue` | per variant | Label and spinner color. |
| `disabled` | `boolean` | `false` | Disables the button and renders its disabled state. |
| `loading` | `boolean` | `false` | Shows a spinner next to the title and ignores presses. |
| `cornerRadius` | `number` | platform | Corner radius in pt/dp. |
| `fontSize` | `number` | per size | Label font size in pt/sp. |
| `fontWeight` | `'default' \| 'regular' \| 'medium' \| 'semibold' \| 'bold'` | `'default'` | Label font weight. |
| `onPress` | `() => void` | — | Called when the button is tapped. |
| `...ViewProps` | `ViewProps` | — | `style`, `testID`, `accessibilityLabel`, etc. |

#### TypeScript

All types are exported:

```ts
import type {
  NativeKitButtonProps,
  NativeKitButtonVariant,
  NativeKitButtonSize,
  NativeKitButtonFontWeight,
} from '@nameisjayant/react-native-nativekit';
```

#### Platform mapping

<details>
<summary><b>🤖 Android — Jetpack Compose (Material 3)</b></summary>

<br />

Each button is rendered by a Compose `ComposeView` inside `MaterialTheme`. A trimmed look at what the `filled` variant renders:

```kotlin
Button(
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
}
```

- Ripple, state layers and elevation come straight from Material 3.
- Colors left unset fall back to the Material theme's color scheme.
- `glass` has no Android equivalent and renders as `FilledTonalButton`.

</details>

<details>
<summary><b>🍎 iOS — SwiftUI</b></summary>

<br />

Each button is a SwiftUI `Button` hosted in a `UIHostingController` inside the Fabric component view. A trimmed look:

```swift
Button(action: { if !model.loading { model.onPress?() } }) {
  HStack(spacing: 8) {
    if model.loading {
      ProgressView().tint(contentColor).controlSize(.small)
    }
    Text(model.title).font(font).lineLimit(1)
  }
  .frame(maxWidth: .infinity, maxHeight: .infinity)
}
.buttonStyle(.borderedProminent)   // varies by `variant`
.buttonBorderShape(borderShape)
.controlSize(controlSize)
.tint(accent)
.disabled(model.disabled)
```

- Uses the system accent color when `color` is not set.
- `glass` uses `.glass` / `.glassProminent` on iOS 26+ and a `.ultraThinMaterial` blur on older versions.

</details>

---

## Other APIs

```js
import { multiply } from '@nameisjayant/react-native-nativekit';

const result = multiply(3, 7);
```

---

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

Run the example app:

```sh
yarn            # install dependencies
yarn android    # run the example on Android
yarn ios        # run the example on iOS
```

## License

MIT © [Jayant Kumar](https://github.com/nameisjayant)

---

<div align="center">

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

</div>
