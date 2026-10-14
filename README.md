# @nameisjayant/react-native-nativekit

Native device utilities for React Native

## Installation


```sh
npm install @nameisjayant/react-native-nativekit
```


## Usage


```js
import { multiply } from '@nameisjayant/react-native-nativekit';

// ...

const result = multiply(3, 7);
```

### NativeKitButton

A real platform button: Material 3 (Jetpack Compose) on Android, SwiftUI on iOS. Requires the New Architecture.

```tsx
import { NativeKitButton } from '@nameisjayant/react-native-nativekit';

<NativeKitButton
  title="Continue"
  variant="filled"
  size="large"
  color="#2E7D32"
  loading={isSubmitting}
  onPress={submit}
/>;
```

| Prop           | Type                                                         | Default     | Description                                                                                  |
| -------------- | ------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------- |
| `title`        | `string`                                                     | —           | Button label.                                                                                |
| `variant`      | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'elevated' \| 'glass'` | `'filled'`  | Visual style. `glass` is Liquid Glass on iOS 26+, a blurred material on older iOS, and `tonal` on Android. |
| `size`         | `'small' \| 'medium' \| 'large'`                             | `'medium'`  | Default height (36 / 44 / 52), padding and font.                                             |
| `color`        | `ColorValue`                                                 | theme       | Background for `filled`/`tonal`/`elevated`, tint for `glass`; label and border color for `outlined`/`text`.     |
| `textColor`    | `ColorValue`                                                 | per variant | Label and spinner color.                                                                     |
| `disabled`     | `boolean`                                                    | `false`     | Disables the button.                                                                         |
| `loading`      | `boolean`                                                    | `false`     | Shows a spinner next to the title and ignores presses.                                       |
| `cornerRadius` | `number`                                                     | platform    | Corner radius in pt/dp.                                                                      |
| `fontSize`     | `number`                                                     | per size    | Label font size in pt/sp.                                                                    |
| `fontWeight`   | `'default' \| 'regular' \| 'medium' \| 'semibold' \| 'bold'` | `'default'` | Label font weight.                                                                           |
| `onPress`      | `() => void`                                                 | —           | Called when the button is tapped.                                                            |

It also accepts all `View` props (`style`, `testID`, `accessibilityLabel`, …). By default the button stretches to its parent's width; pass `width`/`height` in `style` to size it yourself.


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
