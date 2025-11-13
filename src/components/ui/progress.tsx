import * as React from "react";
import { View, StyleSheet, ViewProps, Animated } from "react-native";

interface ProgressProps extends ViewProps {
  value?: number;
  max?: number;
  className?: string;
}

const Progress = React.forwardRef<View, ProgressProps>(
  ({ value = 0, max = 100, style, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const animatedWidth = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [percentage, animatedWidth]);

    return (
      <View ref={ref} style={[styles.container, style]} {...props}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#030213",
    borderRadius: 4,
  },
});

Progress.displayName = "Progress";

export { Progress };
