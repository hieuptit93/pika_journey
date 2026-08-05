import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated as RNAnimated, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { Bubble, ChoiceButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

export const Screen13FitCheck: React.FC = () => {
  const { kid, setInteraction, setCurrentScreen } = useJourney();
  const animValues = [
    useRef(new RNAnimated.Value(0)).current,
    useRef(new RNAnimated.Value(0)).current,
    useRef(new RNAnimated.Value(0)).current,
  ];

  useEffect(() => {
    animValues.forEach((anim, i) => {
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 700 + i * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleChoice = (choice: 'yes' | 'maybe' | 'auto') => {
    setInteraction((prev) => ({ ...prev, fitChoice: choice }));
    setTimeout(() => setCurrentScreen('f'), 250);
  };

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={13} currentPanel={13} />

      <ImageBackground
        source={require('../assets/images/onboard_13.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Câu hỏi cuối! Cô chú có dành được <Text style={styles.strong}>10–20 phút/ngày</Text> đồng hành cùng{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> trong{' '}
            <Text style={styles.strong}>tuần đầu tiên</Text> không ạ?
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.narrator}>Chọn câu trả lời thật nhất nhé</Text>

        <View style={styles.choices}>
          <RNAnimated.View
            style={{
              opacity: animValues[0],
              transform: [
                {
                  translateY: animValues[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            }}
          >
            <ChoiceButton
              emoji=""
              variant="a"
              onPress={() => handleChoice('yes')}
            >
              Được! Mình sẵn sàng đồng hành
            </ChoiceButton>
          </RNAnimated.View>

          <RNAnimated.View
            style={{
              opacity: animValues[1],
              transform: [
                {
                  translateY: animValues[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            }}
          >
            <ChoiceButton
              emoji=""
              variant="b"
              onPress={() => handleChoice('maybe')}
            >
              Có thể — mình bận nhưng sẽ cố
            </ChoiceButton>
          </RNAnimated.View>

          <RNAnimated.View
            style={{
              opacity: animValues[2],
              transform: [
                {
                  translateY: animValues[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            }}
          >
            <ChoiceButton
              emoji=""
              variant="c"
              onPress={() => handleChoice('auto')}
            >
              Muốn Pika tự lo được cho bạn nhỏ
            </ChoiceButton>
          </RNAnimated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneImage: {
    height: height * SCENE_HEIGHT_RATIO,
    width: '100%',
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.text,
  },
  strong: {
    ...Typography.bodySemibold,
    color: Colors.primary,
  },
  scrollView: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    flex: 1,
  },
  interactionContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  narrator: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  choices: {
    gap: Spacing.sm,
  },
});
