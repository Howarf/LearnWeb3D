import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CapsuleCollider, CuboidCollider } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CharModel } from './MyCharacter';
import useBpmSurvivalStore from '../stores/useBpmSurvivalStore';
import styles from '../css/BpmSurvival.module.css';

// ─────────────────────────────────────────────────────────
// 공통 상수
// ─────────────────────────────────────────────────────────
const JUMP_VEL          = 12;   // 점프 발사 Y속도 (항상 max height 도달)
const GRAVITY_SCALE_CUT = 4;    // 조기 릴리즈 시 중력 배율 (빠른 상승 컷)
const GRAVITY_SCALE_DEF = 1;    // 기본 중력 배율
const ORBIT_SPEED       = 6.0;  // A/D 공전 선속도 (units/s, 반경 무관 일정)
const TRACK_GAIN        = 14;   // P 컨트롤러 gain (XZ 추종 강도)

// BPM → 막대기 각속도 변환
// 한 박자(60/BPM 초)마다 π/2 rad (1/4 바퀴) 회전
const bpmToSpeed = (bpm) => (bpm / 60) * (Math.PI / 2);

// ─────────────────────────────────────────────────────────
// Crumbling Pie Stage 설정
// ─────────────────────────────────────────────────────────
const SLICE_COUNT   = 8;
const SLICE_ANGLE   = (Math.PI * 2) / SLICE_COUNT;  // 45° per slice
const SLICE_Y_SAFE  = 0;
const SLICE_Y_DROP  = -30;
const WARNING_DUR   = 1.5;    // 경고 지속 시간 (s)
const DROP_DUR_MIN  = 3.0;    // 낙하 후 대기 최소 (s)
const DROP_DUR_MAX  = 5.0;    // 낙하 후 대기 최대 (s)
const DROP_SPEED    = 16;     // 낙하 lerp 속도
const RESTORE_SPEED = 1.6;    // 복구 lerp 속도

// 난이도: 점수에 따라 동시 붕괴 슬라이스 수 / 패턴 주기
function getDifficultyCount(score) {
    if (score >= 60) return 4;
    if (score >= 40) return 3;
    if (score >= 20) return 2;
    return 1;
}
function getPatternInterval(score) {
    if (score >= 60) return 2.5;
    if (score >= 40) return 3.0;
    if (score >= 20) return 3.5;
    return 4.0;
}

// ─────────────────────────────────────────────────────────
// 모듈 스코프 재사용 객체 (매 프레임 new 할당 제거)
// ─────────────────────────────────────────────────────────
const _q = new THREE.Quaternion(); // Bar 회전용 Quaternion 재사용
const _e = new THREE.Euler();      // Bar 회전용 Euler 재사용

// Stage 색상 상수 (문자열 파싱 제거 → THREE.Color.copy 사용)
const C_SAFE_BASE   = new THREE.Color('#4ecdc4');
const C_SAFE_EMI    = new THREE.Color('#1a5c58');
const C_WARN_A_BASE = new THREE.Color('#e67e22');
const C_WARN_A_EMI  = new THREE.Color('#7f3a00');
const C_WARN_B_BASE = new THREE.Color('#c0392b');
const C_WARN_B_EMI  = new THREE.Color('#3a0000');
const C_DROP_BASE   = new THREE.Color('#1a0a0a');
const C_DROP_EMI    = new THREE.Color('#000000');

// ─────────────────────────────────────────────────────────
// Stage: 8개 파이 슬라이스가 순서대로 무너지는 플랫폼
//   safe    → (패턴 트리거) → warning (1.5s, 진동+색상)
//   warning → drop (3~5s, 아래로 낙하)
//   drop    → restore (서서히 복귀)
//   restore → safe
// ─────────────────────────────────────────────────────────
function Stage() {
    const sliceRefs   = useRef(Array.from({ length: SLICE_COUNT }, () => null));
    // 슬라이스당 재질 배열: [0]=메인 실린더, [1]=좌측 절단면, [2]=우측 절단면
    const matRefs     = useRef(Array.from({ length: SLICE_COUNT }, () => []));
    const sliceStates = useRef(
        Array.from({ length: SLICE_COUNT }, () => ({
            phase: 'safe',     // 'safe' | 'warning' | 'drop' | 'restore'
            timer: 0,
            y:     SLICE_Y_SAFE,
        }))
    );
    const patternTimer = useRef(3.5);   // 첫 붕괴까지 초기 딜레이

    const phase = useBpmSurvivalStore((s) => s.phase);

    useFrame((_, delta) => {
        if (phase !== 'playing') return;

        const states = sliceStates.current;
        // 구독 없이 최신 score 직접 읽기 (매 프레임 re-render 방지)
        const score  = useBpmSurvivalStore.getState().score;

        // ── 패턴 타이머: 주기적으로 슬라이스 warning 트리거 ──────
        patternTimer.current -= delta;
        if (patternTimer.current <= 0) {
            patternTimer.current = getPatternInterval(score);

            const count = getDifficultyCount(score);
            // safe 상태인 슬라이스 인덱스 수집 후 셔플
            const safeIdxs = states
                .map((s, i) => (s.phase === 'safe' ? i : -1))
                .filter((i) => i !== -1);
            for (let k = safeIdxs.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1));
                [safeIdxs[k], safeIdxs[j]] = [safeIdxs[j], safeIdxs[k]];
            }
            safeIdxs.slice(0, count).forEach((i) => {
                states[i].phase = 'warning';
                states[i].timer = WARNING_DUR;
            });
        }

        // ── 슬라이스별 상태 머신 ─────────────────────────────────
        for (let i = 0; i < SLICE_COUNT; i++) {
            const s    = states[i];
            const ref  = sliceRefs.current[i];
            const mats = matRefs.current[i];
            if (!ref) continue;

            const applyColor = (baseColor, emissiveColor, emissiveIntensity) => {
                mats.forEach(m => {
                    if (!m) return;
                    m.color.copy(baseColor);
                    m.emissive.copy(emissiveColor);
                    m.emissiveIntensity = emissiveIntensity;
                });
            };

            if (s.phase === 'warning') {
                s.timer -= delta;
                const centerAng = i * SLICE_ANGLE + SLICE_ANGLE * 0.5;
                const elapsed   = WARNING_DUR - s.timer;
                const shake     = Math.sin(elapsed * 35) * 0.05;
                ref.setNextKinematicTranslation({
                    x: Math.sin(centerAng) * shake,
                    y: SLICE_Y_SAFE,
                    z: Math.cos(centerAng) * shake,
                });
                const flash = Math.sin(elapsed * 18) > 0;
                applyColor(
                    flash ? C_WARN_A_BASE : C_WARN_B_BASE,
                    flash ? C_WARN_A_EMI  : C_WARN_B_EMI,
                    0.5
                );
                if (s.timer <= 0) {
                    s.phase = 'drop';
                    s.timer = DROP_DUR_MIN + Math.random() * (DROP_DUR_MAX - DROP_DUR_MIN);
                }

            } else if (s.phase === 'drop') {
                s.timer -= delta;
                s.y += (SLICE_Y_DROP - s.y) * Math.min(delta * DROP_SPEED, 1);
                ref.setNextKinematicTranslation({ x: 0, y: s.y, z: 0 });
                applyColor(C_DROP_BASE, C_DROP_EMI, 0);
                if (s.timer <= 0) s.phase = 'restore';

            } else if (s.phase === 'restore') {
                s.y += (SLICE_Y_SAFE - s.y) * Math.min(delta * RESTORE_SPEED, 1);
                ref.setNextKinematicTranslation({ x: 0, y: s.y, z: 0 });
                applyColor(C_SAFE_BASE, C_SAFE_EMI, 0.25);
                if (Math.abs(s.y - SLICE_Y_SAFE) < 0.05) {
                    s.y     = SLICE_Y_SAFE;
                    s.phase = 'safe';
                    ref.setNextKinematicTranslation({ x: 0, y: SLICE_Y_SAFE, z: 0 });
                }

            } else {
                ref.setNextKinematicTranslation({ x: 0, y: SLICE_Y_SAFE, z: 0 });
                applyColor(C_SAFE_BASE, C_SAFE_EMI, 0.25);
            }
        }
    });

    return (
        <>
            {/* ── 8개 파이 슬라이스 (각각 hull 콜라이더) ────── */}
            {Array.from({ length: SLICE_COUNT }, (_, i) => {
                const θL   = i * SLICE_ANGLE;
                const θR   = (i + 1) * SLICE_ANGLE;
                const half = STAGE_R / 2;
                // CylinderGeometry 각도 규칙: theta=0 → +Z, sin/cos 순서
                const capProps = (θ) => ({
                    position: [half * Math.sin(θ), 0, half * Math.cos(θ)],
                    rotation: [0, θ - Math.PI / 2, 0],
                });
                const capMat = (idx) => (
                    <meshStandardMaterial
                        color="#4ecdc4"
                        emissive="#1a5c58"
                        emissiveIntensity={0.25}
                        metalness={0.5}
                        roughness={0.25}
                        side={THREE.DoubleSide}
                        ref={(el) => { if (el) matRefs.current[i][idx] = el; }}
                    />
                );
                return (
                    <RigidBody
                        key={i}
                        ref={(el) => { sliceRefs.current[i] = el; }}
                        type="kinematicPosition"
                        colliders="hull"
                        position={[0, SLICE_Y_SAFE, 0]}
                        name="stage"
                    >
                        {/* 메인 파이 슬라이스 */}
                        <mesh
                            receiveShadow
                            ref={(el) => { if (el) matRefs.current[i][0] = el.material; }}
                        >
                            <cylinderGeometry
                                args={[STAGE_R, STAGE_R, 0.5, 32, 1, false, i * SLICE_ANGLE, SLICE_ANGLE]}
                            />
                            <meshStandardMaterial
                                color="#4ecdc4"
                                emissive="#1a5c58"
                                emissiveIntensity={0.25}
                                metalness={0.5}
                                roughness={0.25}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        {/* 좌측 절단면 */}
                        <mesh receiveShadow {...capProps(θL)}>
                            <planeGeometry args={[STAGE_R, 0.5]} />
                            {capMat(1)}
                        </mesh>
                        {/* 우측 절단면 */}
                        <mesh receiveShadow {...capProps(θR)}>
                            <planeGeometry args={[STAGE_R, 0.5]} />
                            {capMat(2)}
                        </mesh>
                    </RigidBody>
                );
            })}

        </>
    );
}

// ─────────────────────────────────────────────────────────
// Dual Spinners 설정
// ─────────────────────────────────────────────────────────
const STAGE_R         = 6.25;         // stage 반지름 (원본 5 * 1.25)
const BAR_LENGTH      = STAGE_R * 2;  // 막대 전체 길이 = stage 지름 (10)
const BAR_RADIUS      = 0.15;         // 원기둥 막대의 반지름

// Low Bar: 바닥을 쓸며 회전 → 점프로 회피
const LOW_BAR_Y       = 0.25 + BAR_RADIUS;   // stage top + 막대 반지름
// High Bar: 플레이어 머리 위를 지나며 회전 → 점프하면 부딪힘
const HIGH_BAR_Y      = 1.8;

// High Bar 속도 배율: Low Bar와 엇박자가 나도록
const HIGH_BAR_MULT   = 0.75;

const RADIAL_SPEED    = 3.5;          // W/S 반경 이동 속도
const RADIUS_MIN      = 0.5;          // 최소 반경 (중심 진입 방지)
const RADIUS_MAX      = STAGE_R - 0.3; // 최대 반경 (stage 끝 이탈 방지)
const RADIUS_DEFAULT  = STAGE_R * 0.5; // 초기 반경

// CylinderGeometry는 Y축 기준 → Z축 90° 회전으로 눕혀 X축 방향으로 배치
function BarMesh({ color, emissive }) {
    return (
        <group rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[BAR_RADIUS, BAR_RADIUS, BAR_LENGTH, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.6}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>
        </group>
    );
}

// ─────────────────────────────────────────────────────────
// Dual Spinners: Low Bar (하단) + High Bar (상단)
//   - 막대가 원점 중앙을 기준으로 양쪽으로 뻗음 (지름 전체)
//   - 비주얼: CylinderGeometry (Z축 90° 회전으로 눕혀서 X축 방향 배치)
//   - Low Bar  — bpmToSpeed(bpm)        → 점프로 회피
//   - High Bar — bpmToSpeed(bpm) * 0.75 → 점프하면 충돌 (엇박자)
// ─────────────────────────────────────────────────────────
function Bar() {
    const lowRef    = useRef(null);
    const highRef   = useRef(null);
    // lowAngle 초기값: π/2 (90°) → 막대가 Z축 방향으로 시작
    // 플레이어 초기 위치(+X 방향)와 겹치지 않아 시작 즉시 게임오버 방지
    const lowAngle  = useRef(Math.PI / 2);
    const highAngle = useRef(Math.PI);  // 180° 오프셋으로 시작 → 처음부터 엇박자
    
    const difficulty = useBpmSurvivalStore((s) => s.difficulty);
    const gameOver   = useBpmSurvivalStore((s) => s.gameOver);

    useFrame((_, delta) => {
        // getState()로 직접 읽기 → 클로저 stale 방지 (CLAUDE.md 규칙)
        const { phase, currentBpm } = useBpmSurvivalStore.getState();
        if (phase !== 'playing') return;

        const speed = bpmToSpeed(currentBpm);

        if (lowRef.current) {
            lowAngle.current += delta * speed;
            _e.set(0, lowAngle.current, 0);
            _q.setFromEuler(_e);
            lowRef.current.setNextKinematicRotation(_q);
        }

        if (highRef.current) {
            highAngle.current -= delta * speed * HIGH_BAR_MULT;
            _e.set(0, highAngle.current, 0);
            _q.setFromEuler(_e);
            highRef.current.setNextKinematicRotation(_q);
        }
    });

    const handleHit = ({ other }) => {
        if (other.rigidBodyObject?.name === 'player' &&
            useBpmSurvivalStore.getState().phase === 'playing') {
            gameOver();
        }
    };

    return (
        <>
            {/* ── Low Bar: 바닥을 쓸며 회전 (주황-빨강) ─── */}
            <RigidBody
                ref={lowRef}
                type="kinematicPosition"
                position={[0, LOW_BAR_Y, 0]}
                colliders={false}
                name="bar"
                onCollisionEnter={handleHit}
            >
                <CuboidCollider args={[BAR_LENGTH / 2, BAR_RADIUS, BAR_RADIUS]} />
                <BarMesh color="#e84118" emissive="#c0392b" />
                <pointLight color="#ff4500" intensity={1.5} distance={4} decay={2} />
            </RigidBody>

            {/* ── High Bar: hard 난이도에서만 등장 (보라) ── */}
            {difficulty === 'hard' && (
                <RigidBody
                    ref={highRef}
                    type="kinematicPosition"
                    position={[0, HIGH_BAR_Y, 0]}
                    colliders={false}
                    name="bar"
                    onCollisionEnter={handleHit}
                >
                    <CuboidCollider args={[BAR_LENGTH / 2, BAR_RADIUS, BAR_RADIUS]} />
                    <BarMesh color="#8e44ad" emissive="#6c3483" />
                    <pointLight color="#9b59b6" intensity={1.5} distance={4} decay={2} />
                </RigidBody>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────
// 플레이어: 원형 orbit 이동 + 자유 반경 이동
//   A / D  → 공전 (orbit, 연속)
//   W / S  → 반경 증감 (연속, 자유)
//   SPACE  → 점프
// ─────────────────────────────────────────────────────────
function Player() {
    const playerRef    = useRef(null);
    const modelRef     = useRef(null);
    const keysRef      = useRef({});
    const isGroundedRef  = useRef(false); // 착지 여부 (contact counter 기반)
    const wasGrounded    = useRef(false); // 이전 프레임 착지 여부 (착지 전환 감지용)
    const isJumping      = useRef(false); // 점프 발사 후 아직 지면 미착지 여부
    const hasLiftedOff   = useRef(false); // 점프 후 지면에서 완전히 떨어졌는지 여부 (무한 점프 방지 핵심)
    const jumpCount      = useRef(1);     // 잔여 점프 횟수 (바닥 착지 시 1 복구, 점프 시 -1)
    const groundContacts = useRef(0);     // 발 센서 ↔ stage 접촉 카운터
    const animRef        = useRef('Idle');
    const [currentAnim, setCurrentAnim] = useState('Idle');

    // 공전 상태 (ref → 매 프레임 수정)
    const orbitAngle      = useRef(0);             // 현재 공전 각도 (rad)
    const curRadius       = useRef(RADIUS_DEFAULT); // 현재 반경
    const lastFacingAngle = useRef(0);             // 마지막 이동 방향 (캐릭터 회전용)

    const phase    = useBpmSurvivalStore((s) => s.phase);
    const gameOver = useBpmSurvivalStore((s) => s.gameOver);

    // 발 센서 콜라이더 콜백: 'stage' 접촉만 카운팅 (bar 위는 착지 불인정)
    const onGroundEnter = useCallback(({ other }) => {
        if (other.rigidBodyObject?.name === 'stage') {
            groundContacts.current += 1;
        }
    }, []);

    const onGroundExit = useCallback(({ other }) => {
        if (other.rigidBodyObject?.name === 'stage') {
            groundContacts.current = Math.max(0, groundContacts.current - 1);
        }
    }, []);

    useEffect(() => {
        const down = (e) => {
            keysRef.current[e.code] = true;
            if (phase !== 'playing') return;

            // Space keydown: 잔여 점프 횟수가 남아 있을 때만 발사
            if (e.code === 'Space') {
                e.preventDefault();
                if (e.repeat) return;  // 키 홀드 시 브라우저 반복 발사 무시
                if (jumpCount.current > 0 && playerRef.current) {
                    jumpCount.current  -= 1;    // 점프 횟수 소모
                    isJumping.current   = true;
                    hasLiftedOff.current = false; // 아직 지면에서 안 떨어짐 → 착지 판정 잠금
                    playerRef.current.setGravityScale(GRAVITY_SCALE_DEF, true);
                    const v = playerRef.current.linvel();
                    playerRef.current.setLinvel({ x: v.x, y: JUMP_VEL, z: v.z }, true);
                }
            }
        };
        const up = (e) => {
            keysRef.current[e.code] = false;
            // Space keyup: 상승 중(vel.y > 0)이면 중력을 강하게 높여 상승을 빠르게 끊음
            if (e.code === 'Space' && isJumping.current && playerRef.current) {
                const v = playerRef.current.linvel();
                if (v.y > 0) {
                    playerRef.current.setGravityScale(GRAVITY_SCALE_CUT, true);
                }
            }
        };

        window.addEventListener('keydown', down);
        window.addEventListener('keyup',   up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup',   up);
        };
    }, [phase]);

    useFrame((_, delta) => {
        if (!playerRef.current) return;

        if (phase !== 'playing') {
            playerRef.current.setLinvel({ x: 0, y: playerRef.current.linvel().y, z: 0 }, true);
            return;
        }

        const pos = playerRef.current.translation();

        // ── 낙사 감지: 슬라이스 붕괴 후 추락 ────────────────
        if (pos.y < -2) {
            gameOver();
            return;
        }

        const keys = keysRef.current;

        // ── Contact Counter 기반 착지 판정 ───────────────────
        // 발 센서 CuboidCollider가 stage와 접촉하면 groundContacts +1/-1
        const vy          = playerRef.current.linvel().y;
        const grounded_raw = groundContacts.current > 0;

        // 점프 중 지면 접촉이 끊기는 순간 → 완전 이륙으로 확정
        if (isJumping.current && !grounded_raw) {
            hasLiftedOff.current = true;
        }
        // hasLiftedOff 이전에는 착지 판정을 잠금 → 낮은 점프 무한 방지
        isGroundedRef.current = isJumping.current
            ? (hasLiftedOff.current && grounded_raw)  // 이륙 후 재착지만 인정
            : grounded_raw;
        const grounded = isGroundedRef.current;

        // ── 착지 전환 감지: 공중 → 지면 순간에만 처리 ──────
        if (grounded && !wasGrounded.current) {
            isJumping.current    = false;
            hasLiftedOff.current = false;
            jumpCount.current    = 1;   // 바닥 착지 시 점프 횟수 복구
            playerRef.current.setGravityScale(GRAVITY_SCALE_DEF, true);
        }
        wasGrounded.current = grounded;

        // ── 정점(vel.y ≤ 0) 통과 후 중력 배율 복구: 하강은 항상 자연스럽게 ──
        if (isJumping.current && vy <= 0) {
            playerRef.current.setGravityScale(GRAVITY_SCALE_DEF, true);
        }

        // ── A/D: 공전 각도, W/S: 반경 연속 변경 ──
        const angularDelta = delta * ORBIT_SPEED / Math.max(curRadius.current, 0.1);
        if (keys['KeyD']) orbitAngle.current -= angularDelta;
        if (keys['KeyA']) orbitAngle.current += angularDelta;
        if (keys['KeyW']) curRadius.current = Math.max(RADIUS_MIN, curRadius.current - delta * RADIAL_SPEED);
        if (keys['KeyS']) curRadius.current = Math.min(RADIUS_MAX, curRadius.current + delta * RADIAL_SPEED);

        // ── 목표 XZ 계산 ──────────────────────────
        const θ = orbitAngle.current;
        const r = curRadius.current;
        const targetX = r * Math.cos(θ);
        const targetZ = r * Math.sin(θ);

        // ── P 컨트롤러: 목표 위치로 속도 지령 ─────
        const vel = playerRef.current.linvel();
        playerRef.current.setLinvel({
            x: (targetX - pos.x) * TRACK_GAIN,
            y: vel.y,
            z: (targetZ - pos.z) * TRACK_GAIN,
        }, true);

        // ── 캐릭터 방향: 이동 방향으로 갱신 ─────
        if (modelRef.current) {
            const moveDx = targetX - pos.x;
            const moveDz = targetZ - pos.z;
            if (Math.sqrt(moveDx * moveDx + moveDz * moveDz) > 0.05) {
                const angle = Math.atan2(moveDx, moveDz);
                lastFacingAngle.current = angle;
                modelRef.current.rotation.y = angle;
            }
        }

        // ── 애니메이션 전환 ───────────────────────
        const isMoving = keys['KeyA'] || keys['KeyD'] || keys['KeyW'] || keys['KeyS'];
        const newAnim = !grounded ? 'Jump' : isMoving ? 'Walk' : 'Idle';
        if (newAnim !== animRef.current) {
            animRef.current = newAnim;
            setCurrentAnim(newAnim);
        }
    });

    return (
        <RigidBody
            ref={playerRef}
            type="dynamic"
            position={[RADIUS_DEFAULT, 2.5, 0]}
            colliders={false}
            enabledRotations={[false, false, false]}
            linearDamping={0.3}
            name="player"
        >
            <CapsuleCollider args={[0.25, 0.25]} />
            {/* 발 센서: stage 접촉만 감지 (bar 위에 서도 착지 불인정) */}
            <CuboidCollider
                sensor
                args={[0.22, 0.05, 0.22]}
                position={[0, -0.5, 0]}
                onIntersectionEnter={onGroundEnter}
                onIntersectionExit={onGroundExit}
            />
            <group ref={modelRef} position={[0, -0.5, 0]} scale={0.35}>
                <CharModel currentAnim={currentAnim} />
            </group>
        </RigidBody>
    );
}
// BPM 최대값
const MAX_BPM = 200;

// 생존 시간 추적 + currentBpm 자동 증가
// currentBpm = baseBpm + score * 0.5 (초당 0.5 BPM 증가, 최대 MAX_BPM)
function ScoreTracker() {
    const phase         = useBpmSurvivalStore((s) => s.phase);
    const setScore      = useBpmSurvivalStore((s) => s.setScore);
    const setCurrentBpm = useBpmSurvivalStore((s) => s.setCurrentBpm);
    const elapsed       = useRef(0);
    const prevScoreRef  = useRef(-1); // 이전 score (값 변경 시에만 setScore 호출)
    const prevBpmRef    = useRef(-1); // 이전 BPM   (값 변경 시에만 setCurrentBpm 호출)

    useFrame((_, delta) => {
        if (phase !== 'playing') return;
        elapsed.current += delta;

        const score = Math.floor(elapsed.current * 10) / 10;
        if (score !== prevScoreRef.current) {
            prevScoreRef.current = score;
            setScore(score);
        }

        const baseBpm = useBpmSurvivalStore.getState().bpm;
        const newBpm  = Math.round(Math.min(baseBpm + score * 0.5, MAX_BPM) * 10) / 10;
        if (newBpm !== prevBpmRef.current) {
            prevBpmRef.current = newBpm;
            setCurrentBpm(newBpm);
        }
    });

    useEffect(() => {
        if (phase === 'playing') {
            elapsed.current      = 0;
            prevScoreRef.current = -1; // 게임 시작 시 감시 ref 초기화
            prevBpmRef.current   = -1;
        }
    }, [phase]);

    return null;
}

// ─────────────────────────────────────────────────────────
// 씬 내부
// ─────────────────────────────────────────────────────────
function Scene() {
    return (
        <>
            <ambientLight intensity={1.2} />
            <directionalLight
                position={[8, 20, 8]}
                intensity={2}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.1}
                shadow-camera-far={100}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
            />
            <directionalLight position={[-8, 10, -8]} intensity={0.8} />
            <pointLight position={[0, 8, 0]} intensity={1} color="#ffffff" />

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={10}
                maxDistance={25}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                target={[0, 0.5, 0]}
            />
            <Stage />
            <Bar />
            <Player />
            <ScoreTracker />
        </>
    );
}

// ─────────────────────────────────────────────────────────
// BGM: AudioContext 기반 재생 (브라우저 Autoplay 정책 준수)
//   - AudioContext는 사용자 인터랙션(Start 버튼) 이후 최초 생성/재개
//   - playbackRate: currentBpm / bpm 비율로 실시간 조절
// ─────────────────────────────────────────────────────────
function Bgm() {
    const ctxRef         = useRef(null);
    const sourceRef      = useRef(null);
    const gainRef        = useRef(null);
    const bufferRef      = useRef(null);  // 디코딩된 AudioBuffer
    const rawRef         = useRef(null);  // fetch한 원본 ArrayBuffer
    const pendingPlayRef = useRef(false); // playing이지만 buffer 미준비 상태 추적

    // source 생성 + 재생 (ctx/buffer/gain 모두 준비된 상태에서 호출)
    const doPlay = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !bufferRef.current || !gainRef.current) return;
        // 기존 소스 정지
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch (_) {}
            sourceRef.current = null;
        }
        const source = ctx.createBufferSource();
        source.buffer = bufferRef.current;
        source.loop   = true;
        // BPM 60 → 1배속, BPM 180 → 2배속, 최대 2배속 (getState로 최신값 읽기)
        source.playbackRate.value = Math.min(1 + (useBpmSurvivalStore.getState().currentBpm - 60) / 120, 2.0);
        source.connect(gainRef.current);
        source.start(0);
        sourceRef.current      = source;
        pendingPlayRef.current = false;
    }, []);

    const phase     = useBpmSurvivalStore((s) => s.phase);
    const bgmVolume = useBpmSurvivalStore((s) => s.bgmVolume);

    // 마운트 시 파일 fetch (AudioContext는 생성하지 않음)
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}music/Groovy_Booty.ogg`)
            .then((r) => r.arrayBuffer())
            .then(async (ab) => {
                rawRef.current = ab;
                // AudioContext가 이미 생성됐고 pending 상태면 → 즉시 decode + 재생
                if (ctxRef.current && pendingPlayRef.current && !bufferRef.current) {
                    try {
                        bufferRef.current = await ctxRef.current.decodeAudioData(ab.slice(0));
                        // decode 완료 후 phase 가 이미 바뀌었으면 재생 생략
                        if (useBpmSurvivalStore.getState().phase !== 'playing') return;
                        if (pendingPlayRef.current) doPlay();
                    } catch (e) {
                        console.warn('BGM decode 실패:', e);
                    }
                }
            })
            .catch(() => console.warn('BGM 파일 로드 실패'));
    }, [doPlay]);

    // phase 변화 시 재생/정지 제어
    useEffect(() => {
        if (phase !== 'playing') {
            // 소스 중지 후 suspend
            if (sourceRef.current) {
                try { sourceRef.current.stop(); } catch (_) {}
                sourceRef.current = null;
            }
            if (ctxRef.current) ctxRef.current.suspend();
            pendingPlayRef.current = false; // pending 초기화
            return;
        }

        // 사용자 인터랙션(Start) 이후 실행 → AudioContext 생성/재개 허용
        (async () => {
            try {
                if (!ctxRef.current) {
                    const ctx = new AudioContext();
                    const gain = ctx.createGain();
                    gain.gain.value = useBpmSurvivalStore.getState().bgmVolume;
                    gain.connect(ctx.destination);
                    ctxRef.current = ctx;
                    gainRef.current = gain;
                }
                await ctxRef.current.resume();

                // ArrayBuffer → AudioBuffer 디코딩 (최초 1회)
                if (!bufferRef.current && rawRef.current) {
                    bufferRef.current = await ctxRef.current.decodeAudioData(rawRef.current.slice(0));
                }

                if (!bufferRef.current) {
                    // fetch 아직 미완료 → pending 표시 (fetch 완료 시 doPlay 자동 호출됨)
                    pendingPlayRef.current = true;
                    return;
                }

                doPlay();
            } catch (e) {
                console.warn('BGM 재생 실패:', e);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, doPlay]);

    // playbackRate 실시간 조절: useFrame에서 직접 대입 (effect 제거, CLAUDE.md 규칙)
    useFrame(() => {
        if (!sourceRef.current) return;
        sourceRef.current.playbackRate.value = Math.min(
            1 + (useBpmSurvivalStore.getState().currentBpm - 60) / 120,
            2.0
        );
    });

    // 볼륨 실시간 조절
    useEffect(() => {
        if (!gainRef.current) return;
        gainRef.current.gain.value = bgmVolume;
    }, [bgmVolume]);

    // 언마운트 시 AudioContext 닫기
    useEffect(() => {
        return () => {
            if (sourceRef.current) {
                try { sourceRef.current.stop(); } catch (_) {}
            }
            if (ctxRef.current) ctxRef.current.close();
        };
    }, []);

    return null;
}

// ─────────────────────────────────────────────────────────
// 오버레이 UI
// ─────────────────────────────────────────────────────────
function IdleScreen({ onStart }) {
    const difficulty    = useBpmSurvivalStore((s) => s.difficulty);
    const setDifficulty = useBpmSurvivalStore((s) => s.setDifficulty);

    return (
        <div className={styles.overlay}>
            <h1 className={styles.idleTitle}>BPM SURVIVAL</h1>
            <p className={styles.idleSubtitle}>JUMP OVER THE SPINNING BAR</p>

            <p className={styles.diffLabel}>DIFFICULTY</p>
            <div className={styles.diffButtons}>
                <button
                    onClick={() => setDifficulty('normal')}
                    className={`${styles.diffButton} ${difficulty === 'normal' ? styles.diffButtonActive : ''}`}
                >
                    NORMAL<br />
                    <span className={styles.diffDesc}>1 BAR</span>
                </button>
                <button
                    onClick={() => setDifficulty('hard')}
                    className={`${styles.diffButton} ${difficulty === 'hard' ? styles.diffButtonActiveHard : ''}`}
                >
                    HARD<br />
                    <span className={styles.diffDesc}>2 BARS</span>
                </button>
            </div>

            <button onClick={onStart} className={styles.startButton}>START</button>

            <p className={styles.hint}>
                A/D — Orbit &nbsp;|&nbsp; W/S — Radius &nbsp;|&nbsp; SPACE — Jump &nbsp;|&nbsp; Drag — Camera
            </p>
        </div>
    );
}

function PlayingHUD() {
    const currentBpm   = useBpmSurvivalStore((s) => s.currentBpm);
    const score        = useBpmSurvivalStore((s) => s.score);
    const bgmVolume    = useBpmSurvivalStore((s) => s.bgmVolume);
    const setBgmVolume = useBpmSurvivalStore((s) => s.setBgmVolume);

    return (
        <>
            <div className={styles.hudBpm}>
                BPM <span className={styles.hudBpmValue}>{Math.round(currentBpm)}</span>
            </div>
            <div className={styles.hudScore}>
                TIME<br />
                <span className={styles.hudScoreValue}>{score.toFixed(1)}s</span>
            </div>
            {/* ── BGM 볼륨 컨트롤 ── */}
            <div className={styles.hudVolume}>
                <span className={styles.hudVolumeIcon}>♪</span>
                <input
                    type="range"
                    min={0}
                    max={0.3}
                    step={0.003}
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                    className={styles.hudVolumeSlider}
                />
                <span className={styles.hudVolumeValue}>{Math.round((bgmVolume / 0.3) * 100)}</span>
            </div>
            <div className={styles.hudHint}>
                WASD — Move &nbsp;|&nbsp; SPACE — Jump
            </div>
        </>
    );
}

function DeadScreen({ onRetry }) {
    const score = useBpmSurvivalStore((s) => s.score);

    return (
        <div className={styles.overlay}>
            <h1 className={styles.deadTitle}>GAME OVER</h1>
            <p className={styles.survivedLabel}>SURVIVED</p>
            <p className={styles.survivedScore}>{score.toFixed(1)}s</p>
            <button onClick={onRetry} className={styles.retryButton}>RETRY</button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// 메인 페이지 컴포넌트
// ─────────────────────────────────────────────────────────
export default function BpmSurvival() {
    const phase     = useBpmSurvivalStore((s) => s.phase);
    const startGame = useBpmSurvivalStore((s) => s.startGame);
    // physicsKey 변경 시 Physics 전체 리셋 → 플레이어 위치 초기화
    const [physicsKey, setPhysicsKey] = useState(0);

    const handleStart = () => {
        startGame();
        setPhysicsKey((k) => k + 1);
    };

    return (
        <div className={styles.root}>
            <Canvas shadows camera={{ position: [0, 10, 16], fov: 50 }} gl={{ antialias: true }}>
                {/* Bgm: null 반환, Canvas 안에 두어 useFrame 사용 가능 / Physics 밖이라 physicsKey 리셋 영향 없음 */}
                <Bgm />
                <Physics key={physicsKey} gravity={[0, -20, 0]}>
                    <Scene />
                </Physics>
            </Canvas>

            {phase === 'idle'    && <IdleScreen onStart={handleStart} />}
            {phase === 'playing' && <PlayingHUD />}
            {phase === 'dead'    && <DeadScreen onRetry={handleStart} />}
        </div>
    );
}
