import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

export default function App() {
  const [presses, setPresses] = useState(0);
  const [isSquareShown, setIsSquareShown] = useState(false);
  const [pressIns, setPressIns] = useState(0);
  const [pressOuts, setPressOuts] = useState(0);
  const [longPresses, setLongPresses] = useState(0);

  return (
    <View style={styles.screen}>
      <Svg width={240} height={120}>
        {/* One pressable shape is enough for the six console errors. */}
        <Circle
          testID="circle"
          cx={60}
          cy={60}
          r={40}
          fill="tomato"
          onPress={() => setPresses((count) => count + 1)}
        />
        {isSquareShown && (
          <Rect
            testID="square"
            x={140}
            y={20}
            width={80}
            height={80}
            fill="steelblue"
            onPressIn={() => setPressIns((count) => count + 1)}
            onPressOut={() => setPressOuts((count) => count + 1)}
            onLongPress={() => setLongPresses((count) => count + 1)}
          />
        )}
      </Svg>
      <Text testID="circle-count">Circle onPress: {presses}</Text>
      {isSquareShown ? (
        <Text testID="square-count">
          Square onPressIn: {pressIns}, onPressOut: {pressOuts}, onLongPress: {longPresses}
        </Text>
      ) : (
        <Button
          title="Add a square with onPressIn, onPressOut and onLongPress"
          onPress={() => setIsSquareShown(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
