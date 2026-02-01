import * as THREE from "three"
import { Environment, KeyboardControls, OrbitControls, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { CapsuleCollider, Physics, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useExamStore } from "../stores/useExamStore";
import { CharModel } from "./MyCharacter"

function Character(){
    const player = useRef()
    const visualRef = useRef()
    const isOnFloor = useRef(true)
    const [,get] = useKeyboardControls()
    const walk_speed = 10, run_speed = 20, rotate_speed = 15
    const cameraOffset = new THREE.Vector3(50, 30, 0)
    const _cameraTarget = new THREE.Vector3()
    const setCharAnime = useExamStore((state)=> state.setCharAnime)
    const charAnime = useExamStore((state)=> state.charAnime)

    useFrame((state, delta)=>{
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
            }else if(movement.x !== 0 || movement.z !== 0){
                setCharAnime("Walk")
            }else{
                setCharAnime("Idle")
            }
        }
    })

    useFrame((state, delta) => {
        if(!player.current) return
        const playerPos = player.current.translation()
        const targetCameraPos = new THREE.Vector3(
            playerPos.x + cameraOffset.x,
            playerPos.y + cameraOffset.y,
            playerPos.z + cameraOffset.z
        )
        const dampedFactor = 1 - Math.exp(-5 * delta)
        state.camera.position.lerp(targetCameraPos, dampedFactor)
        _cameraTarget.lerp(playerPos, dampedFactor)
        state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z)
    })

    return(
        <RigidBody 
            ref={player} 
            colliders={false} 
            ccd={true} 
            name="player" 
            lockRotations 
            gravityScale={5} 
            position={[0, 5, 0]}
            onCollisionEnter={({other}) => {
                if(other.rigidBodyObject.name === "floor" || other.rigidBodyObject.name === "elevator"){
                    isOnFloor.current = true
                }
            }}onCollisionExit={({other}) => {
                if(other.rigidBodyObject.name === "floor" || other.rigidBodyObject.name === "elevator"){
                    isOnFloor.current = false
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

function Panel(props){
    return(
        <RigidBody {...props} name="floor" type="fixed">
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color={"white"} />
            </mesh>
        </RigidBody>
    )
}

function Elevator({position = [20, 0, 20], heigth = 5}){
    const rigidRef = useRef()
    const {world, rapier} = useRapier()
    const progress = useRef(0)
    const speed = 2.0
    const sensorShape = new rapier.Cuboid(4.9, 1, 4.9)
    useFrame((staet, delta) => {
        if(!rigidRef.current) return
        const elevatorPos = rigidRef.current.translation()
        const shapePos = {x: elevatorPos.x, y: elevatorPos.y + 1, z:elevatorPos.z}
        const shapeRot = {x: 0, y: 0, z: 0, w: 1}
        const shapeDir = {x: 0, y: 1, z: 0}
        const hit = world.castShape(shapePos, shapeRot, shapeDir, sensorShape, 0.5, true)
        let isPlayerOnTop = false
        if(hit){
            isPlayerOnTop = true
        }
        if(isPlayerOnTop){
            progress.current += delta * speed
        }else{
            progress.current -= delta * speed
        }
        progress.current = THREE.MathUtils.clamp(progress.current, 0, 2)
        const targetY = position[1] + (heigth * progress.current)
        rigidRef.current.setNextKinematicTranslation({x: position[0], y: targetY, z:position[2]})
    })
    return(
        <RigidBody
            ref={rigidRef}
            name="elevator"
            colliders="cuboid"
            type="kinematicPosition"
            friction={2}
            lockRotations
        >
            <mesh castShadow>
                <boxGeometry args={[10, 0.5, 10]} />
                <meshStandardMaterial color={"orange"} />
            </mesh>
        </RigidBody>
    )
}

function Slope(props){
    return(
        <RigidBody
            {...props}
            name="floor"
            type="fixed"
            friction={1}
        >
            <mesh rotation={[THREE.MathUtils.degToRad(45), 0, 0]}>
                <boxGeometry args={[10, 10, 10]} />
                <meshStandardMaterial color={"orange"} />
            </mesh>
        </RigidBody>
    )
}

function Secne(){
    return(
        <>
            <Environment preset="city" environmentIntensity={0.3}/>
            <directionalLight
                position={[50, 20, 50]} 
                intensity={2} 
                castShadow 
                shadow-bias={-0.0001}
            />
            <Physics timeStep="vary" debug>
                <Panel position={[0, 0, 0]} />
                <Elevator/>
                <Character/>
                <Slope position={[-20, 0, -20]}/>
            </Physics>
        </>
    )
}
export default function FlowCamera(){
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
            <Canvas shadows dpr={[1, 2]} camera={{ position:[10, 20, 10], fov: 50 }}>
                <Secne />
            </Canvas>
        </KeyboardControls>
    )
}