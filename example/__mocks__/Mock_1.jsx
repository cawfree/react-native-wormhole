import * as React from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222',
    padding: 15,
    width: '100%',
  },
  header: {
    aspectRatio: 1,
    width: '100%',
  },
});

function usePeriodic() {
  const progress = React.useMemo(() => new Animated.Value(0), []);
  const animate = React.useCallback(function shouldAnimate(animated) {
    animated.setValue(0);
    return Animated.timing(
      animated,
      { toValue: 1, duration: 5000, useNativeDriver: true, easing: Easing.linear },
    ).start(() => shouldAnimate(animated));
  }, []);
  React.useEffect(() => {
    animate(progress);
  }, [animate, progress]);
  return progress;
}

export default function Mock_1() {
  const spinner = usePeriodic();
  return (
    <ScrollView style={[StyleSheet.absoluteFill, styles.container]}>
      <Animated.Image
        style={[
          styles.header,
          {
            transform: [
              {
                rotate: spinner.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                }),
              },
            ],
          },
        ]}
        source={{ uri: 'https://reactnative.dev/img/logo-og.png' }}
        resizeMode="cover"
      />
    </ScrollView>
  );
}
