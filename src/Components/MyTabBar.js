import * as React from 'react'
import { Animated, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Colors, Font } from '../Provider/Colorsfont';
import { mobileW } from '../Helpers/Utils';
import { Text } from 'react-native-paper';

const MyTabBar = ({ state, descriptors, navigation, position }) => {
    const layout = useWindowDimensions()
  return (
    <View style={{ flexDirection: 'row', height: layout.height/6, backgroundColor: '#F1F2F4' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={[{ }, {
                color: (isFocused) ? Colors.textblue : Colors.splashtextcolor,
                textTransform: 'capitalize',
                fontSize: (mobileW * 3.5) / 100,
                textAlign: 'center',
                fontFamily: Font.SemiBold,
            }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MyTabBar