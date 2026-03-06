import { Environment, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { getModelUrl } from '../supabaseClient'
import { useEffect, useState, useMemo, useRef } from 'react'
import { GAME_STATE, useDiceGameStore } from '../stores/useDiceGameStore'
import styles from "../css/diceControll.module.css"

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
    const rigidRef = useRef()
    const gameState = useDiceGameStore((state)=> state.gameState)
    const keeps = useDiceGameStore((state) => state.keeps)
    const toggleKeep = useDiceGameStore((state) => state.toggleKeep)
    const setDiceResult = useDiceGameStore((state) => state.setDiceResult)
    const setReady = useDiceGameStore((state) => state.setReady)
    const isFixed = keeps.some(k => k.originalIndex === index)
    const keepOrderIndex = keeps.findIndex(k => k.originalIndex === index)
    const [physicsType, setPhysicsType] = useState("dynamic")
    const [savedRot, setSaveRot] = useState(new THREE.Quaternion())
    const spacing = 2.0
    const angle = (index / 5) * Math.PI * 2
    const radius = 0.4
    const resultTargetPos = useMemo(() => new THREE.Vector3((index - 2) * spacing, 7.5, 1.5), [index])
    const saveTargetPos = keepOrderIndex !== -1 ? fixeDice_P[keepOrderIndex] : fixeDice_P[0]
    const glassPos = useMemo(() => new THREE.Vector3(
        7 + Math.cos(angle) * radius,
        3 + index * 0.8, 
        Math.sin(angle) * radius
    ), [index])
    const glassOffset = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 1, 0, (Math.random() - 0.5) * 1), [])
    useEffect(() => {
        clonedScene.traverse((child) => {
            if(child.isMesh){ child.castShadow = true; child.receiveShadow = true; }
        })
    }, [clonedScene])
    useEffect(() => {
        if(gameState === GAME_STATE.READY && !isFixed && rigidRef.current){
            rigidRef.current.setTranslation(glassPos.clone().add(glassOffset), true)
            rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
            setPhysicsType("dynamic")
            rigidRef.current.wakeUp()
            setTimeout(() => {
                if (rigidRef.current && gameState === GAME_STATE.READY) {
                    rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
                    rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
                }
            }, 50)
        }
    }, [gameState, isFixed])
    useEffect(() => {
        if(gameState === GAME_STATE.THROWN && !isFixed && rigidRef.current){
            setPhysicsType("dynamic")
            rigidRef.current.wakeUp()
            setTimeout(()=>{
                rigidRef.current.applyImpulse({
                    x: -20 - Math.random() * 2, 
                    y: -2,
                    z: (Math.random() - 0.5) * 2
                }, true)
                rigidRef.current.applyTorqueImpulse({
                    x: Math.random() * 3, y: Math.random() * 3, z: Math.random() * 3
                }, true)
            }, 200)
        }
    }, [gameState, isFixed])
    useFrame(() => {
        if(!rigidRef.current) return
        if(gameState === GAME_STATE.ENDED){
            setPhysicsType("kinematicPosition") // 정렬을 위해 물리 끄기
            const currentPos = rigidRef.current.translation()
            const curVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)
            const curRot = rigidRef.current.rotation()
            const curQuat = new THREE.Quaternion(curRot.x, curRot.y, curRot.z, curRot.w)
            
            const activeTarget = isFixed ? saveTargetPos : resultTargetPos
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(activeTarget, 0.1))
            rigidRef.current.setNextKinematicRotation(curQuat.slerp(savedRot, 0.1))
        }
        if(gameState === GAME_STATE.RETURNING && !isFixed){
            setPhysicsType("kinematicPosition")
            const currentPos = rigidRef.current.translation()
            const curVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)
            const target = glassPos.clone().add(glassOffset)
            
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(target, 0.09))
            rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
            
            if(curVec.distanceTo(target) < 0.2){
                setReady()
            }
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
        setDiceResult(index, bestMatch) // 기록
    }
    return(
        <RigidBody 
            ref={rigidRef}
            type={physicsType}
            onSleep={checkResult}
            ccd={true}
            {...props}
            onClick={(e) =>{
                e.stopPropagation()
                toggleKeep(index)
                if(rigidRef.current) rigidRef.current.wakeUp()
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
    const planeIntersectPoint = useMemo(() => new THREE.Vector3(), [])
    const defualtPos = useMemo(() => new THREE.Vector3(7, 2, 0), [] )
    const uprightQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))
    useEffect(() => {
        scene.traverse((child) => {
            if(child.isMesh){ child.castShadow = true; child.receiveShadow = true; }
        })
    }, [scene])
    useFrame((state) => {
        if(!rigidRef.current) return
        const currentPos = rigidRef.current.translation()
        const curVec = new THREE.Vector3(currentPos.x, currentPos.y ,currentPos.z)
        const currentRot = rigidRef.current.rotation()
        const curQuat = new THREE.Quaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w)
        if(gameState === GAME_STATE.DRAGGING){
            state.raycaster.setFromCamera(state.pointer, state.camera)
            const dragHeight = 5
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dragHeight)
            const intersection = state.raycaster.ray.intersectPlane(plane, planeIntersectPoint)
            if(intersection){
                const x = THREE.MathUtils.clamp(intersection.x, 2, 12)
                const z = THREE.MathUtils.clamp(intersection.z, -5, 5)
                rigidRef.current.setNextKinematicTranslation(curVec.lerp(new THREE.Vector3(x, dragHeight, z), 0.04))
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
                    onClick={(e) => { e.stopPropagation(); if(gameState === GAME_STATE.ENDED) gatherDice(); }}
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

function Scene(props){
    const startDicePosition = [[0, 5, 0], [0, 5, 1], [0, 5, -1], [1, 5, 0], [-1, 5, 0]];
    return(
        <>
            <ambientLight color={"white"} intensity={0.5} />
            <Environment preset="city" environmentIntensity={0.3}/>
            <directionalLight 
                position={[2.5, 10, 5]} intensity={2} shadow-bias={-0.0001} 
                shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50}
                shadow-mapSize={[2024, 2024]} castShadow 
            />
            <Physics gravity={[0, -25, 0]}>
                <Panel position={[0, 0, 0]}/>
                <Glass position={[7, 2, 0]} scale={13} />
                {startDicePosition.map((el, item) => {
                    return(<Dice position={el} scale={1.75} key={item} index={item}/>)
                })}
                <Case position={[0, 0, 0]} scale={2} rotation={[0, Math.PI / -2, 0]} />
            </Physics>
        </>
    )
}

export default function YachtDice(){
    const gameState = useDiceGameStore((state) => state.gameState)
    const diceValues = useDiceGameStore((state) => state.diceValues)
    const rollCount = useDiceGameStore((state) => state.rollCount)
    const startGame = useDiceGameStore((state) => state.startGame)
    
    return(
        <>
            <Canvas camera={{ position:[0, 20, 5], fov:50 }} shadows>
                <Scene />
            </Canvas>
            <div className={styles.controllPad}>
                {gameState === "MENU" ? (
                    <button onClick={startGame}>시작하기</button>
                    ):(
                    <>
                        <p>{JSON.stringify(diceValues)}</p>
                        <p className={styles.throwCount}>남은 횟수:{rollCount}</p>
                    </>
                )}
            </div>
        </>
    )
}