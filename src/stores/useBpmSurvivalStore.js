import { create } from 'zustand';

/**
 * BPM Survival 게임 상태 스토어
 *
 * phase:
 *   'idle'    - 시작 전 (BPM 선택 화면)
 *   'playing' - 게임 중
 *   'dead'    - 게임 오버
 *
 * bpm        - 플레이어가 선택한 시작 BPM (기본 60)
 * currentBpm - 게임 중 실시간 BPM (생존 시간에 따라 자동 증가)
 */
const useBpmSurvivalStore = create((set) => ({
    phase:      'idle',
    bpm:        60,
    currentBpm: 60,
    score:      0,
    difficulty: 'normal',   // 'normal' | 'hard'
    bgmVolume:  0.15,        // BGM 볼륨 (0 ~ 0.3, 100% = 0.3), 기본 50%

    startGame:      () => set((s) => ({ phase: 'playing', score: 0, currentBpm: s.bpm })),
    gameOver:       () => set({ phase: 'dead' }),
    setScore:       (score) => set({ score }),
    setCurrentBpm:  (currentBpm) => set({ currentBpm }),
    setDifficulty:  (difficulty) => set({ difficulty }),
    setBgmVolume:   (bgmVolume) => set({ bgmVolume }),
}));

export default useBpmSurvivalStore;
