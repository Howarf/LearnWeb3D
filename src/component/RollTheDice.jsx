import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Physics, RigidBody, MeshCollider } from "@react-three/rapier";
import { getModelUrl } from "../supabaseClient";
import styles from "../css/diceControll.module.css";

function Dice({count, ...props}){
    const { nodes, materials, scene } = useGLTF(getModelUrl('D6.glb'));
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const rigidRef = useRef();
    useEffect(() => {
        clonedScene.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
    }, [clonedScene])

    useEffect(() => {
        if(count === 0) return
        if(rigidRef.current){
            rigidRef.current.applyImpulse({x: (Math.random() - 0.5) * 2, y: 15, z: (Math.random() - 0.5) * 2}, true);
            rigidRef.current.applyTorqueImpulse({x: Math.random(), y: Math.random(), z: Math.random()}, true);
        }
    }, [count])

    return(
        <RigidBody ref={rigidRef} {...props}>
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

function Scene({count, ...props}){
    const startDicePosition = [[0, 5, 0], [0, 5, 1], [0, 5, -1], [1, 5, 0], [-1, 5, 0]];
    // const startDicePosition = [[7, 5, 0], [7, 5, 1], [7, 5, -1], [8, 5, 1], [6, 5, -1]]; 컵위치
    // const saveDicePosition = [[2.7, 2.5, -3.3], [1.35, 2.5, -3.3], [0, 2.5, -3.3], [-1.35, 2.5, -3.3], [-2.7, 2.5, -3.3]]; 저장 위치
    const cupRef = useRef();
    const dice = [saveDicePosition[0]];
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
                <Physics>
                    <Panel position={[0, 0, 0]} />
                    {/* <Glass position={[7, 5, 0]} scale={13} /> */}
                    {startDicePosition.map((el, item) => {
                        return(<Dice count={count} position={el} scale={1.75} key={item}/>)
                    })}
                    <Case position={[0, 0, 0]} scale={2} rotation={[0, Math.PI / -2, 0]} />
                </Physics>
            </Suspense>
        </>
    )
}

export default function RollTheDice(){
    const [dice_count, setDice_count] = useState(0);
    const Throw = () => {
        setDice_count((num) => num + 1 );
    }
    return(
        <>
            <Canvas camera={{ position:[0, 20, 5], fov:50 }} shadows>
                <Scene count={dice_count}/>
            </Canvas>
            <div className={styles.controllPad}>
                <button>+</button>
                <button onClick={Throw}>던지기</button>
                <button>-</button>
            </div>
        </>
    )
}