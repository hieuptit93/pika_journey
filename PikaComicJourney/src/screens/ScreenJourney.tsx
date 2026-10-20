import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Modal,
  Image,
  Animated,
} from 'react-native';
import { useTranslation, Trans } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { FaunaColors, FaunaFontSize, FaunaTouchTarget } from '../constants/theme';
import { buttonFeedback, successFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const JOURNEY_CARDS = [
  {
    step: 0,
    image: require('../../assets/fauna/isl-meet.webp'),
    position: 'left',
    top: s(180),
  },
  {
    step: 1,
    image: require('../../assets/fauna/isl-prea1.webp'),
    position: 'right',
    top: s(315),
  },
  {
    step: 2,
    image: require('../../assets/fauna/isl-explore.webp'),
    position: 'left',
    top: s(450),
  },
  {
    step: 3,
    image: require('../../assets/fauna/isl-castle.webp'),
    position: 'right',
    top: s(585),
  },
  {
    step: 4,
    image: require('../../assets/fauna/isl-party.webp'),
    position: 'left',
    top: s(720),
  },
];

// Ô cuối (Cambridge YLE) được làm nổi bật.
const HIGHLIGHT_STAT_INDEX = 3;

const DEMO_KEYS = ['story', 'structured', 'roleplay', 'song'] as const;

export const ScreenJourney: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addStars } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof JOURNEY_CARDS[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [activeDemo, setActiveDemo] = useState('story');
  const [showDemoSheet, setShowDemoSheet] = useState(false);

  const crystalAnims = useRef(JOURNEY_CARDS.map(() => new Animated.Value(0))).current;

  const handleOpenCard = (card: typeof JOURNEY_CARDS[0]) => {
    buttonFeedback();
    setSelectedCard(card);
    setCurrentStep(card.step);
    setModalVisible(true);
    // Tracking luôn ghi tên tiếng Việt để số liệu không bị tách theo ngôn ngữ.
    logEvent('select_journey_card', 'journey', { step: card.step, title: i18n.t(`journey.cards.step${card.step}.title`, { lng: 'vi' }) });

    if (!doneSteps.has(card.step)) {
      setDoneSteps(prev => new Set([...prev, card.step]));
      addStars(1);

      Animated.spring(crystalAnims[card.step], {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNextStep = () => {
    if (currentStep < JOURNEY_CARDS.length - 1) {
      buttonFeedback();
      handleOpenCard(JOURNEY_CARDS[currentStep + 1]);
    } else {
      setModalVisible(false);
      setShowReward(true);
      successFeedback();
      addStars(3);
      logEvent('complete_journey', 'journey', { totalSteps: JOURNEY_CARDS.length });
    }
  };

  const handleDemoChip = (key: string) => {
    buttonFeedback();
    setActiveDemo(key);
    setShowDemoSheet(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <Text style={styles.eyebrow}>{t('journey.eyebrow')}</Text>
      <Text style={styles.title}>{t('journey.title')}</Text>
      <Text style={styles.subtitle}>{t('journey.subtitle')}</Text>

      {/* Timeline Path */}
      <View style={styles.timeline} />

      {/* Timeline Nodes */}
      {JOURNEY_CARDS.map((card, index) => (
        <Pressable
          key={card.step}
          style={[
            styles.node,
            { top: card.top + s(43) },
            currentStep === index && styles.nodeCurrent,
            doneSteps.has(index) && styles.nodeDone,
          ]}
          onPress={() => handleOpenCard(card)}
        >
          <Text style={[
            styles.nodeText,
            (currentStep === index || doneSteps.has(index)) && styles.nodeTextActive,
          ]}>
            {index + 1}
          </Text>
        </Pressable>
      ))}

      {/* Journey Cards */}
      {JOURNEY_CARDS.map((card, index) => (
        <Pressable
          key={card.step}
          style={[
            styles.jcard,
            card.position === 'left' ? styles.jcardLeft : styles.jcardRight,
            { top: card.top },
            currentStep === index && styles.jcardCurrent,
          ]}
          onPress={() => handleOpenCard(card)}
        >
          <Text style={[styles.jcKicker, card.position === 'right' && styles.textRight]}>{t(`journey.cards.step${card.step}.kicker`)}</Text>
          <Text style={[styles.jcName, card.position === 'right' && styles.textRight]} numberOfLines={2}>{t(`journey.cards.step${card.step}.title`)}</Text>
          <View style={[styles.jcQuoteBox, card.position === 'right' && styles.alignRight]}>
            <Text style={styles.jcQuote}>{t(`journey.cards.step${card.step}.quote`)}</Text>
          </View>
          <View
            style={[
              styles.jcCrys,
              card.position === 'left' ? styles.jcCrysRight : styles.jcCrysLeft,
              doneSteps.has(index) && styles.jcCrysEarned,
            ]}
          />
          <View style={[
            styles.jcArt,
            card.position === 'left' ? styles.jcArtRight : styles.jcArtLeft,
          ]}>
            <Image source={card.image} style={styles.jcArtImg} resizeMode="contain" />
          </View>
        </Pressable>
      ))}

      {/* Panel */}
      <View style={styles.panel}>
        <Text style={styles.panelHead}>{t('journey.panelHead')}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {(t('journey.stats', { returnObjects: true }) as { value: string; label: string }[]).map((stat, i) => (
            <View key={i} style={[styles.stat, i === HIGHLIGHT_STAT_INDEX && styles.statHi]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Mission Row */}
        <View style={styles.missionRow}>
          <Text style={styles.missionTitle}>{t('journey.missionTitle')}</Text>
          <View style={styles.crysRow}>
            {JOURNEY_CARDS.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.crys,
                  doneSteps.has(i) && styles.crysEarned,
                  {
                    transform: [{
                      scale: crystalAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    }],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Demo Chips */}
        <View style={styles.demoChips}>
          {DEMO_KEYS.map(key => (
            <Pressable
              key={key}
              style={[styles.demoChip, activeDemo === key && styles.demoChipActive]}
              onPress={() => handleDemoChip(key)}
            >
              <Text style={[styles.demoChipText, activeDemo === key && styles.demoChipTextActive]}>
                {t(`journey.demos.${key}.label`)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.panelNote}>{t('journey.panelNote')}</Text>
      </View>

      {/* Journey Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            {selectedCard && (
              <>
                <View style={styles.modalArt}>
                  <Image source={selectedCard.image} style={styles.modalArtImg} resizeMode="contain" />
                </View>
                <Text style={styles.modalKicker}>{t(`journey.cards.step${selectedCard.step}.kicker`)}</Text>
                <Text style={styles.modalTitle}>{t(`journey.cards.step${selectedCard.step}.title`)}</Text>
                <Text style={styles.modalLong}>{t(`journey.cards.step${selectedCard.step}.longDesc`)}</Text>
                <View style={styles.modalQuoteRow}>
                  <Text style={styles.modalQuote}>{t(`journey.cards.step${selectedCard.step}.quote`)}</Text>
                </View>
                <View style={styles.modalFoot}>
                  <Text style={styles.modalStep}>
                    {t('journey.stepCounter', { current: selectedCard.step + 1, total: JOURNEY_CARDS.length })}
                  </Text>
                  <Pressable style={styles.btnAmber} onPress={handleNextStep}>
                    <Text style={styles.btnAmberText}>
                      {currentStep < JOURNEY_CARDS.length - 1 ? t('journey.nextStep') : t('journey.seeGoal')}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Reward Modal */}
      <Modal visible={showReward} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => setShowReward(false)}>
          <Pressable style={styles.rewardModal} onPress={e => e.stopPropagation()}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.rewardTitle}>{t('journey.rewardTitle')}</Text>
            <Text style={styles.rewardText}>
              <Trans t={t} i18nKey="journey.rewardText" components={{ b: <Text style={{ fontWeight: '800' }} /> }} />
            </Text>
            <View style={styles.qrRow}>
              <Image
                source={require('../../assets/fauna/qr-zalo.png')}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <View style={styles.qrText}>
                <Text style={styles.qrTitle}>{t('journey.qrTitle')}</Text>
                <Text style={styles.qrDesc}>{t('journey.qrDesc')}</Text>
              </View>
            </View>
            <Pressable style={styles.btnAmber} onPress={() => setShowReward(false)}>
              <Text style={styles.btnAmberText}>{t('journey.rewardCta')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Demo Bottom Sheet */}
      {showDemoSheet && (
        <View style={styles.demoSheet}>
          <View style={styles.demoSheetTop}>
            <Text style={styles.demoSheetLabel}>
              {t('journey.demoSheetLabel', { label: t(`journey.demos.${activeDemo}.label`) })}
            </Text>
            <Pressable style={styles.demoSheetClose} onPress={() => setShowDemoSheet(false)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.demoChat}>
            {(t(`journey.demos.${activeDemo}.lines`, { returnObjects: true }) as string[]).map((line, i) => (
              <View
                key={i}
                style={[
                  styles.chatLine,
                  i === 1 ? styles.chatLineKid : styles.chatLinePika,
                ]}
              >
                <Text style={[styles.chatLineText, i === 1 && styles.chatLineTextKid]}>
                  {line}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  eyebrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(52),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 2,
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(78),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['4xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['4xl'] * 1.16),
    color: FaunaColors.t1,
  },
  subtitle: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(138),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: FaunaColors.t3,
  },
  timeline: {
    position: 'absolute',
    left: s(473),
    top: s(180),
    width: s(6),
    height: s(675),
    borderRadius: s(3),
    backgroundColor: 'rgba(200,169,106,0.3)',
  },
  node: {
    position: 'absolute',
    left: s(452),
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FaunaColors.night3,
    borderWidth: 3,
    borderColor: 'rgba(245,185,78,0.5)',
    zIndex: 5,
  },
  nodeCurrent: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,245,220,0.95)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: s(26),
    elevation: 10,
  },
  nodeDone: {
    backgroundColor: '#FFE9BC',
    borderColor: 'rgba(255,240,205,0.8)',
  },
  nodeText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: '#8FA3CC',
  },
  nodeTextActive: {
    color: '#2B2208',
  },
  jcard: {
    position: 'absolute',
    width: s(410),
    height: s(135),
    padding: s(12),
    paddingHorizontal: s(20),
    borderRadius: s(24),
    backgroundColor: 'rgba(24,36,78,0.88)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.28)',
    justifyContent: 'center',
  },
  jcardLeft: {
    left: s(40),
  },
  jcardRight: {
    right: s(40),
  },
  jcardCurrent: {
    borderWidth: 3,
    borderColor: FaunaColors.amber,
    backgroundColor: 'rgba(32,46,96,0.94)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: s(34),
    elevation: 12,
  },
  textRight: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  jcKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: s(1.4),
    color: '#F0C273',
    textTransform: 'uppercase',
    maxWidth: s(256),
  },
  jcName: {
    marginTop: s(4),
    marginBottom: s(4),
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize.lg * 1.15),
    letterSpacing: -0.3,
    color: FaunaColors.t1,
    maxWidth: s(256),
  },
  jcQuoteBox: {
    alignSelf: 'flex-start',
    maxWidth: s(256),
    paddingVertical: s(6),
    paddingHorizontal: s(12),
    borderRadius: s(16),
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167,196,234,0.28)',
  },
  jcQuote: {
    fontSize: s(FaunaFontSize.xs),
    lineHeight: s(FaunaFontSize.xs * 1.25),
    fontStyle: 'italic',
    color: '#D5E0F6',
  },
  jcCrys: {
    position: 'absolute',
    bottom: s(12),
    width: s(14),
    height: s(14),
    borderRadius: s(7),
    backgroundColor: 'rgba(167,196,234,0.25)',
  },
  jcCrysRight: {
    right: s(18),
  },
  jcCrysLeft: {
    left: s(18),
  },
  jcCrysEarned: {
    backgroundColor: FaunaColors.amber,
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: s(14),
    elevation: 6,
  },
  jcArt: {
    position: 'absolute',
    top: '50%',
    marginTop: -s(48),
    width: s(96),
    height: s(96),
    opacity: 0.95,
  },
  jcArtRight: {
    right: s(12),
  },
  jcArtLeft: {
    left: s(12),
  },
  jcArtImg: {
    width: '100%',
    height: '100%',
  },
  panel: {
    position: 'absolute',
    left: s(40),
    top: s(869),
    width: s(872),
    padding: s(18),
    paddingHorizontal: s(22),
    borderRadius: s(30),
    backgroundColor: 'rgba(24,36,78,0.92)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.26)',
  },
  panelHead: {
    marginBottom: s(12),
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize.lg * 1.2),
    letterSpacing: -0.3,
    color: FaunaColors.t1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: s(12),
  },
  stat: {
    flex: 1,
    padding: s(12),
    paddingHorizontal: s(14),
    borderRadius: s(20),
    backgroundColor: 'rgba(20,30,60,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(167,196,234,0.2)',
  },
  statHi: {
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.75)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: s(22),
    elevation: 6,
  },
  statValue: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize.base * 1.2),
    letterSpacing: -0.3,
    color: '#F7CE85',
  },
  statLabel: {
    marginTop: s(4),
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.xs * 1.2),
    color: FaunaColors.t3,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(10),
  },
  missionTitle: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    lineHeight: s(FaunaFontSize.base * 1.25),
    color: FaunaColors.t1,
  },
  crysRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  crys: {
    width: s(18),
    height: s(18),
    borderRadius: s(5),
    backgroundColor: 'rgba(167,196,234,0.2)',
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    transform: [{ rotate: '45deg' }],
  },
  crysEarned: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,240,205,0.85)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: s(14),
    elevation: 6,
  },
  demoChips: {
    flexDirection: 'row',
    gap: s(10),
  },
  demoChip: {
    flex: 1,
    height: s(54),
    borderRadius: s(18),
    backgroundColor: 'rgba(245,185,78,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoChipActive: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,245,220,0.95)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(5) },
    shadowOpacity: 0.55,
    shadowRadius: s(18),
    elevation: 10,
  },
  demoChipText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: FaunaColors.amberHi,
  },
  demoChipTextActive: {
    color: '#26200A',
    fontWeight: '800',
  },
  panelNote: {
    marginTop: s(10),
    fontSize: s(FaunaFontSize.xs),
    lineHeight: s(FaunaFontSize.xs * 1.3),
    color: FaunaColors.t3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: s(680),
    backgroundColor: 'rgba(20,32,72,0.98)',
    borderRadius: s(40),
    padding: s(32),
    paddingTop: s(28),
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.4)',
    borderLeftColor: 'rgba(167,196,234,0.25)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(20) },
    shadowOpacity: 0.6,
    shadowRadius: s(40),
    elevation: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: s(22),
    top: s(22),
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: 'rgba(167,196,234,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: s(22),
    fontWeight: '700',
    color: FaunaColors.t1,
  },
  modalArt: {
    width: s(220),
    height: s(196),
    marginBottom: s(18),
  },
  modalArtImg: {
    width: '100%',
    height: '100%',
  },
  modalKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: s(2),
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
    marginBottom: s(8),
  },
  modalTitle: {
    fontSize: s(FaunaFontSize['3xl']),
    fontWeight: '800',
    color: FaunaColors.t1,
    textAlign: 'center',
    marginBottom: s(16),
  },
  modalLong: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.5),
    color: FaunaColors.t2,
    textAlign: 'center',
    marginBottom: s(22),
    paddingHorizontal: s(10),
  },
  modalQuoteRow: {
    paddingVertical: s(16),
    paddingHorizontal: s(32),
    borderRadius: s(34),
    backgroundColor: 'rgba(245,185,78,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.32)',
    marginBottom: s(26),
  },
  modalQuote: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    fontStyle: 'italic',
    color: FaunaColors.amberHi,
    textAlign: 'center',
  },
  modalFoot: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: s(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,196,234,0.2)',
  },
  modalStep: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t3,
  },
  btnAmber: {
    height: s(FaunaTouchTarget.cta),
    paddingHorizontal: s(34),
    borderRadius: s(34),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(180,130,30,0.5)',
    borderBottomColor: 'rgba(160,100,20,0.7)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.6,
    shadowRadius: s(20),
    elevation: 12,
  },
  btnAmberText: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    color: '#26200A',
  },
  rewardModal: {
    width: s(680),
    backgroundColor: 'rgba(20,32,72,0.98)',
    borderRadius: s(40),
    padding: s(32),
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.4)',
    borderLeftColor: 'rgba(167,196,234,0.25)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(20) },
    shadowOpacity: 0.6,
    shadowRadius: s(40),
    elevation: 20,
  },
  trophy: {
    fontSize: s(76),
    marginBottom: s(14),
  },
  rewardTitle: {
    fontSize: s(FaunaFontSize['3xl']),
    fontWeight: '800',
    color: FaunaColors.t1,
    marginBottom: s(14),
    textAlign: 'center',
  },
  rewardText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.5),
    color: FaunaColors.t2,
    textAlign: 'center',
    marginBottom: s(22),
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(18),
    padding: s(18),
    backgroundColor: 'rgba(167,196,234,0.1)',
    borderRadius: s(24),
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    marginBottom: s(22),
  },
  qrImage: {
    width: s(100),
    height: s(100),
  },
  qrText: {
    flex: 1,
  },
  qrTitle: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.t1,
    marginBottom: s(6),
  },
  qrDesc: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.4),
    color: FaunaColors.t3,
  },
  demoSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: s(20),
    paddingHorizontal: s(52),
    paddingBottom: s(28),
    borderTopLeftRadius: s(30),
    borderTopRightRadius: s(30),
    backgroundColor: 'rgba(24,36,78,0.98)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.3)',
    borderBottomWidth: 0,
  },
  demoSheetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(12),
  },
  demoSheetLabel: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 2.4,
    color: '#F0C273',
    textTransform: 'uppercase',
  },
  demoSheetClose: {
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: 'rgba(167,196,234,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoChat: {
    gap: s(10),
  },
  chatLine: {
    maxWidth: '80%',
    paddingVertical: s(13),
    paddingHorizontal: s(18),
    borderRadius: s(20),
  },
  chatLinePika: {
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    alignSelf: 'flex-start',
  },
  chatLineKid: {
    backgroundColor: 'rgba(245,185,78,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245,185,78,0.5)',
    alignSelf: 'flex-end',
  },
  chatLineText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: '#E6EDFB',
  },
  chatLineTextKid: {
    color: '#FFEFCE',
  },
});
