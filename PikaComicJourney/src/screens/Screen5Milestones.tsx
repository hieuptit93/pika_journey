import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated as RNAnimated, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

export const Screen5Milestones: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showCallout1, setShowCallout1] = useState(false);
  const [showCallout2, setShowCallout2] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const fillWidth = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      RNAnimated.timing(fillWidth, {
        toValue: 33,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 800);

    setTimeout(() => setShowCallout1(true), 2000);

    setTimeout(() => {
      RNAnimated.timing(fillWidth, {
        toValue: 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 2600);

    setTimeout(() => setShowCallout2(true), 3800);
    setTimeout(() => setShowButton(true), 4400);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={5} currentPanel={5} />

      <ImageBackground
        source={require('../assets/images/onboard_5.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            <Text style={styles.strong}>{kid.name || 'Bạn nhỏ'}</Text> nói 30 phút mỗi ngày — đây là 2 cột mốc kỳ diệu sẽ xảy ra!
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        {/* Milestone timeline */}
        <View style={[styles.milestoneCard, Shadows.md]}>
          {/* Nodes row with weighted spacing: 0 -- 1/4 -- 3/4 -- 400h */}
          <View style={styles.nodesRow}>
            {/* Node 0h */}
            <View style={styles.node}>
              <LinearGradient colors={Colors.gradientPrimary} style={styles.nodeDot}>
                <Text style={styles.nodeDotText}>0</Text>
              </LinearGradient>
              <Text style={styles.nodeLabel}>Bắt đầu</Text>
              <Text style={styles.nodeTime}>hôm nay</Text>
            </View>

            {/* Spacer 1: 25% */}
            <View style={styles.spacer1}>
              <View style={styles.railSegment}>
                <RNAnimated.View
                  style={[
                    styles.railFillSegment,
                    {
                      width: fillWidth.interpolate({
                        inputRange: [0, 25, 100],
                        outputRange: ['0%', '100%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Node 100h */}
            <View style={styles.node}>
              <LinearGradient colors={Colors.gradientOcean} style={styles.nodeDot}>
                <Text style={styles.nodeDotText}>100h</Text>
              </LinearGradient>
              <Text style={styles.nodeLabel}>Bật phản xạ</Text>
              <Text style={styles.nodeTime}>~6.5 tháng</Text>
            </View>

            {/* Spacer 2: 75% */}
            <View style={styles.spacer3}>
              <View style={styles.railSegment}>
                <RNAnimated.View
                  style={[
                    styles.railFillSegment,
                    {
                      width: fillWidth.interpolate({
                        inputRange: [0, 25, 100],
                        outputRange: ['0%', '0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Node 400h */}
            <View style={styles.node}>
              <LinearGradient colors={Colors.gradientForest} style={styles.nodeDot}>
                <Text style={styles.nodeDotText}>400h</Text>
              </LinearGradient>
              <Text style={styles.nodeLabel}>Nói lưu loát</Text>
              <Text style={styles.nodeTime}>~2 năm</Text>
            </View>
          </View>
        </View>

        {/* Callouts */}
        {showCallout1 && (
          <View style={[styles.callout, Shadows.sm]}>
            <LinearGradient colors={Colors.gradientOcean} style={styles.calloutBadge}>
              <Text style={styles.calloutNum}>100h</Text>
            </LinearGradient>
            <Text style={styles.calloutText}>
              <Text style={styles.em}>Phản xạ tiếng Anh bật lên</Text> — bạn nhỏ bắt đầu trả lời thẳng không cần dịch trong đầu nữa
            </Text>
          </View>
        )}

        {showCallout2 && (
          <View style={[styles.callout, Shadows.sm]}>
            <LinearGradient colors={Colors.gradientForest} style={styles.calloutBadge}>
              <Text style={styles.calloutNum}>400h</Text>
            </LinearGradient>
            <Text style={styles.calloutText}>
              <Text style={styles.em}>Nói lưu loát tự nhiên</Text> — bạn nhỏ tự kể chuyện, đặt câu hỏi, tự tin trò chuyện không nghĩ ngợi
            </Text>
          </View>
        )}

        <Text style={styles.hint}>30 phút/ngày · không bỏ ngày nào</Text>

        {/* Next button */}
        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(6)}>
            Ở trường thì sao?
          </PrimaryButton>
        )}
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
  milestoneCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  node: {
    alignItems: 'center',
  },
  spacer1: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 17,
  },
  spacer3: {
    flex: 3,
    justifyContent: 'center',
    paddingTop: 17,
  },
  railSegment: {
    height: 6,
    backgroundColor: Colors.grayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  railFillSegment: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  nodeDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDotText: {
    ...Typography.captionSmall,
    fontWeight: '800',
    color: Colors.white,
  },
  nodeLabel: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
    textAlign: 'center',
    flexShrink: 0,
  },
  nodeTime: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  calloutBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutNum: {
    ...Typography.h4,
    color: Colors.white,
  },
  calloutText: {
    flex: 1,
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
  },
  em: {
    color: Colors.primary,
    fontWeight: '800',
  },
  hint: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
