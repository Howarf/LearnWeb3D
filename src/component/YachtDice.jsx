import { Bounds, Environment, Html, useGLTF, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { CuboidCollider, MeshCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { getModelUrl } from '../supabaseClient'
import { useEffect, useState, useMemo, useRef, Suspense } from 'react'
import { GAME_STATE, useDiceGameStore } from '../stores/useDiceGameStore'
import styles from "../css/diceGame.module.css"

const faces = [
    { dir: new THREE.Vector3(0, 1, 0), value: 1 },
    { dir: new THREE.Vector3(1, 0, 0), value: 2 }, 
    { dir: new THREE.Vector3(0, 0, 1), value: 3 },  
    { dir: new THREE.Vector3(0, 0, -1), value: 4 }, 
    { dir: new THREE.Vector3(-1, 0, 0), value: 5 }, 
    { dir: new THREE.Vector3(0, -1, 0), value: 6 }, 
]

const fixeDice_P = [
    new THREE.Vector3(-2.7, 1.5, -3.3),
    new THREE.Vector3(-1.35, 1.5, -3.3),
    new THREE.Vector3(0, 1.5, -3.3),
    new THREE.Vector3(1.35, 1.5, -3.3),
    new THREE.Vector3(2.7, 1.5, -3.3),
]

function Dice({index, ...props}){
    const { scene } = useGLTF(getModelUrl('D6.glb'))
    const clonedScene = useMemo(() => scene.clone(), [scene])
    const curVec = useMemo(() => new THREE.Vector3(), [])
    const curQuat = useMemo(() => new THREE.Quaternion(), [])
    const rigidRef = useRef()
    const gameState = useDiceGameStore((state)=> state.gameState)
    const keeps = useDiceGameStore((state) => state.keeps)
    const toggleKeep = useDiceGameStore((state) => state.toggleKeep)
    const setDiceResult = useDiceGameStore((state) => state.setDiceResult)
    const isFixed = keeps.some(k => k.originalIndex === index)
    const keepOrderIndex = keeps.findIndex(k => k.originalIndex === index)
    const [physicsType, setPhysicsType] = useState("dynamic")
    const [savedRot, setSaveRot] = useState(new THREE.Quaternion())
    const [hovered, setHovered] = useState(false)
    const spacing = 2.0
    const angle = (index / 5) * Math.PI * 2
    const radius = 0.6
    const resultTargetPos = useMemo(() => new THREE.Vector3((index - 2) * spacing, 7.5, 1.5), [index])
    const saveTargetPos = keepOrderIndex !== -1 ? fixeDice_P[keepOrderIndex] : fixeDice_P[0]
    const glassPos = useMemo(() => new THREE.Vector3(
        7 + Math.cos(angle) * radius,
        2 + index * 0.8,
        Math.sin(angle) * radius
    ), [index])
    const glassOffset = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 1, 0, (Math.random() - 0.5) * 1), [])
    useEffect(() => {
        clonedScene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [clonedScene])

    useEffect(()=> {
        document.body.style.cursor = (hovered && gameState === GAME_STATE.ENDED) ? 'pointer' : 'auto'
        return () => { document.body.style.cursor = 'auto' }
    }, [hovered])

    useEffect(() => {
        let timerId
        if(gameState === GAME_STATE.GAME_OVER && rigidRef.current){
            rigidRef.current.setTranslation({
                x: props.position[0], 
                y: props.position[1] - 4, 
                z: props.position[2]
            }, true)
            rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
            timerId = setTimeout(() => {setPhysicsType("dynamic")}, 100)
            rigidRef.current.wakeUp()
        }else if(gameState === GAME_STATE.READY && !isFixed && rigidRef.current){
            setPhysicsType("dynamic")
            rigidRef.current.setTranslation(glassPos.clone().add(glassOffset), true)
            rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
            rigidRef.current.wakeUp()
            timerId = setTimeout(() => {
                if (rigidRef.current && gameState === GAME_STATE.READY) {
                    rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
                    rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
                }
            }, 50)
        }else if(gameState === GAME_STATE.THROWN && !isFixed && rigidRef.current){
            setPhysicsType("dynamic")
            rigidRef.current.wakeUp()
            timerId = setTimeout(()=>{
                rigidRef.current.applyImpulse({
                    x: -13 - Math.random() * 2, 
                    y: -2,
                    z: (Math.random() - 0.5) * 2
                }, true)
                rigidRef.current.applyTorqueImpulse({
                    x: Math.random() * 5, y: Math.random() * 5, z: Math.random() * 5
                }, true)
            }, 200)
        }else if(gameState === GAME_STATE.ENDED || gameState === GAME_STATE.RETURNING || gameState === GAME_STATE.GAME_OVER){
            setPhysicsType("kinematicPosition")
        }
        return () =>{
            if(timerId) clearTimeout(timerId)
        }
    }, [gameState, isFixed])

    useFrame(() => {
        if(!rigidRef.current) return
        const currentPos = rigidRef.current.translation()
        curVec.set(currentPos.x, currentPos.y, currentPos.z)
        const curRot = rigidRef.current.rotation()
        curQuat.set(curRot.x, curRot.y, curRot.z, curRot.w)
        if(isFixed){
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(saveTargetPos, 0.15))
            rigidRef.current.setNextKinematicRotation(curQuat.slerp(savedRot, 0.1))
            return
        }
        if(gameState === GAME_STATE.ENDED){
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(resultTargetPos, 0.1))
            rigidRef.current.setNextKinematicRotation(curQuat.slerp(savedRot, 0.1))
        }
        else if(gameState === GAME_STATE.RETURNING){
            const target = glassPos.clone().add(glassOffset)
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(target, 0.075))
        }
    })

    const checkResult = () => {
        if(!rigidRef.current || gameState !== GAME_STATE.THROWN || isFixed) return
        rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
        const rotation = rigidRef.current.rotation()
        const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))
        const snappedEuler = new THREE.Euler(
            Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2),
            Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2),
            Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2)
        )
        const snappedQuat = new THREE.Quaternion().setFromEuler(snappedEuler)
        const worldUp = new THREE.Vector3(0, 1, 0)
        let bestMatch = 0
        let maxDot = -Infinity
        faces.forEach((face) => {
            const faceDir = face.dir.clone().applyQuaternion(snappedQuat)
            const dot = faceDir.dot(worldUp)
            if(dot > maxDot){ maxDot = dot; bestMatch = face.value; }
        })
        setSaveRot(snappedQuat)
        setDiceResult(index, bestMatch)
    }
    return(
        <RigidBody 
            ref={rigidRef}
            type={physicsType}
            onSleep={checkResult}
            restitution={0.2}
            restitutionCombineRule="max"
            ccd={true}
            {...props}
            onClick={(e) =>{
                e.stopPropagation()
                toggleKeep(index)
                if(rigidRef.current) rigidRef.current.wakeUp()
            }}
            onPointerOver={(e) =>{
                e.stopPropagation()
                if(gameState === GAME_STATE.ENDED) setHovered(true)
            }}
            onPointerOut={(e) =>{
                e.stopPropagation()
                if(gameState === GAME_STATE.ENDED) setHovered(false)
            }}
        >
            <primitive object={clonedScene} />
        </RigidBody>
    )
}

function Glass(props){
    const { scene } = useGLTF(getModelUrl('yachtDice_glass.glb'))
    const rigidRef = useRef()
    const gameState = useDiceGameStore((state) => state.gameState)
    const startDrag = useDiceGameStore((state) => state.startDrag)
    const throwCup = useDiceGameStore((state) => state.throwCup)
    const gatherDice = useDiceGameStore((state) => state.gatherDice)
    const rollCount = useDiceGameStore((state) => state.rollCount)
    const keeps = useDiceGameStore((state) => state.keeps)
    const planeIntersectPoint = useMemo(() => new THREE.Vector3(), [])
    const defualtPos = useMemo(() => new THREE.Vector3(7, 2, 0), [] )
    const curVec = useMemo(() => new THREE.Vector3(), [])
    const curQuat = useMemo(() => new THREE.Quaternion(), [])
    const uprightQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))
    useEffect(() => {
        scene.traverse((child) => {
            if(child.isMesh){ child.castShadow = true; child.receiveShadow = true; }
        })
    }, [scene])
    useFrame((state) => {
        if(!rigidRef.current) return
        const currentPos = rigidRef.current.translation()
        curVec.set(currentPos.x, currentPos.y ,currentPos.z)
        const currentRot = rigidRef.current.rotation()
        curQuat.set(currentRot.x, currentRot.y, currentRot.z, currentRot.w)
        if(gameState === GAME_STATE.DRAGGING){
            state.raycaster.setFromCamera(state.pointer, state.camera)
            const dragHeight = 5
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dragHeight)
            const intersection = state.raycaster.ray.intersectPlane(plane, planeIntersectPoint)
            if(intersection){
                const x = THREE.MathUtils.clamp(intersection.x, 4.5, 10)
                const z = THREE.MathUtils.clamp(intersection.z, -3.5, 3.5)
                rigidRef.current.setNextKinematicTranslation(curVec.lerp(new THREE.Vector3(x, dragHeight, z), 0.045))
                const targetRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, state.pointer.x * 0.5))
                rigidRef.current.setNextKinematicRotation(curQuat.slerp(targetRot, 0.1))
            }
        }else if(gameState === GAME_STATE.THROWN){
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(new THREE.Vector3(5, 5, 0), 0.1))
            const targetRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 1.5))
            rigidRef.current.setNextKinematicRotation(curQuat.slerp(targetRot, 0.1))
        }else{
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(defualtPos, 0.1))
            rigidRef.current.setNextKinematicRotation(curQuat.slerp(uprightQuat, 0.1))
        }
    })
    return(
        <RigidBody
            {...props}
            ref={rigidRef}
            colliders={false}
            type="kinematicPosition"
            onPointerMissed={() => { if(gameState === GAME_STATE.DRAGGING) throwCup() }}
        >
            <MeshCollider type="trimesh">
                <primitive 
                    object={scene}
                    onPointerDown={(e) => { e.stopPropagation(); if(gameState === GAME_STATE.READY) startDrag(); }}
                    onPointerUp={(e) => { e.stopPropagation(); if(gameState === GAME_STATE.DRAGGING) throwCup(); }}
                    onClick={(e) => {
                        e.stopPropagation()
                        if(gameState === GAME_STATE.ENDED){
                            if(rollCount === 0) {
                                alert("굴릴 수 있는 횟수를 다 사용했습니다.\n 점수를 기입해 주세요.")
                                return
                            }else if(rollCount > 0 && keeps.length === 5){
                                alert("굴릴 주사위가 없습니다.")
                                return
                            }
                            gatherDice()
                        }
                    }}
                />
            </MeshCollider>
        </RigidBody>
    )
}

function Case(props){
    const {scene} = useGLTF(getModelUrl("yachtDice_case.glb"))
    useEffect(() => {
        scene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [scene])
    return(
        <RigidBody colliders={false} type='fixed' {...props}>
            <MeshCollider type="trimesh">
                <primitive object={scene} />
            </MeshCollider>
        </RigidBody>
    )
}

function Boundaries() {
    return (
        <RigidBody type="fixed" colliders={false}>
            <CuboidCollider position={[0, 15, 0]} args={[20, 1, 20]} />
            <CuboidCollider position={[-5, 5, 0]} args={[1, 10, 20]} />
            <CuboidCollider position={[12, 5, 0]} args={[1, 10, 20]} />
            <CuboidCollider position={[0, 5, 8]} args={[20, 10, 1]} />
            <CuboidCollider position={[0, 5, -8]} args={[20, 10, 1]} />
        </RigidBody>
    )
}

function Panel(props){
    return(
        <RigidBody {...props}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color={"white"} />
            </mesh>
        </RigidBody>
    )
}

function calculatePotentialScores(dice){
    if (dice.includes(null) || dice.length !== 5) return {}
    const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    let sum = 0
    dice.forEach(d => {
        counts[d]++
        sum += d
    })
    const hasCount = (count) => Object.values(counts).some(c => c>= count)
    const getCounts = () => Object.values(counts).sort((a, b) => b - a)
    const uniqueDice = [...new Set(dice)].sort((a, b) => a - b)
    const str = uniqueDice.join('')
    const smallStraight = str.includes('1234') || str.includes('2345') || str.includes('3456')
    const largeStraight = str.includes('12345') || str.includes('23456')
    return{
        aces: counts[1] * 1,
        deuces: counts[2] * 2,
        threes: counts[3] * 3,
        fours: counts[4] * 4,
        fives: counts[5] * 5,
        sixes: counts[6] * 6,
        choice: sum,
        fourOfAKind: hasCount(4) ? sum : 0,
        fullHouse: (getCounts()[0] === 3 && getCounts()[1] === 2 || getCounts()[0] === 5) ? sum : 0,
        smallStraight: smallStraight ? 30 : 0,
        largeStraight: largeStraight ? 40 : 0,
        yacht: hasCount(5) ? 50 : 0
    }
}

function ScoreBoard() {
    const scores = useDiceGameStore(state => state.scores)
    const diceValues = useDiceGameStore(state => state.diceValues)
    const gameState = useDiceGameStore(state => state.gameState)
    const recordScore = useDiceGameStore(state => state.recordScore)
    const player = useDiceGameStore(state => state.player)
    const currentPlayer = useDiceGameStore(state => state.currentPlayer)
    const potentialScores = gameState === GAME_STATE.ENDED ? calculatePotentialScores(diceValues) : {}
    const playerTotals = useMemo(() => {
        return scores.map(playerScores => {
            const upperSum = ['aces', 'deuces', 'threes', 'fours', 'fives', 'sixes'].reduce((sum, key) => sum + (playerScores[key] || 0), 0)
            const bonus = upperSum >= 63 ? 35 : 0
            const totalScore = Object.values(playerScores).reduce((sum, val) => sum + (val || 0), 0) + bonus
            return { upperSum, bonus, totalScore }
        })
    }, [scores])
    const categories = [
        { id: 'aces', name: 'Aces' },
        { id: 'deuces', name: 'Deuces' },
        { id: 'threes', name: 'Threes' },
        { id: 'fours', name: 'Fours' },
        { id: 'fives', name: 'Fives' },
        { id: 'sixes', name: 'Sixes' },
    ]
    const categories2 = [
        { id: 'choice', name: 'Choice' },
        { id: 'fourOfAKind', name: '4 of a Kind' },
        { id: 'fullHouse', name: 'Full House' },
        { id: 'smallStraight', name: 'S. Straight' },
        { id: 'largeStraight', name: 'L. Straight' },
        { id: 'yacht', name: 'Yacht' },
    ]
    return(
        <div className={styles.scoreArea}>
            <h3 className={styles.scoreBoardTitle}>Score Board</h3>
            <table className={styles.scoreBoard}>
                <thead>
                    <tr>
                        <th className={styles.CategoriColumnTitle}>Categoris</th>
                        {Array.from({ length: player }).map((_, i) => (
                            <th key={i} className={styles.playerColumnTitle} style={{ 
                                color: currentPlayer === i ? 'red' : 'black',
                                textDecoration: currentPlayer === i ? 'underline' : 'none'
                            }}>
                                {i + 1}P
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr className={styles.categorieColumn} key={cat.id}>
                            <td className={styles.categorieName}>{cat.name}</td>
                            {scores.map((playerScores, pIdx) => {
                                const isLocked = playerScores[cat.id] !== null
                                const isCurrentTurn = (pIdx === currentPlayer && gameState === GAME_STATE.ENDED)
                                const potential = potentialScores[cat.id]
                                return (
                                    <td key={pIdx} className={styles.scoreBox}>
                                        {isLocked ? (
                                            <span className={styles.scoreText}>{playerScores[cat.id]}</span>
                                        ) : isCurrentTurn ? (
                                            <button className={styles.selectScore} onClick={() => recordScore(cat.id, potential)}>
                                                {potential}
                                            </button>
                                        ) : (
                                            <span className={styles.blinkText}>-</span>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    <tr className={styles.bonusColumn} id={styles.subTotal}>
                        <td>SubTotal</td>
                        {scores.map((_, pIdx) => {
                            return <td key={pIdx} className={styles.subTotalScore}>{playerTotals[pIdx].upperSum}/63</td>
                        })}
                    </tr>
                    <tr className={styles.bonusColumn} id={styles.bonus}>
                        <td>+35 Bonus</td>
                        {scores.map((_, pIdx) => {
                            return <td key={pIdx}>{playerTotals[pIdx].bonus}</td>
                        })}
                    </tr>
                </tbody>
                <tbody>
                    {categories2.map(cat => (
                        <tr className={styles.categorieColumn} key={cat.id}>
                            <td className={styles.categorieName}>{cat.name}</td>
                            {scores.map((playerScores, pIdx) => {
                                const isLocked = playerScores[cat.id] !== null
                                const isCurrentTurn = (pIdx === currentPlayer && gameState === GAME_STATE.ENDED)
                                const potential = potentialScores[cat.id]
                                return (
                                    <td key={pIdx} className={styles.scoreBox}>
                                        {isLocked ? (
                                            <span className={styles.scoreText}>{playerScores[cat.id]}</span>
                                        ) : isCurrentTurn ? (
                                            <button className={styles.selectScore} onClick={() => recordScore(cat.id, potential)}>
                                                {potential}
                                            </button>
                                        ) : (
                                            <span className={styles.blinkText}>-</span>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    <tr className={styles.TotalColumn}>
                        <td className={styles.totalText}>Total</td>
                        {scores.map((_, pIdx) => {
                            return <td key={pIdx} className={styles.totalScore}>{playerTotals[pIdx].totalScore}</td>
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function Scene(){
    const startDicePosition = [[0, 5, 0], [0, 5, 1], [0, 5, -1], [1, 5, 0], [-1, 5, 0]]
    return(
        <>
            <ambientLight color={"white"} intensity={0.5} />
            <Environment preset="city" environmentIntensity={0.3}/>
            <directionalLight 
                position={[2.5, 10, 5]} intensity={2} shadow-bias={-0.0001} 
                shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50}
                shadow-mapSize={[2048, 2048]} castShadow 
            />
            <Physics gravity={[0, -25, 0]}>
                <Panel position={[0, 0, 0]}/>
                <Boundaries />
                <Glass position={[7, 2, 0]} scale={13.2} />
                {startDicePosition.map((el, item) => {
                    return(<Dice position={el} scale={1.75} key={item} index={item}/>)
                })}
                <Case position={[0, 0, 0]} scale={2} rotation={[0, Math.PI / -2, 0]} />
            </Physics>
        </>
    )
}

function LoadingScreen() {
    const { progress } = useProgress()
    return (
        <div className={styles.loadingScreen}>
            <h1 className={styles.loadingText}>Loading Game...</h1>
            <div className={styles.loadingbar}>
                <div className={styles.progress} style={{ width: `${progress}%`}} />
            </div>
            <p className={styles.progressPercent}>{progress.toFixed(0)}%</p>
        </div>
    )
}

export default function YachtDice(){
    const gameState = useDiceGameStore((state) => state.gameState)
    const rollCount = useDiceGameStore((state) => state.rollCount)
    const startGame = useDiceGameStore((state) => state.startGame)
    const player = useDiceGameStore((state) => state.player)
    const currentPlayer = useDiceGameStore((state) => state.currentPlayer)
    const turn = useDiceGameStore((state) => state.turn)
    const addPlayer = useDiceGameStore((state) => state.addPlayer)
    const subtractPlayer = useDiceGameStore((state) => state.subtractPlayer)
    const resetToMenu = useDiceGameStore((state) => state.resetToMenu)
    const scores = useDiceGameStore(state => state.scores)
    const getWinnerText = () => {
        if (gameState !== GAME_STATE.GAME_OVER) return null;
        const totalScores = scores.map(playerScores => {
            const upperSum = ['aces', 'deuces', 'threes', 'fours', 'fives', 'sixes'].reduce((sum, key) => sum + (playerScores[key] || 0), 0)
            const bonus = upperSum >= 63 ? 35 : 0
            return Object.values(playerScores).reduce((sum, val) => sum + (val || 0), 0) + bonus
        })
        const maxScore = Math.max(...totalScores)
        const winners = totalScores.map((score, index) => score === maxScore ? index + 1 : null).filter(val => val !== null)
        if (winners.length > 1) {
            return (<h2>Draw</h2>)
        } else {
            return (<h2 className={styles.winner}>Player <span>{winners[0]}</span> Win! <br/><span>({maxScore} Points)</span></h2>)
        }
    }
    const { progress } = useProgress()
    const isLoading = progress < 100
    useEffect(() => {
        resetToMenu()
        return () => {resetToMenu()}
    }, [resetToMenu])
    return(
        <div className={styles.canvas}>
            {isLoading && <LoadingScreen />}
            <Canvas camera={{ position:[0, 20, 5], fov:50 }} shadows>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
            {!isLoading && (
                <>
                    {gameState === GAME_STATE.GAME_OVER && (
                        <div className={styles.gameOverBox}>
                            <p className={styles.gameOverTitle}>GAME OVER</p>
                            <div className={styles.gameOverTextBox}>
                                <span className={styles.winIcon}>🏆</span>
                                {getWinnerText()}
                            </div>
                            <p className={styles.gameOverText}>모든 라운드가 종료되었습니다.<br />다시 한 판 어떠신가요?</p>
                            <button className={styles.resetBtn} onClick={resetToMenu}>Play Again</button>
                        </div>
                    )}
                    {gameState !== GAME_STATE.MENU && (
                        <div className={styles.inSceneBoard}>
                            <ScoreBoard />
                        </div>
                    )}
                    {gameState === "MENU" ? (
                        <div className={styles.controllPad}>
                            <h1><span>YACHT</span> Dice</h1>
                            <div className={styles.playerContainer}>
                                <h3>player:</h3>
                                <div className={styles.playerControll}>
                                    <button className={styles.btn_1} onClick={(e) => { e.stopPropagation(); subtractPlayer();}}>▼</button>
                                    <p>{player}</p>
                                    <button className={styles.btn_2} onClick={(e) => { e.stopPropagation(); addPlayer();}}>▲</button>
                                </div>
                            </div>
                            <div className={styles.startBtn} onClick={startGame}>
                                <p className={styles.btnText}>Ready?</p>
                                <div className={styles.btnTwo}>
                                <p className={styles.btnText2}>Go!</p>
                                </div>
                            </div>
                        </div>
                        ):(
                        gameState !== "GAME_OVER"?
                        <div className={styles.uiPad}>
                            <p className={styles.throwCount}><img src='free-icon-dice.png'/>{rollCount} left</p>
                            <p className={styles.turnPlayer}>{currentPlayer + 1}<span>P</span>Turn</p>
                            <p className={styles.turn}>{Math.min(12, turn)}/12</p>
                            <div className={styles.tip}>
                                <img src='tip-icon.png'/>
                                <div className={styles.tipText}>
                                    {gameState === GAME_STATE.READY && <p>컵을 잡아 드래그해 주사위를 섞고 마우스를 놓아 주사위를 던지세요!</p>}
                                    {gameState === GAME_STATE.ENDED && rollCount > 0 && <p>던져진 주사위를 클릭해 킵(Keep)하던, 컵을 클릭해 다시 던져 원하는 주사위를 띄우세요.</p>}
                                    {gameState === GAME_STATE.ENDED && rollCount === 0 && <p>더 이상 굴릴 수 없습니다. 점수판을 클릭해 기록하세요!</p>}
                                </div>
                            </div>
                        </div>
                        :(<></>)
                    )}
                </>
            )}
            
        </div>
    )
}