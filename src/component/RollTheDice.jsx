import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Physics, RigidBody, MeshCollider } from "@react-three/rapier";
import { getModelUrl } from "../supabaseClient";
import * as THREE from 'three';
import styles from "../css/diceGame.module.css";
import { useDiceGameStore } from "../stores/useDiceGameStore";

const faces = [
    { dir: new THREE.Vector3(0, 1, 0), value: 1 },  // 위 (+Y)
    { dir: new THREE.Vector3(1, 0, 0), value: 2 }, // 오른쪽 (+X)
    { dir: new THREE.Vector3(0, 0, 1), value: 3 },  // 앞 (+Z)
    { dir: new THREE.Vector3(0, 0, -1), value: 4 }, // 뒤 (-Z)
    { dir: new THREE.Vector3(-1, 0, 0), value: 5 }, // 왼쪽 (-X)
    { dir: new THREE.Vector3(0, -1, 0), value: 6 }, // 아래 (-Y)
]

function Dice({index, ...props}){
    const { scene } = useGLTF(getModelUrl('D6.glb'));
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const rigidRef = useRef();
    const rollTrigger = useDiceGameStore((state) => state.rollTrigger);
    const setDiceResult = useDiceGameStore((state) => state.setDiceResult);

    useEffect(() => {
        clonedScene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
    }, [clonedScene])

    useEffect(() => {
        if(rollTrigger === 0) return
        if(rigidRef.current){
            rigidRef.current.applyImpulse({x: (Math.random() - 0.5) * 2, y: 30, z: (Math.random() - 0.5) * 2}, true);
            rigidRef.current.applyTorqueImpulse({x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2}, true);
        }
    }, [rollTrigger])

    const checkResult = () => {
        if(!rigidRef.current) return
        const rotation = rigidRef.current.rotation();
        const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        const worldUp = new THREE.Vector3(0, 1, 0);
        let bestMatch = 0;
        let maxDot = -Infinity;
        faces.forEach((face) => {
            const faceDir = face.dir.clone().applyQuaternion(quaternion);
            const dot = faceDir.dot(worldUp);
            if(dot > maxDot){
                maxDot = dot;
                bestMatch = face.value;
            }
        })
        setDiceResult(index, bestMatch);
    }

    return(
        <RigidBody ref={rigidRef} sleepThreshold={0.5} {...props} onSleep={checkResult}>
            <primitive object={clonedScene} />
        </RigidBody>
    )
}
// function Glass(props){
//     const { nodes, materials, scene } = useGLTF(getModelUrl('yachtDice_glass.glb'));

//     useEffect(() => {
//         scene.traverse((child) => {
//             if(child.isMesh){
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//             }
//         })
//     }, [scene])

//     return(
//         <RigidBody colliders={false} {...props}>
//             <MeshCollider type="trimesh">
//                 <primitive object={scene} />
//             </MeshCollider>
//         </RigidBody>
//     )
// }
function Case(props){
    const { nodes, materials, scene} = useGLTF(getModelUrl("yachtDice_case.glb"));

    useEffect(() => {
        scene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
    }, [scene])

    return(
        <RigidBody colliders={false} {...props}>
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

function Scene({...props}){
    const startDicePosition = [[0, 5, 0], [0, 5, 1], [0, 5, -1], [1, 5, 0], [-1, 5, 0]];
    // const startDicePosition = [[7, 5, 0], [7, 5, 1], [7, 5, -1], [8, 5, 1], [6, 5, -1]]; 컵위치
    // const saveDicePosition = 
    // [[2.7, 2.5, -3.3], [1.35, 2.5, -3.3], [0, 2.5, -3.3], [-1.35, 2.5, -3.3], [-2.7, 2.5, -3.3]]; 저장 위치
    return(
        <>
            <OrbitControls />
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
            <Suspense fallback={null}>
                <Physics gravity={[0, -25, 0]}>
                    <Panel position={[0, 0, 0]} />
                    {/* <Glass position={[7, 5, 0]} scale={13} /> */}
                    {startDicePosition.map((el, item) => {
                        return(<Dice position={el} scale={1.75} key={item} index={item}/>)
                    })}
                    <Case position={[0, 0, 0]} scale={2} rotation={[0, Math.PI / -2, 0]} />
                </Physics>
            </Suspense>
        </>
    )
}

export default function RollTheDice(){
    const rollDice = useDiceGameStore((state) => state.rollDice);
    const diceValues = useDiceGameStore((state) => state.diceValues);
    return(
        <>
            <Canvas camera={{ position:[0, 20, 5], fov:50 }} shadows>
                <Scene/>
            </Canvas>
            <div className={styles.controllPad}>
                <button onClick={rollDice}>던지기</button>
                <p>{JSON.stringify(diceValues)}</p>
            </div>
        </>
    )
}