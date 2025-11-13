import * as THREE from "three";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

function Ball(){
    const ref = useRef()
    const {viewport} = useThree()
    const onCollisionEnter = () => (ref.current.setTranslation({x:0, y:0, z:0}), ref.current.setLinvel({x:0, y:10, z:0}))
    return(
        <>
            <RigidBody ref={ref} colliders="ball" mass={1}>
                <mesh castShadow>
                    <sphereGeometry args={[0.75, 32, 32]} />
                    <meshStandardMaterial />
                </mesh>
            </RigidBody>
            {/* 아래는 데드존만드는 리지드바디태그 */}
            <RigidBody type="fixed" colliders={false} position={[0, -viewport.height, 0]} restitution={2.1} onCollisionEnter={onCollisionEnter}>
                <CuboidCollider args={[30, 2, 30]} />
            </RigidBody>
        </>
    )
}

function Enemy({position, color}){
    return(
        <RigidBody colliders="cuboid" type="fixed" position={position} restitution={2.1}>
            <mesh>
                <boxGeometry args={[2.5, 1, 1]} />
                <meshStandardMaterial color={color}/>
            </mesh>
        </RigidBody>
    )
}

function Paddle({euler = new THREE.Euler(), quaternion = new THREE.Quaternion()}){
    const ref = useRef()
    useFrame(({pointer, viewport})=>{
        ref.current.setTranslation({x: (pointer.x * viewport.width)/2, y: -viewport.height / 3, z: 0})
        ref.current.setRotation(quaternion.setFromEuler(euler.set(0, 0, (pointer.x * Math.PI) / 10)))
    })
    return(
        <RigidBody ref={ref} colliders="cuboid" type="fixed" restitution={2.1}>
            <mesh receiveShadow>
                <boxGeometry args={[4, 1, 1]} />
                <meshStandardMaterial color="lightblue"/>
            </mesh>
        </RigidBody>
    )
}
export default function SimplArkanoid(){
    return(
        <Canvas shadows camera={{position:[0, 5, 12], fov:50}}>
            <Physics gravity={[0, -30, 0]}>
                <Ball />
                <Paddle />
                <Enemy color="orange" position={[2.75, 1.5, 0]} />
                <Enemy color="hotpink" position={[-2.75, 3, 0]} />
            </Physics>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[10, 10, 5]} decay={1} intensity={15}/>
        </Canvas>
    )
}