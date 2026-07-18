import React from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  visible: boolean;
  animation: Animated.Value;
};

export default function Categories({
  categories,
  selected,
  onSelect,
  visible,
  animation,
}: Props) {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation,
        },
      ]}
    >
      {visible && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              style={[
                styles.button,
                selected === item &&
                  styles.buttonActive,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  selected === item &&
                    styles.textActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fcf9f3",
    paddingVertical: 10,
  },

  button: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  buttonActive: {
    backgroundColor: "#111",
  },

  text: {
    fontWeight: "600",
  },

  textActive: {
    color: "#FFF",
  },
});