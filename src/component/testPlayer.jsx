import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useControls } from "leva";
import { degToRad } from "three/src/math/MathUtils.js";

export default function testPlayer(props){
    const player = useRef()
    const isOnFloor = useRef(true)
    const characterRotationTarget = useRef(0)
    const rotationTarget = useRef(0)
    const [,get] = useKeyboardControls()
    const {walk_speed, run_speed, rotation_speed} = useControls(
        "Control",{
            walk_speed: {value: 1.0, min: 0.1, max: 4, step: 0.1},
            run_speed: {value: 2.0, min: 0.2, max: 20, step: 0.2},
            rotation_speed: {value: degToRad(0.5), min: degToRad(0.1), max: degToRad(5), step: degToRad(0.1)},
        }
    )
    
    function jump(){
        if(isOnFloor.current){
            player.current.setLinvel({x: 0, y: 30, z: 0}, true)
        }
    }
    
    useFrame((_state, delta) => {
        if(player.current){
            const val = player.current.linvel()
            const movement = {
                x: 0,
                z: 0
            }
            if(get().forward){movement.z = 1}
            if(get().back){movement.z = -1}
            if(get().left){movement.x = 1}
            if(get().right){movement.x = -1}
            let speed = get().run ? run_speed : walk_speed
            if(movement.x !== 0){
                rotationTarget.current += rotation_speed * movement.x
            }
            if(movement.x !== 0 || movement.z !== 0){
                characterRotationTarget.current = Math.atan2(movement.x, movement.z)
                val.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed
                val.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed
            }
            player.current.setLinvel(val, true)
            if(get().jump){
                jump()
            }
        }
    })

    return(
        <RigidBody name="player" colliders={false} ref={player} mass={1} gravityScale={5} position={[0, 5, 0]} enabledRotations={[false, true, false]}
        onCollisionEnter={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = true
            }
        }}onCollisionExit={({other}) => {
            if(other.rigidBodyObject.name === "floor"){
                isOnFloor.current = false
            }
        }}>
            <mesh castShadow >
                <capsuleGeometry />
                <meshStandardMaterial color="springgreen"/>
            </mesh>
            <CapsuleCollider args={[1, 1, 4, 8]} position={[0, 0, 0]} />
        </RigidBody>
    )
}