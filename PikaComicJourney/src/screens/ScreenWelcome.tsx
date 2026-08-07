import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Image, Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { Button3D } from '../components/Button3D';
import { buttonFeedback } from '../utils/sounds';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const PLAY_CARDS = [
  {
    id: 'story',
    title: 'Kể chuyện',
    image: require('../../assets/story.png'),
    color: '#F5A623',
    shadowColor: '#CC7A00',
  },
  {
    id: 'song',
    title: 'Hát',
    image: require('../../assets/song.png'),
    color: '#EC4899',
    shadowColor: '#BE185D',
  },
  {
    id: 'english',
    title: 'Nói tiếng Anh',
    image: require('../../assets/speak.png'),
    color: '#10B981',
    shadowColor: '#047857',
  },
  {
    id: 'guess',
    title: 'Đoán nhân vật',
    image: require('../../assets/explore.png'),
    color: '#8B5CF6',
    shadowColor: '#6D28D9',
  },
];

export const ScreenWelcome: React.FC = () => {
  const { setCurrentScreen, setSelectedPlay, addStars } = useApp();

  const handleStart = () => {
    addStars(1);
    setCurrentScreen('play');
  };

  const handleCardPress = (id: string) => {
    buttonFeedback();
    setSelectedPlay(id);
    addStars(1);
    setCurrentScreen('play');
  };

  return (
    <ImageBackground
      source={require('../../assets/home_pika.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Content */}
      <View style={styles.content}>
        {/* Button area */}
        <View style={styles.buttonArea}>
          <Button3D title="BẮT ĐẦU NGAY" onPress={handleStart} color="orange" size="large" />
        </View>

        {/* Bottom - Play cards horizontal with staggered layout */}
        <View style={styles.cardsSection}>
          {PLAY_CARDS.map((card, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Pressable
                key={card.id}
                style={[
                  styles.cardOuter,
                  {
                    backgroundColor: card.shadowColor,
                    marginTop: isEven ? 0 : 20,
                    marginBottom: isEven ? 20 : 0,
                    transform: [{ rotate: isEven ? '-2deg' : '2deg' }],
                  },
                ]}
                onPress={() => handleCardPress(card.id)}
                shouldRasterizeIOS
                renderToHardwareTextureAndroid
              >
                <View style={[styles.cardInner, { borderColor: card.color }]}>
                  <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
                  <View style={[styles.cardTitleWrap, { backgroundColor: card.color }]}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: isCompact ? 16 : 24,
    paddingVertical: isCompact ? 12 : 20,
  },
  buttonArea: {
    flex: 1,
    alignItems: 'center',
    marginTop: 205,
  },
  cardsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isCompact ? 10 : 14,
    paddingBottom: 10,
  },
  cardOuter: {
    flex: 1,
    maxWidth: isCompact ? 150 : 180,
    borderRadius: 18,
    paddingBottom: 5,
    elevation: 8,
  },
  cardInner: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: isCompact ? 75 : 95,
  },
  cardTitleWrap: {
    paddingVertical: isCompact ? 8 : 10,
    paddingHorizontal: 8,
  },
  cardTitle: {
    fontSize: isCompact ? 12 : 14,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
