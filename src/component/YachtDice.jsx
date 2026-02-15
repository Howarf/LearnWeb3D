import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { euler, MeshCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { getModelUrl } from '../supabaseClient'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useDiceGameStore } from '../stores/useDiceGameStore'
import styles from "../css/diceControll.module.css"

const faces = [
    { dir: new THREE.Vector3(0, 1, 0), value: 1 },  // 위 (+Y)
    { dir: new THREE.Vector3(1, 0, 0), value: 2 }, // 오른쪽 (+X)
    { dir: new THREE.Vector3(0, 0, 1), value: 3 },  // 앞 (+Z)
    { dir: new THREE.Vector3(0, 0, -1), value: 4 }, // 뒤 (-Z)
    { dir: new THREE.Vector3(-1, 0, 0), value: 5 }, // 왼쪽 (-X)
    { dir: new THREE.Vector3(0, -1, 0), value: 6 }, // 아래 (-Y)
]
const MODE = {
    IDLE: 'IDLE',         // 컵 안에서 대기 중 or 게임 시작 전
    ROLLING: 'ROLLING',   // 던져져서 구르는 중
    RESULT: 'RESULT',     // 결과가 나와서 정렬되어 보여주는 중
    RETURNING: 'RETURNING' // 컵으로 돌아가는 중
}
const startDice_P = [[7, 5, 0], [7, 5, 1], [7, 5, -1], [8, 5, 1], [6, 5, -1]] //컵위치
const fixeDice_P = [
    new THREE.Vector3(2.7, 2.5, -3.3),
    new THREE.Vector3(1.35, 2.5, -3.3),
    new THREE.Vector3(0, 2.5, -3.3),
    new THREE.Vector3(-1.35, 2.5, -3.3),
    new THREE.Vector3(-2.7, 2.5, -3.3),
] //저장 위치

function Dice({index, ...props}){
    const { nodes, materials, scene } = useGLTF(getModelUrl('D6.glb'))
    const clonedScene = useMemo(() => scene.clone(), [scene])
    // Refs
    const rigidRef = useRef()
    const mode = useRef(MODE.IDLE)
    // Store Data
    const rollTrigger = useDiceGameStore((state) => state.rollTrigger)
    const keeps = useDiceGameStore((state) => state.keeps)
    const isReturningToGlass = useDiceGameStore((state) => state.isReturningToGlass)
    const toggleKeep = useDiceGameStore((state) => state.toggleKeep)
    const setDiceResult = useDiceGameStore((state) => state.setDiceResult)
    const resetAfterReturn = useDiceGameStore((state) => state.resetAfterReturn)
    // Local Constants & State
    const isFixed = keeps[index]
    const [physicsType, setPhysicsType] = useState("dynamic")
    const [sensorMode, setSensorMode] = useState(false)
    // Dice Position & Rotation Save
    const [savedRot, setSaveRot] = useState(new THREE.Quaternion())
    // Target Position calc
    const spacing = 2.0
    const resultTargetPos = new THREE.Vector3((index - 2) * spacing, 7.5, 1.5)
    const glassPos = useMemo(() => new THREE.Vector3(7, 1, 0), [])
    const glassOffset = useMemo(() => new THREE.Vector3(
        (Math.random() - 0.5) * 1,
        index * 1,
        (Math.random() - 0.5) * 1
    ),[index])
    useEffect(() => {
        clonedScene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [clonedScene])

    useEffect(() => {
        if(rollTrigger === 0) return
        if(isFixed) return
        mode.current = MODE.ROLLING
        setPhysicsType("dynamic")
        setSensorMode(false)
        if(rigidRef.current){
            rigidRef.current.wakeUp()
            rigidRef.current.applyImpulse({x: (Math.random() - 0.5) * 2, y: 30, z: (Math.random() - 0.5) * 2}, true)
            rigidRef.current.applyTorqueImpulse({x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2}, true)
        }
    }, [rollTrigger])

    useEffect(() => {
        if(isReturningToGlass && !isFixed){
            mode.current = MODE.RETURNING
            setPhysicsType("kinematicPosition")
            setSensorMode(true)
            if(rigidRef.current){
                rigidRef.current.wakeUp()
            }
        }
    },[isReturningToGlass, isFixed])

    useFrame((state, delta) => {
        if(!rigidRef.current) return
        if(mode.current === MODE.RESULT){
            const currentPos = rigidRef.current.translation()
            const currnetRot = rigidRef.current.rotation()
            const curVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)
            const curQuat = new THREE.Quaternion(currnetRot.x, currnetRot.y, currnetRot.z, currnetRot.w)
            const nextVec = curVec.lerp(resultTargetPos, 0.1)
            const nextQuat = curQuat.slerp(savedRot, 0.1)
            rigidRef.current.setNextKinematicTranslation(nextVec)
            rigidRef.current.setNextKinematicRotation(nextQuat)
            if(curVec.distanceTo(resultTargetPos) < 0.01){
                rigidRef.current.sleep()
            }
        }
        if(mode.current === MODE.RETURNING){
            const currentPos = rigidRef.current.translation()
            const curVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)
            const target = glassPos.clone().add(glassOffset)
            rigidRef.current.setNextKinematicTranslation(curVec.lerp(target, 0.1))
            if(curVec.distanceTo(target) < 0.2){
                mode.current = MODE.IDLE
                setPhysicsType("dynamic")
                rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
                rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
                setSensorMode(false)
                resetAfterReturn()
            }
        }
    })

    const checkResult = () => {
        if(!rigidRef.current) return
        if(mode.current !== MODE.ROLLING) return
        rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
        const rotation = rigidRef.current.rotation()
        const euler = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
        )
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
            if(dot > maxDot){
                maxDot = dot
                bestMatch = face.value
            }
        })
        setSaveRot(snappedQuat)
        setDiceResult(index, bestMatch)
        mode.current = MODE.RESULT
        setPhysicsType("kinematicPosition")
        setSensorMode(true)
    }
    
    const collisionGroup = sensorMode ? 0x00020000 : 0x00010001

    return(
        <RigidBody 
            ref={rigidRef} 
            type={physicsType} 
            sensor={sensorMode}
            collisionGroups={collisionGroup}
            onSleep={checkResult}
            {...props}
            onClick={(e) =>{
                e.stopPropagation()
                if(mode.current === MODE.RESULT){
                    toggleKeep(index)
                }
            }}
        >
            <primitive object={clonedScene} />
        </RigidBody>
    )
}
function Case(props){
    const { nodes, materials, scene} = useGLTF(getModelUrl("yachtDice_case.glb"))
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
function Glass(props){
    const { nodes, materials, scene } = useGLTF(getModelUrl('yachtDice_glass.glb'))
    const returnToGlass = useDiceGameStore((state)=> state.returnToGlass)
    const rollTrigger = useDiceGameStore((state) => state.rollTrigger)
    const diceValues = useDiceGameStore((state)=> state.diceValues)
    useEffect(() => {
        scene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [scene])
    return(
        <RigidBody
            {...props}
            colliders={false}
            ccd={true}
            onClick={(e) =>{
                e.stopPropagation()
                if(rollTrigger === 0 || diceValues.length === 0 || diceValues.includes(null)){
                    return
                }
                returnToGlass()
            }}
        >
            <MeshCollider type="trimesh">
                <primitive object={scene} position={[0, 0.55, 0]} />
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
                position={[2.5, 10, 5]} 
                intensity={2} 
                shadow-bias={-0.0001} 
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-mapSize={[2024, 2024]}
                castShadow 
            />
            <Physics debug gravity={[0, -25, 0]}>
                <Panel position={[0, 0, 0]}/>
                <Glass position={[7, 1, 0]} scale={13} />
                {startDicePosition.map((el, item) => {
                    return(<Dice position={el} scale={1.75} key={item} index={item}/>)
                })}
                <Case position={[0, 0, 0]} scale={2} rotation={[0, Math.PI / -2, 0]} />
            </Physics>
        </>
    )
}

export default function YachtDice(){
    const rollDice = useDiceGameStore((state) => state.rollDice)
    const diceValues = useDiceGameStore((state) => state.diceValues)
    const rollCount = useDiceGameStore((state) => state.rollCount)
    const resetAfterReturn = useDiceGameStore((state) => state.resetAfterReturn)
    return(
        <>
            <Canvas camera={{ position:[0, 20, 5], fov:50 }} shadows>
                <OrbitControls />
                <Scene />
            </Canvas>
            <div className={styles.controllPad}>
                <button onClick={rollDice}>던지기</button>
                <button onClick={resetAfterReturn}>set</button>
                <p>{JSON.stringify(diceValues)}</p>
                <p className={styles.throwCount}>남은 횟수:{rollCount}</p>
            </div>
        </>
    )
}