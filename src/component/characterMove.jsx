import { KeyboardControls, OrbitControls, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function Plane(props){
    return(
        <RigidBody {...props} name="floor" type="fixed" colliders="cuboid" restitution={1} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
            <mesh receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}

function Character(props){
    const player = useRef()
    const isOnFloor = useRef(true)
    const [,get] = useKeyboardControls()
    const walk_speed = 5, run_speed = 10

    useFrame((_state, delta)=>{
        if(player.current){
            const val = player.current.linvel()
            const movement = {
                x: 0, y: 0, z: 0
            }
            if(get().forward){
                movement.x = -1
            }if(get().back){
                movement.x = 1
            }if(get().left){
                movement.z = 1
            }if(get().right){
                movement.z = -1
            }
            let speed = get().run ? run_speed : walk_speed
            if(movement.x !== 0 || movement.z !== 0){
                val.z = movement.z * speed
                val.x = movement.x * speed
            }
            if(get().jump){
                if(isOnFloor.current){
                    movement.y = 30
                    val.y = movement.y
                }
            }
            player.current.setLinvel(val, true)
        }
    })
    return(
        <RigidBody ref={player} colliders={false} gravityScale={5} position={[0, 5, 0]} enabledRotations={[false, true, false]} 
        onCollisionEnter={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = true
            }
        }}onCollisionExit={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = false
            }
        }}>
            <mesh castShadow>
                <capsuleGeometry/>
                <meshStandardMaterial color="red"/>
            </mesh>
            <CapsuleCollider args={[1, 1, 4, 8]} position={[0, 0, 0]} />
        </RigidBody>
    )
}

export default function CharacterMove(){
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
            <Canvas shadows camera={{position:[150, 200, 0], fov:30}}>
                <ambientLight intensity={Math.PI/2} />
                <pointLight position={[0, 20, 10]} intensity={15} castShadow />
                <Physics gravity={[0, -9.8, 0]}>
                    <Plane />
                    <Character />
                </Physics>
            </Canvas>
        </KeyboardControls>
    )
}