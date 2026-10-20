import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, AppLanguage, changeAppLanguage, currentLanguage } from '../i18n';
import { buttonFeedback } from '../utils/sounds';
import { FaunaColors, FaunaFontSize } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

interface LanguageSwitcherProps {
  // Kiểu nút tròn lấy theo màn đặt nó, để khớp với các nút bên cạnh.
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style, textStyle }) => {
  const { t } = useTranslation();
  const anchorRef = useRef<View>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const active = currentLanguage();

  const openMenu = () => {
    buttonFeedback();
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPos({ top: y + height + s(10), right: Dimensions.get('window').width - (x + width) });
    });
  };

  const handleSelect = (lng: AppLanguage) => {
    buttonFeedback();
    setMenuPos(null);
    if (lng !== active) {
      changeAppLanguage(lng);
    }
  };

  return (
    <>
      <Pressable ref={anchorRef} style={style} onPress={openMenu}>
        <Text style={[styles.code, textStyle]}>{active.toUpperCase()}</Text>
      </Pressable>

      {/* iOS: Modal mặc định chỉ cho dọc, app chỉ chạy ngang → phải khai báo, không thì báo lỗi (crash ở release). */}
      <Modal visible={!!menuPos} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setMenuPos(null)}>
        <Pressable style={styles.overlay} onPress={() => setMenuPos(null)}>
          {menuPos && (
            <View style={[styles.menu, { top: menuPos.top, right: menuPos.right }]}>
              <Text style={styles.menuTitle}>{t('language.title')}</Text>
              {SUPPORTED_LANGUAGES.map(lng => {
                const isActive = lng === active;
                return (
                  <Pressable
                    key={lng}
                    style={[styles.item, isActive && styles.itemActive]}
                    onPress={() => handleSelect(lng)}
                  >
                    <Text style={[styles.itemCode, isActive && styles.itemTextActive]}>
                      {lng.toUpperCase()}
                    </Text>
                    <Text style={[styles.itemName, isActive && styles.itemTextActive]}>
                      {LANGUAGE_NAMES[lng]}
                    </Text>
                    {isActive && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  code: {
    fontSize: s(20),
    fontWeight: '800',
    color: FaunaColors.t1,
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    minWidth: s(260),
    padding: s(10),
    borderRadius: s(20),
    backgroundColor: FaunaColors.night2,
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(6) },
    shadowOpacity: 0.45,
    shadowRadius: s(16),
    elevation: 12,
  },
  menuTitle: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: FaunaColors.t3,
    paddingHorizontal: s(12),
    paddingTop: s(4),
    paddingBottom: s(8),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    minHeight: s(60),
    paddingHorizontal: s(14),
    borderRadius: s(14),
  },
  itemActive: {
    backgroundColor: 'rgba(245,185,78,0.18)',
  },
  itemCode: {
    width: s(36),
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: FaunaColors.t3,
  },
  itemName: {
    flex: 1,
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    color: FaunaColors.t1,
  },
  itemTextActive: {
    color: FaunaColors.amberHi,
  },
  check: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.amber,
  },
});
