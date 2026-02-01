import * as THREE from "three"
import { Environment, Html, KeyboardControls, OrbitControls, useGLTF, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { getModelUrl } from "../supabaseClient";
import { useExamStore } from "../stores/useExamStore";
import styles from "../css/annotations.module.css";
import { CharModel } from "./MyCharacter"

function Plane(props){
    return(
        <RigidBody {...props} name="floor" type="fixed" rotation={[-Math.PI / 2, 0, 0]}>
            <mesh receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}

function Character(){
    const player = useRef()
    const visualRef = useRef()
    const isColliding = useRef(false)
    const isOnFloor = useRef(true)
    const [,get] = useKeyboardControls()
    const walk_speed = 10, run_speed = 20, rotate_speed = 15
    const setCharAnime = useExamStore((state)=> state.setCharAnime)
    const charAnime = useExamStore((state)=> state.charAnime) 
    const setComAction = useExamStore((state)=> state.setComAction)

    useFrame((_state, delta)=>{
        if(player.current){
            const val = player.current.linvel()
            const movement = { x: 0, y: 0, z: 0 }
            if(get().forward){ movement.x = -1 }
            if(get().back){ movement.x = 1 }
            if(get().left){ movement.z = 1 }
            if(get().right){ movement.z = -1 }
            let speed = get().run ? run_speed : walk_speed
            if(movement.x !== 0 || movement.z !== 0){
                val.z = movement.z * speed
                val.x = movement.x * speed
                const targetRotation = Math.atan2(movement.x, movement.z)
                const targetQuaternion = new THREE.Quaternion()
                targetQuaternion.setFromEuler(new THREE.Euler(0, targetRotation + Math.PI, 0))
                visualRef.current.quaternion.slerp(targetQuaternion, delta * rotate_speed)
            }
            if(get().jump && isOnFloor.current){
                movement.y = 30
                val.y = movement.y
                isOnFloor.current = false
            }
            player.current.setLinvel(val, true)
            if(!isOnFloor.current){
                setCharAnime("Jump")
            }
            else if(movement.x !== 0 || movement.z !== 0){
                setCharAnime("Walk")
            }
            else{
                setCharAnime("Idle")
            }
        }
    })
    return(
        <RigidBody ref={player} colliders={false} ccd={true} name="player" lockRotations gravityScale={5} position={[0, 5, 0]}
        onCollisionEnter={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = true
            }
            if(other.rigidBodyObject.name === "tree"){
                if(isColliding.current) return
                isColliding.current = true
                alert("검은 오크 나무입니다.")
            }
            if(other.rigidBodyObject.name === "computer"){
                setComAction(true)
                console.log(other.rigidBodyObject.position);
            }
        }}onCollisionExit={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = false
            }
            if(other.rigidBodyObject.name === "tree"){
                setTimeout(()=>{
                    isColliding.current = false
                })
            }
            if(other.rigidBodyObject.name === "computer"){
                setComAction(false)
            }
        }}
        >
            <CapsuleCollider args={[0.5, 0.5]} position={[0, 1.35, 0]} />
            <group ref={visualRef}>
                <mesh castShadow position={[0, 0, 0]}>
                    <CharModel rotation={[0, 180 * (Math.PI / 180), 0]} currentAnim={charAnime} />
                </mesh>
            </group>
        </RigidBody>
    )
}

function Computer({action, ...props}){
    const { nodes, materials, scene } = useGLTF(getModelUrl('retro_computer.glb'));
    const rigidRef = useRef();
    useEffect(()=>{
        scene.traverse((child)=>{
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
    },[])
    return(
        <RigidBody {...props} type="fixed" name="computer" enabledRotations={[false, true, false]}>
            <primitive object={scene} />
            {action && (
                <Html position={[0, 0, 0]} distanceFactor={50} center>
                    <div className={styles.textBox}>
                        컴퓨터입니다
                    </div>
                </Html>
            )}
        </RigidBody>
    )
}

function Block_tree({action, ...props}){
    const { nodes, materials, scene } = useGLTF(getModelUrl('tree_blocks_dark.glb'));
    const rigidRef = useRef();
    useEffect(() => {
        scene.traverse((child)=>{
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
    },[])
    return(
        <RigidBody {...props} colliders="cuboid" type="fixed" name="tree">
            <primitive object={scene} />
        </RigidBody>
    )
}

export default function CollisionEvent(){
    const treeAction = useExamStore((state)=> state.treeAction);
    const comAction = useExamStore((state)=> state.computerAciont);
    const map = [
        { name: "forward", keys: ['ArrowUp', 'KeyW'] },
        { name: "back", keys: ['ArrowDown', 'KeyS'] },
        { name: "left", keys: ['ArrowLeft', 'KeyA'] },
        { name: "right", keys: ['ArrowRight', 'KeyD'] },
        { name: "jump", keys: ['Space'] },
        { name: "run", keys: ['Shift'] },
    ]
    return(
        <KeyboardControls map={map}>
            <Canvas shadows camera={{position:[50, 10, 0], fov:50}}>
                <ambientLight intensity={Math.PI/2} />
                <Environment preset="city" environmentIntensity={0.3}/>
                <pointLight position={[0, 20, 10]} intensity={15} castShadow />
                <Physics gravity={[0, -9.8, 0]}>
                    <Plane />
                    <Computer position={[-10, 0, -10]} action={comAction} rotation={[0, 1, 0]} scale={10}/>
                    <Block_tree position={[10, 0, 10]} action={treeAction} scale={10} />
                    <Character />
                </Physics>
                <OrbitControls />
            </Canvas>
        </KeyboardControls>
    )
}