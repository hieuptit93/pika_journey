import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const STAGES = [
  {
    id: 0,
    icon: '🌱',
    title: 'Hôm nay',
    subtitle: 'Pika hạ áp lực, giúp con dám phản hồi',
    quote: '"Im lặng, chỉ gật đầu..."',
    image: require('../assets/journey-1.png'),
    color: '#F5A623',
  },
  {
    id: 1,
    icon: '🗣️',
    title: 'Tháng 1-3',
    subtitle: '15 phút/ngày, nói câu 2-5 từ',
    quote: '"Hello! I like cats!"',
    image: require('../assets/journey-2.png'),
    color: '#3B82F6',
  },
  {
    id: 2,
    icon: '⭐',
    title: 'Tháng 4-12',
    subtitle: 'Hỏi đáp về mình, gia đình · ~500 từ',
    quote: '"I have a red bike!"',
    image: require('../assets/journey-3.png'),
    color: '#10B981',
  },
  {
    id: 3,
    icon: '🚀',
    title: 'Năm 2',
    subtitle: 'Role-play, kể chuyện · ~1.000 từ',
    quote: '"Yesterday I went to the zoo!"',
    image: require('../assets/journey-4.png'),
    color: '#8B5CF6',
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Flyers A2',
    subtitle: 'Nêu ý kiến, sẵn sàng chứng chỉ thật',
    quote: '"I think robots are cool!"',
    image: require('../assets/journey-5.png'),
    color: '#EC4899',
  },
];

const PROOFS = [
  { icon: '⏱️', title: '15 phút/ngày', desc: '90+ giờ nói mỗi năm' },
  { icon: '🗣️', title: '3.195 lượt', desc: 'bé nói trong tháng đầu' },
  { icon: '📈', title: '115 từ mới', desc: 'nhớ qua trò chuyện' },
  { icon: '🏅', title: 'Cambridge YLE', desc: 'Starters → Flyers' },
];

const ACTIVITY_TABS = [
  { id: 'story', label: 'Kể chuyện', icon: '📖', color: '#F5A623' },
  { id: 'vocabulary', label: 'Học từ', icon: '📝', color: '#3B82F6' },
  { id: 'roleplay', label: 'Đóng vai', icon: '🎭', color: '#8B5CF6' },
  { id: 'song', label: 'Hát', icon: '🎵', color: '#EC4899' },
];

const DEMO_CHATS: Record<string, { speaker: string; text: string }[]> = {
  story: [
    { speaker: 'Pika', text: 'Con muốn nghe chuyện gì?' },
    { speaker: 'Con', text: 'Công chúa và robot!' },
    { speaker: 'Pika', text: 'Once upon a time, in a magic kingdom...' },
  ],
  vocabulary: [
    { speaker: 'Pika', text: 'Hôm nay học từ "butterfly" nhé!' },
    { speaker: 'Con', text: 'Butter... fly?' },
    { speaker: 'Pika', text: 'Đúng rồi! Con bướm xinh đẹp 🦋' },
  ],
  roleplay: [
    { speaker: 'Pika', text: 'Con đóng vai bác sĩ, Pika là bệnh nhân!' },
    { speaker: 'Con', text: 'Hello! What is your name?' },
    { speaker: 'Pika', text: 'I am Pika. My tummy hurts!' },
  ],
  song: [
    { speaker: 'Pika', text: '🎵 Twinkle twinkle little star...' },
    { speaker: 'Con', text: 'How I wonder what you are!' },
    { speaker: 'Pika', text: 'Tuyệt vời! Con hát hay quá! ⭐' },
  ],
};

export const ScreenJourney: React.FC = () => {
  const [activeActivity, setActiveActivity] = useState('story');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lộ trình 24 tháng</Text>
          <Text style={styles.headerSub}>CHUẨN CAMBRIDGE YLE</Text>
        </View>

        {/* Stages */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stagesScroll}
        >
          {STAGES.map((stage) => (
              <View key={stage.id} style={styles.stageCard}>
                <Image source={stage.image} style={styles.stageImage} resizeMode="cover" />
                <LinearGradient
                  colors={[stage.color, `${stage.color}CC`]}
                  style={styles.stageBadge}
                >
                  <Text style={styles.stageBadgeText}>{stage.icon}</Text>
                </LinearGradient>
                <View style={styles.stageContent}>
                  <Text style={[styles.stageTitle, { color: stage.color }]}>{stage.title}</Text>
                  <Text style={styles.stageSubtitle} numberOfLines={2}>{stage.subtitle}</Text>
                  <View style={[styles.quoteBox, { backgroundColor: `${stage.color}15` }]}>
                    <Text style={[styles.quoteText, { color: stage.color }]}>{stage.quote}</Text>
                  </View>
                </View>
              </View>
          ))}
        </ScrollView>

        {/* Proof Row */}
        <View style={styles.proofSection}>
          <Text style={styles.proofTitle}>Vì sao ba mẹ tin được?</Text>
          <View style={styles.proofRow}>
            {PROOFS.map((proof, idx) => (
              <View key={idx} style={styles.proofCard}>
                <Text style={styles.proofIcon}>{proof.icon}</Text>
                <Text style={styles.proofStat}>{proof.title}</Text>
                <Text style={styles.proofDesc}>{proof.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Activity Block */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>
            Mỗi ngày 1 nhiệm vụ 15 phút — luyện qua 4 kiểu hoạt động 🎮
          </Text>

          <View style={styles.activityContent}>
            {/* Left side - tabs and chat */}
            <View style={styles.activityLeft}>
              {/* Tabs */}
              <View style={styles.activityTabs}>
                {ACTIVITY_TABS.map(tab => (
                  <Pressable
                    key={tab.id}
                    style={[
                      styles.activityTab,
                      activeActivity === tab.id && { backgroundColor: tab.color },
                    ]}
                    onPress={() => setActiveActivity(tab.id)}
                  >
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={[
                      styles.tabLabel,
                      activeActivity === tab.id && styles.tabLabelActive,
                    ]}>{tab.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Demo Chat */}
              <View style={styles.demoChatBox}>
                {DEMO_CHATS[activeActivity]?.map((line, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.chatLine,
                      line.speaker === 'Con' ? styles.chatLineRight : styles.chatLineLeft,
                    ]}
                  >
                    <View style={[
                      styles.chatBubble,
                      line.speaker === 'Con' ? styles.chatBubbleUser : styles.chatBubblePika,
                    ]}>
                      <Text style={styles.chatSpeaker}>{line.speaker}:</Text>
                      <Text style={styles.chatText}>{line.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Right side - crystals */}
            <View style={styles.crystalCol}>
              <Text style={styles.crystalTitle}>Đủ 5 💎 mở rương</Text>
              <View style={styles.crystalRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <View key={i} style={[styles.crystal, i <= 3 && styles.crystalFilled]}>
                    <Text style={styles.crystalIcon}>{i <= 3 ? '💎' : '◇'}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chestBox}>
                <Text style={styles.chestIcon}>🎁</Text>
                <Text style={styles.chestText}>Còn 2 💎 nữa!</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FD' },
  scroll: { flex: 1 },
  content: { padding: isCompact ? 16 : 24 },
  header: { marginBottom: 16 },
  headerTitle: {
    fontSize: isCompact ? 24 : 30,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: '600',
    color: '#64748B',
  },
  stagesScroll: {
    gap: 14,
    paddingRight: 24,
    marginBottom: 24,
  },
  stageCard: {
    width: isCompact ? 180 : 220,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  stageImage: {
    width: '100%',
    height: isCompact ? 100 : 120,
    backgroundColor: '#E8F4FD',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  stageBadge: {
    position: 'absolute',
    top: isCompact ? 82 : 102,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  stageBadgeText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  stageContent: {
    padding: 14,
    paddingTop: 22,
  },
  stageTitle: {
    fontSize: isCompact ? 15 : 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  stageSubtitle: {
    fontSize: isCompact ? 12 : 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: isCompact ? 16 : 18,
    marginBottom: 10,
  },
  quoteBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 8,
  },
  quoteText: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#3B82F6',
  },
  proofSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: isCompact ? 16 : 20,
    elevation: 4,
  },
  proofTitle: {
    fontSize: isCompact ? 16 : 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  proofRow: {
    flexDirection: 'row',
    gap: 12,
  },
  proofCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
  },
  proofIcon: { fontSize: isCompact ? 24 : 28, marginBottom: 8 },
  proofStat: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  proofDesc: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  activitySection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: isCompact ? 16 : 20,
    marginTop: 16,
    elevation: 4,
  },
  activityTitle: {
    fontSize: isCompact ? 14 : 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  activityContent: {
    flexDirection: 'row',
    gap: 16,
  },
  activityLeft: {
    flex: 2,
  },
  activityTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  activityTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: isCompact ? 8 : 10,
    paddingHorizontal: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  tabIcon: {
    fontSize: isCompact ? 14 : 16,
  },
  tabLabel: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#fff',
  },
  demoChatBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    minHeight: isCompact ? 100 : 120,
  },
  chatLine: {
    marginBottom: 8,
  },
  chatLineLeft: {
    alignItems: 'flex-start',
  },
  chatLineRight: {
    alignItems: 'flex-end',
  },
  chatBubble: {
    maxWidth: '85%',
    padding: 10,
    borderRadius: 12,
  },
  chatBubblePika: {
    backgroundColor: '#E0F2FE',
    borderBottomLeftRadius: 4,
  },
  chatBubbleUser: {
    backgroundColor: '#FEF3C7',
    borderBottomRightRadius: 4,
  },
  chatSpeaker: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  chatText: {
    fontSize: isCompact ? 12 : 13,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: isCompact ? 17 : 19,
  },
  crystalCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
  },
  crystalTitle: {
    fontSize: isCompact ? 12 : 14,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 10,
  },
  crystalRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  crystal: {
    width: isCompact ? 28 : 32,
    height: isCompact ? 28 : 32,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crystalFilled: {
    backgroundColor: '#DBEAFE',
  },
  crystalIcon: {
    fontSize: isCompact ? 16 : 18,
  },
  chestBox: {
    backgroundColor: '#FDE68A',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  chestIcon: {
    fontSize: isCompact ? 24 : 28,
    marginBottom: 4,
  },
  chestText: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '700',
    color: '#92400E',
  },
});
