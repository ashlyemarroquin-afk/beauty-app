import * as React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from "react-native-reanimated";

interface SliderProps extends Omit<ViewProps, "onValueChange"> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<View, SliderProps>(
  ({ value = [0], onValueChange, min = 0, max = 100, step = 1, style, disabled = false, ...props }, ref) => {
    const [sliderWidth, setSliderWidth] = React.useState(0);
    const position = useSharedValue(0);

    React.useEffect(() => {
      if (sliderWidth > 0) {
        const percentage = ((value[0] - min) / (max - min)) * sliderWidth;
        position.value = withSpring(percentage, { damping: 15 });
      }
    }, [value, sliderWidth, min, max]);

    const updateValue = (newPosition: number) => {
      if (disabled || !onValueChange) return;

      const percentage = Math.max(0, Math.min(newPosition / sliderWidth, 1));
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (clampedValue !== value[0]) {
        onValueChange([clampedValue]);
      }
    };

    const gesture = Gesture.Pan()
      .enabled(!disabled)
      .onUpdate((event) => {
        position.value = Math.max(0, Math.min(event.x, sliderWidth));
      })
      .onEnd((event) => {
        runOnJS(updateValue)(event.x);
      });

    const thumbStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: position.value }],
    }));

    const trackFillStyle = useAnimatedStyle(() => ({
      width: position.value,
    }));

    return (
      <View
        ref={ref}
        style={[styles.container, disabled && styles.disabled, style]}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        {...props}
      >
        <GestureDetector gesture={gesture}>
          <View style={styles.track}>
            <Animated.View style={[styles.trackFill, trackFillStyle]} />
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </View>
        </GestureDetector>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    position: "relative",
  },
  trackFill: {
    height: "100%",
    backgroundColor: "#030213",
    borderRadius: 2,
    position: "absolute",
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#030213",
    borderRadius: 10,
    top: -8,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

Slider.displayName = "Slider";

export { Slider };
