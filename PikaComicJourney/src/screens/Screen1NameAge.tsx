import React from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { Bubble, PrimaryButton, TopChrome, FieldInput, SegmentedPicker } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const ageOptions = [
  { value: '4-5', label: '4–5' },
  { value: '6-7', label: '6–7' },
  { value: '8-9', label: '8–9' },
  { value: '10+', label: '10+' },
];

export const Screen1NameAge: React.FC = () => {
  const { kid, setKid, setCurrentScreen } = useJourney();

  const isValid = kid.name.trim().length >= 1 && kid.age !== '';

  const handleSubmit = () => {
    if (isValid) {
      setCurrentScreen(2);
    }
  };

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={1} currentPanel={1} />

      <ImageBackground
        source={require('../assets/images/onboard_1.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        {/* Speech bubble */}
        <Bubble show position="right">
          <Text style={styles.bubbleText}>
            Trước tiên, cho Pika biết{' '}
            <Text style={styles.strong}>tên bạn nhỏ</Text> và{' '}
            <Text style={styles.strong}>bạn nhỏ bao nhiêu tuổi</Text> nhé!
          </Text>
        </Bubble>
      </ImageBackground>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.interactionContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form card */}
          <View style={[styles.formCard, Shadows.md]}>
            <FieldInput
              label="Tên bạn nhỏ là gì?"
              emoji=""
              value={kid.name}
              onChangeText={(text) => setKid((prev) => ({ ...prev, name: text }))}
              placeholder="VD: Bin, Bống, An…"
              maxLength={20}
            />

            <View style={styles.spacer} />

            <SegmentedPicker
              label="Bạn nhỏ bao nhiêu tuổi?"
              emoji=""
              options={ageOptions}
              selectedValue={kid.age}
              onSelect={(value) => setKid((prev) => ({ ...prev, age: value as any }))}
              columns={4}
            />
          </View>

          {/* Submit button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={handleSubmit}
              disabled={!isValid}
             
            >
              Tiếp tục
            </PrimaryButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
    gap: Spacing.lg,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  spacer: {
    height: Spacing.lg,
  },
  buttonContainer: {
    marginTop: Spacing.sm,
  },
});
