import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Toast, ToastType } from '../components/Toast';
import {
  apiService,
  ApiError,
  TempGameItem,
  GameDeployResult,
  GAME_ZIP_MAX_BYTES,
} from '../services/api';
import i18n from '../i18n';
import { buttonFeedback, successFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';
import { FaunaColors, FaunaFontSize, FaunaRadius, FaunaTouchTarget } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

// Robot phải tự tải zip về nên trạng thái đổi trong vài giây tới vài phút.
const POLL_INTERVAL_MS = 4000;
const POLL_MAX_MS = 5 * 60 * 1000;
// iOS đổi MIME sang UTType: chỉ 'application/zip' là chắc chắn có; Android
// thì tuỳ trình quản lý file mà zip mang MIME khác nhau.
const ZIP_TYPES = Platform.OS === 'ios'
  ? ['application/zip']
  : ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];

const GREEN = '#5BD68A';
const RED = '#FF7A7A';

// Lỗi do app tự phát hiện (chưa gọi server) — lưu key, dịch lúc hiển thị.
type LocalError = { localKey: string };

type UploadState =
  | { phase: 'idle' }
  | { phase: 'uploading'; progress: number }
  | { phase: 'processing' }
  | { phase: 'done'; result: GameDeployResult }
  | { phase: 'error'; error: unknown };

const describeError = (err: unknown, t: TFunction): string => {
  if (err && typeof err === 'object' && 'localKey' in err) {
    return t((err as LocalError).localKey);
  }
  if (err instanceof ApiError) {
    if (err.status === 429) return t('games.errors.rateLimited');
    if (err.reason) {
      if (/^http_\d+$/.test(err.reason)) {
        return t('games.urlReasons.http_error', { code: err.reason.slice(5) });
      }
      const key = `games.urlReasons.${err.reason}`;
      if (i18n.exists(key)) return t(key);
    }
  }
  return err instanceof Error ? err.message : String(err);
};

const isSyncing = (g: TempGameItem) => g.sync_status === 'PENDING' || g.sync_status === 'SYNCING';

const formatSize = (bytes: number | null) =>
  bytes == null ? null : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const ScreenGames: React.FC = () => {
  const { t } = useTranslation();
  const { setCurrentScreen } = useApp();
  const { user } = useAuth();

  const [games, setGames] = useState<TempGameItem[] | null>(null);
  const [listError, setListError] = useState<unknown>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pollTick, setPollTick] = useState(0);
  const [pollingStopped, setPollingStopped] = useState(false);
  const watchUntilRef = useRef(0);
  const watchedIdRef = useRef<string | null>(null);

  const [upload, setUpload] = useState<UploadState>({ phase: 'idle' });
  const [link, setLink] = useState('');
  // Có giá trị = lần tải tiếp theo là phiên bản mới của game này (gửi kèm game_id),
  // không có = tạo game mới.
  const [versionTarget, setVersionTarget] = useState<TempGameItem | null>(null);
  const [busyGameId, setBusyGameId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
    visible: false,
    type: 'success',
    message: '',
  });
  const scrollRef = useRef<ScrollView>(null);

  const isUploading = upload.phase === 'uploading' || upload.phase === 'processing';

  const showToast = (type: ToastType, message: string) => setToast({ visible: true, type, message });

  const loadGames = useCallback(async () => {
    try {
      setGames(await apiService.getGames());
      setListError(null);
    } catch (err) {
      setListError(err);
    } finally {
      setPollTick(n => n + 1);
    }
  }, []);

  // Theo dõi thêm POLL_MAX_MS kể từ bây giờ; gameId = game vừa tải/gửi cần chờ tới khi chạy được.
  const startWatching = (gameId?: string) => {
    watchUntilRef.current = Date.now() + POLL_MAX_MS;
    if (gameId) watchedIdRef.current = gameId;
    setPollingStopped(false);
  };

  useEffect(() => {
    if (user?.token) apiService.setToken(user.token);
    startWatching();
    loadGames();
  }, []);

  // Poll bằng chuỗi setTimeout (không dùng setInterval) để các lần gọi chậm không chồng nhau.
  useEffect(() => {
    if (!games) return;
    const watched = watchedIdRef.current
      ? games.find(g => g.game_id === watchedIdRef.current)
      : undefined;
    const waitingForWatched = watchedIdRef.current != null
      && (!watched || (!watched.playable && watched.sync_status !== 'FAILED' && watched.firmware_ok));
    if (!games.some(isSyncing) && !waitingForWatched) {
      watchedIdRef.current = null;
      return;
    }
    if (Date.now() > watchUntilRef.current) {
      setPollingStopped(true);
      return;
    }
    const timer = setTimeout(loadGames, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [pollTick]);

  const handleRefresh = async () => {
    buttonFeedback();
    startWatching();
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const runUpload = async (
    source: 'file' | 'link',
    call: (onProgress: (fraction: number) => void) => Promise<GameDeployResult>
  ) => {
    setUpload(source === 'file' ? { phase: 'uploading', progress: 0 } : { phase: 'processing' });
    try {
      const result = await call(fraction =>
        setUpload(fraction >= 1 ? { phase: 'processing' } : { phase: 'uploading', progress: fraction })
      );
      setUpload({ phase: 'done', result });
      setVersionTarget(null);
      setLink('');
      if (result.push?.queued) successFeedback();
      logEvent('upload_game', 'games', {
        gameId: result.game_id,
        version: result.version,
        source,
        pushQueued: result.push?.queued ?? false,
        pushErrorCode: result.push?.error_code ?? null,
      });
      startWatching(result.game_id);
      loadGames();
    } catch (err) {
      setUpload({ phase: 'error', error: err });
    }
  };

  const handlePickFile = async () => {
    if (isUploading) return;
    buttonFeedback();
    const res = await DocumentPicker.getDocumentAsync({ type: ZIP_TYPES, copyToCacheDirectory: true });
    if (res.canceled || !res.assets?.[0]) return;
    const asset = res.assets[0];
    if (!asset.name.toLowerCase().endsWith('.zip')) {
      setUpload({ phase: 'error', error: { localKey: 'games.errors.notZip' } });
      return;
    }
    if (asset.size != null && asset.size > GAME_ZIP_MAX_BYTES) {
      setUpload({ phase: 'error', error: { localKey: 'games.errors.fileTooLarge' } });
      return;
    }
    const gameId = versionTarget?.game_id;
    await runUpload('file', onProgress =>
      apiService.uploadGameZip({ uri: asset.uri, name: asset.name }, gameId, onProgress)
    );
  };

  const handleSendLink = async () => {
    if (isUploading) return;
    buttonFeedback();
    const url = link.trim();
    if (!/^https:\/\//i.test(url)) {
      setUpload({ phase: 'error', error: { localKey: 'games.errors.linkNotHttps' } });
      return;
    }
    const gameId = versionTarget?.game_id;
    await runUpload('link', () => apiService.uploadGameZipByUrl(url, gameId));
  };

  const handlePush = async (game: TempGameItem) => {
    if (busyGameId) return;
    buttonFeedback();
    setBusyGameId(game.game_id);
    try {
      await apiService.pushGame(game.game_id);
      logEvent('push_game', 'games', { gameId: game.game_id, version: game.version });
      showToast('success', t('games.pushSent', { name: game.display_name }));
      startWatching(game.game_id);
      loadGames();
    } catch (err) {
      showToast('error', describeError(err, t));
    } finally {
      setBusyGameId(null);
    }
  };

  const handlePlay = async (game: TempGameItem) => {
    if (busyGameId) return;
    buttonFeedback();
    setBusyGameId(game.game_id);
    try {
      await apiService.assignGame(game.game_id);
      successFeedback();
      logEvent('assign_game', 'games', { gameId: game.game_id, version: game.version });
      showToast('success', t('games.playSent', { name: game.display_name }));
    } catch (err) {
      showToast('error', describeError(err, t));
    } finally {
      setBusyGameId(null);
    }
  };

  const handleNewVersion = (game: TempGameItem) => {
    buttonFeedback();
    setVersionTarget(game);
    setUpload({ phase: 'idle' });
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBack = () => {
    buttonFeedback();
    setCurrentScreen('welcome');
  };

  const statusOf = (g: TempGameItem): { label: string; color: string } => {
    if (g.playable) return { label: t('games.ready'), color: GREEN };
    if (!g.firmware_ok) {
      return { label: t('games.firmwareTooLow', { version: g.min_firmware_version ?? '?' }), color: RED };
    }
    if (g.sync_status === 'SYNCED' && !g.allowed) return { label: t('games.notAllowed'), color: FaunaColors.amber };
    switch (g.sync_status) {
      case 'PENDING':
      case 'SYNCING':
        return { label: t(`games.status.${g.sync_status}`), color: FaunaColors.cyan };
      case 'SYNCED':
        return { label: t('games.status.SYNCED'), color: GREEN };
      case 'FAILED':
        return { label: t('games.status.FAILED'), color: RED };
      case 'TO_DELETE':
        return { label: t('games.status.TO_DELETE'), color: FaunaColors.t4 };
      default:
        return { label: t('games.status.none'), color: FaunaColors.t4 };
    }
  };

  const renderUploadStatus = () => {
    switch (upload.phase) {
      case 'uploading':
        return (
          <View style={styles.statusBox}>
            <View style={styles.statusRow}>
              <ActivityIndicator color={FaunaColors.cyan} />
              <Text style={styles.statusText}>
                {t('games.uploading', { percent: Math.round(upload.progress * 100) })}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(upload.progress * 100)}%` }]} />
            </View>
          </View>
        );
      case 'processing':
        return (
          <View style={styles.statusBox}>
            <View style={styles.statusRow}>
              <ActivityIndicator color={FaunaColors.cyan} />
              <Text style={styles.statusText}>{t('games.processing')}</Text>
            </View>
          </View>
        );
      case 'done': {
        const { result } = upload;
        const pushed = result.push?.queued && !result.push?.error_code;
        return (
          <View style={[styles.statusBox, pushed ? styles.statusBoxOk : styles.statusBoxWarn]}>
            <Text style={styles.statusTitle}>
              {pushed ? '✅' : '⚠️'} {t('games.uploadedTitle', { name: result.display_name, version: result.version })}
            </Text>
            <Text style={styles.statusText}>
              {pushed ? t('games.uploadedQueued') : t('games.uploadedPushFailed')}
            </Text>
            {result.warnings?.length > 0 && (
              <View style={styles.warnings}>
                <Text style={styles.warningsTitle}>{t('games.warnings')}</Text>
                {result.warnings.map((w, i) => (
                  <Text key={i} style={styles.warningItem}>• {w}</Text>
                ))}
              </View>
            )}
          </View>
        );
      }
      case 'error':
        return (
          <View style={[styles.statusBox, styles.statusBoxError]}>
            <Text style={styles.statusText}>⚠️ {describeError(upload.error, t)}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderGame = (game: TempGameItem) => {
    const status = statusOf(game);
    const busy = busyGameId === game.game_id;
    const canPush = !game.playable && game.firmware_ok && !isSyncing(game);
    const size = formatSize(game.size_bytes);
    return (
      <View key={game.game_id} style={[styles.gameCard, game.playable && styles.gameCardReady]}>
        <View style={styles.gameIcon}>
          <Text style={styles.gameIconText}>🎮</Text>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.gameNameRow}>
            <Text style={styles.gameName} numberOfLines={1}>{game.display_name}</Text>
            <View style={[styles.distChip, game.distribution === 'TARGETED' && styles.distChipTargeted]}>
              <Text style={styles.distChipText}>
                {game.distribution === 'TARGETED' ? t('games.targeted') : t('games.fleet')}
              </Text>
            </View>
          </View>
          <Text style={styles.gameMeta} numberOfLines={1}>
            v{game.version}{size ? ` · ${size}` : ''} · {game.game_id}
          </Text>
          <View style={styles.gameStatusRow}>
            {isSyncing(game)
              ? <ActivityIndicator size="small" color={status.color} />
              : <View style={[styles.statusDot, { backgroundColor: status.color }]} />}
            <Text style={[styles.gameStatus, { color: status.color }]} numberOfLines={2}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.gameActions}>
          {busy ? (
            <ActivityIndicator color={FaunaColors.amber} />
          ) : (
            <>
              {game.playable && (
                <Pressable style={styles.btnPlay} onPress={() => handlePlay(game)}>
                  <Text style={styles.btnPlayText}>▶ {t('games.play')}</Text>
                </Pressable>
              )}
              {canPush && (
                <Pressable style={styles.btnCyan} onPress={() => handlePush(game)}>
                  <Text style={styles.btnCyanText}>
                    {game.sync_status == null ? t('games.push') : t('games.repush')}
                  </Text>
                </Pressable>
              )}
              {game.distribution === 'TARGETED' && (
                <Pressable style={styles.btnSmallGhost} onPress={() => handleNewVersion(game)}>
                  <Text style={styles.btnSmallGhostText}>⬆ {t('games.newVersion')}</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderList = () => {
    if (!games) {
      if (listError) {
        return (
          <View style={[styles.statusBox, styles.statusBoxError]}>
            <Text style={styles.statusText}>⚠️ {describeError(listError, t)}</Text>
          </View>
        );
      }
      return (
        <View style={styles.listPlaceholder}>
          <ActivityIndicator color={FaunaColors.amber} />
          <Text style={styles.placeholderText}>{t('games.loading')}</Text>
        </View>
      );
    }
    if (games.length === 0) {
      return (
        <View style={styles.listPlaceholder}>
          <Text style={styles.placeholderText}>{t('games.empty')}</Text>
        </View>
      );
    }
    return games.map(renderGame);
  };

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      <Pressable style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backText}>‹ {t('games.back')}</Text>
      </Pressable>

      <Text style={styles.eyebrow}>{t('games.eyebrow')}</Text>
      <Text style={styles.title}>{t('games.title')}</Text>
      <Text style={styles.subtitle}>{t('games.subtitle')}</Text>

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Upload */}
        <View style={styles.card}>
          {versionTarget && (
            <View style={styles.versionChip}>
              <Text style={styles.versionChipText} numberOfLines={1}>
                ⬆ {t('games.newVersionFor', { name: versionTarget.display_name })}
              </Text>
              <Pressable onPress={() => setVersionTarget(null)} hitSlop={s(12)}>
                <Text style={styles.versionChipCancel}>{t('games.cancel')}</Text>
              </Pressable>
            </View>
          )}

          <Pressable
            style={[styles.btnAmber, isUploading && styles.btnDisabled]}
            onPress={handlePickFile}
            disabled={isUploading}
          >
            <Text style={styles.btnAmberText}>📁 {t('games.pickFile')}</Text>
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{t('games.or')}</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.linkRow}>
            <TextInput
              style={styles.linkInput}
              value={link}
              onChangeText={setLink}
              placeholder={t('games.linkPlaceholder')}
              placeholderTextColor={FaunaColors.t4}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!isUploading}
              onSubmitEditing={handleSendLink}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.btnCyan, styles.linkSend, (isUploading || !link.trim()) && styles.btnDisabled]}
              onPress={handleSendLink}
              disabled={isUploading || !link.trim()}
            >
              <Text style={styles.btnCyanText}>{t('games.sendLink')}</Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>{t('games.uploadHint')}</Text>

          {renderUploadStatus()}
        </View>

        {/* List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{t('games.listTitle')}</Text>
          <Pressable style={styles.refreshBtn} onPress={handleRefresh} disabled={refreshing}>
            {refreshing
              ? <ActivityIndicator size="small" color={FaunaColors.t2} />
              : <Text style={styles.refreshText}>↻ {t('games.refresh')}</Text>}
          </Pressable>
        </View>

        {pollingStopped && <Text style={styles.pollNote}>{t('games.pollingStopped')}</Text>}

        {renderList()}
      </ScrollView>

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  backBtn: {
    position: 'absolute',
    top: s(44),
    left: s(40),
    height: s(48),
    paddingHorizontal: s(18),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    justifyContent: 'center',
    zIndex: 20,
  },
  backText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: FaunaColors.t2,
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
    color: FaunaColors.cyan,
    textTransform: 'uppercase',
    zIndex: 10,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(80),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['4xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['4xl'] * 1.16),
    color: FaunaColors.t1,
    zIndex: 10,
  },
  subtitle: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(140),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: FaunaColors.t3,
    zIndex: 10,
  },
  content: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(196),
    bottom: 0,
  },
  contentInner: {
    paddingBottom: s(40),
  },

  // Upload card
  card: {
    padding: s(24),
    backgroundColor: 'rgba(22,32,74,0.92)',
    borderRadius: s(26),
    borderWidth: 2,
    borderColor: 'rgba(102,198,230,0.35)',
    marginBottom: s(28),
  },
  versionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingVertical: s(8),
    paddingHorizontal: s(16),
    marginBottom: s(16),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(245,185,78,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245,185,78,0.6)',
  },
  versionChipText: {
    flexShrink: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: FaunaColors.amberHi,
  },
  versionChipCancel: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t3,
    textDecorationLine: 'underline',
  },
  btnAmber: {
    height: s(FaunaTouchTarget.min + 8),
    borderRadius: FaunaRadius.pill,
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(180,130,30,0.5)',
    borderBottomColor: 'rgba(160,100,20,0.7)',
  },
  btnAmberText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: '#2B2208',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
    marginVertical: s(16),
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: FaunaColors.line,
  },
  orText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: FaunaColors.t4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  linkInput: {
    flex: 1,
    height: s(FaunaTouchTarget.min),
    paddingHorizontal: s(18),
    borderRadius: s(16),
    backgroundColor: 'rgba(8,13,34,0.7)',
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    fontSize: s(FaunaFontSize.sm),
    color: FaunaColors.t1,
  },
  linkSend: {
    height: s(FaunaTouchTarget.min),
  },
  btnCyan: {
    minHeight: s(48),
    paddingHorizontal: s(20),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(102,198,230,0.16)',
    borderWidth: 2,
    borderColor: FaunaColors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCyanText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: FaunaColors.cyan,
  },
  hint: {
    marginTop: s(12),
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t4,
    textAlign: 'center',
  },

  // Upload status
  statusBox: {
    marginTop: s(18),
    padding: s(18),
    borderRadius: s(18),
    backgroundColor: 'rgba(102,198,230,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102,198,230,0.35)',
    gap: s(10),
  },
  statusBoxOk: {
    backgroundColor: 'rgba(91,214,138,0.1)',
    borderColor: 'rgba(91,214,138,0.45)',
  },
  statusBoxWarn: {
    backgroundColor: 'rgba(245,185,78,0.12)',
    borderColor: 'rgba(245,185,78,0.5)',
  },
  statusBoxError: {
    backgroundColor: 'rgba(255,122,122,0.12)',
    borderColor: 'rgba(255,122,122,0.5)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  statusTitle: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.t1,
  },
  statusText: {
    flexShrink: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.4),
    color: FaunaColors.t2,
  },
  progressTrack: {
    height: s(10),
    borderRadius: s(5),
    backgroundColor: 'rgba(167,196,234,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: s(5),
    backgroundColor: FaunaColors.cyan,
  },
  warnings: {
    gap: s(4),
  },
  warningsTitle: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    color: FaunaColors.amberHi,
  },
  warningItem: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t3,
  },

  // List
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(14),
  },
  listTitle: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    color: FaunaColors.t1,
  },
  refreshBtn: {
    minWidth: s(120),
    height: s(44),
    paddingHorizontal: s(16),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t2,
  },
  pollNote: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t3,
    marginBottom: s(12),
  },
  listPlaceholder: {
    alignItems: 'center',
    gap: s(12),
    paddingVertical: s(40),
  },
  placeholderText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    color: FaunaColors.t3,
    textAlign: 'center',
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(18),
    padding: s(18),
    marginBottom: s(14),
    borderRadius: s(22),
    backgroundColor: 'rgba(22,32,74,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.22)',
  },
  gameCardReady: {
    borderColor: 'rgba(91,214,138,0.55)',
  },
  gameIcon: {
    width: s(64),
    height: s(64),
    borderRadius: s(18),
    backgroundColor: 'rgba(102,198,230,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameIconText: {
    fontSize: s(32),
  },
  gameInfo: {
    flex: 1,
    gap: s(4),
  },
  gameNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  gameName: {
    flexShrink: 1,
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.t1,
  },
  distChip: {
    paddingVertical: s(2),
    paddingHorizontal: s(10),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(167,196,234,0.14)',
  },
  distChipTargeted: {
    backgroundColor: 'rgba(102,198,230,0.18)',
  },
  distChipText: {
    fontSize: s(13),
    fontWeight: '800',
    color: FaunaColors.t3,
  },
  gameMeta: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t4,
  },
  gameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: s(2),
  },
  statusDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
  },
  gameStatus: {
    flexShrink: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
  },
  gameActions: {
    alignItems: 'stretch',
    gap: s(8),
    minWidth: s(150),
  },
  btnPlay: {
    minHeight: s(52),
    paddingHorizontal: s(20),
    borderRadius: FaunaRadius.pill,
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlayText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: '#2B2208',
  },
  btnSmallGhost: {
    minHeight: s(40),
    paddingHorizontal: s(14),
    borderRadius: FaunaRadius.pill,
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSmallGhostText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: FaunaColors.t3,
  },
});
