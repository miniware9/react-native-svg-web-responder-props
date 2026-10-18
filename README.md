# react-native-svg-web-responder-props

Minimal reproduction of React Native SVG press-handler issues on web using Expo SDK 58.

## Issue

On web, pressable SVG shapes pass React Native responder props to React DOM, which ignores them and logs `Unknown event handler property` errors in development.

Two issues occur:

1. **Responder warnings:** A `Circle` with `onPress` triggers six warnings for responder handlers added by `react-native-svg`.
2. **Unsupported press handlers:** A `Rect` with `onPressIn`, `onPressOut`, and `onLongPress` triggers three additional warnings. These handlers never fire, even though `onPress` works.

## Environment

- Expo SDK: 58
- React Native: 0.88.0
- React Native Web: 0.21.4
- React Native SVG: 15.16.0
- Browser: Chrome 151 on Linux (Debian 13)
- JavaScript runtime: V8
- Platform: Web

## Steps to reproduce

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the web app:

   ```bash
   npx expo start --web
   ```

3. Open the app in Chrome and open the developer console.

4. Observe six `Unknown event handler property` errors on load, corresponding to these responder handlers:

   - `onStartShouldSetResponder`
   - `onResponderTerminationRequest`
   - `onResponderGrant`
   - `onResponderMove`
   - `onResponderRelease`
   - `onResponderTerminate`

5. Press the circle. Its `onPress` count increases.

6. Press **Add a square with onPressIn, onPressOut and onLongPress**.

7. Observe three additional warnings for `onPressIn`, `onPressOut`, and `onLongPress`.

8. Press the square, then press and hold it for at least one second. The counts for `onPressIn`, `onPressOut`, and `onLongPress` remain at zero.

## Expected behavior

- Pressing the circle invokes `onPress`.
- Pressing the square invokes `onPressIn` and `onPressOut` at the appropriate times.
- Holding the square invokes `onLongPress` after the configured delay.
- React DOM does not receive unsupported React Native responder props.

## Actual behavior

- `onPress` works because `react-native-svg` maps it to `onClick` on web.
- The responder handlers are passed to React DOM and generate warnings in development.
- `onPressIn`, `onPressOut`, and `onLongPress` never fire.
- A production web export does not show the development warnings, but the three handlers still do not work.

## Optional production verification

Export the web app:

```bash
npx expo export --platform web
```

Serve the generated `dist/` directory using a static HTTP server, then repeat the interaction tests.

The circle's `onPress` handler should work, while the square's three press handlers remain ineffective.

## Relevant implementation

The issue involves the following path in `react-native-svg`:

- `src/web/utils/prepare.ts`: `prepare()` adds responder handlers when `hasTouchableProperty(props)` is true.
- `SvgTouchableMixin`: supplies the responder handlers used for touch interactions.
- `WebShape`: renders the prepared props through `react-native-web`'s `unstable_createElement`.

React Native Web handles responder events within its own components rather than through arbitrary props passed to `createElement`. Consequently, the responder props reach React DOM instead of being processed by the responder system.

## Possible direction

Translate press handlers to DOM events on web, following the approach used by React Native Web's `Pressable` and `usePressEvents`.

As an interim measure, omitting the six responder props on web would eliminate their warnings, but would not implement the missing `onPressIn`, `onPressOut`, or `onLongPress` behavior.

## Related issues

- [#1524](https://github.com/software-mansion/react-native-svg/issues/1524)
- [#2302](https://github.com/software-mansion/react-native-svg/issues/2302)
- [#1483](https://github.com/software-mansion/react-native-svg/issues/1483)
- [#2312](https://github.com/software-mansion/react-native-svg/issues/2312)
