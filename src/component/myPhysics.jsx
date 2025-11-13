import { KeyboardControls, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame} from "@react-three/fiber"
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier"
import { Suspense, useRef, useState } from "react"
import { Euler, Quaternion } from "three"
import Player from './testPlayer'
import styles from '../css/myPhysics.module.css'

const coin_positions = [
    {id: 1, position: [0, 5, 10]},
    {id: 2, position: [-10, 5, 0]},
    {id: 3, position: [10, 5, 0]},
    {id: 4, position: [0, 5, -10]}
]

function Plane(props){
    return(
        <RigidBody {...props} name="floor" type="fixed" colliders="cuboid" restitution={1} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}

function Coin(props){
    const destroy = useRef(false)
    const coin = useRef(null)
    const euler = useRef(new Euler(0, 0, 0))
    useFrame((_state, delta) => {  
        if(coin.current && !destroy.current && euler.current){//useFrame으로 계속 물리엔진을 움직이니 파괴됐을때 동작하지않도록 조건을 걸어줘야함 안그럼 에러남
            euler.current.y += delta * 5
            coin.current.setNextKinematicRotation(
                new Quaternion().setFromEuler(euler.current)
            )
        }
    })
    const handleCollision = (e) =>{
        if(coin.current){
            if(e.rigidBodyObject.name === "player"){
                setTimeout(() => {
                    destroy.current = true
                    props.point()
                }, 0)
            }//rapier엔진 자체가 rust기반이기에 메모리충돌이 일어날수 있는점을 한프레임 뒤에 작동하게끔해 핸들링한것
        }
    }
    if(destroy.current) return null
    return(
        <RigidBody {...props} ref={coin} type="kinematicPosition" onCollisionEnter={handleCollision}>
            <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1, 1, 0.5, 32]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
            <CylinderCollider args={[0.25, 1]} rotation={[-Math.PI / 2, 0, 0]} />
        </RigidBody>
    )
}

export default function MyPhysics(){
    const [point, setPoint] = useState(0)
    const keyboardMap = [
        { name: "forward", keys: ['ArrowUp', 'KeyW'] },
        { name: "back", keys: ['ArrowDown', 'KeyS'] },
        { name: "left", keys: ['ArrowLeft', 'KeyA'] },
        { name: "right", keys: ['ArrowRight', 'KeyD'] },
        { name: "jump", keys: ['Space'] },
        { name: "run", keys: ['Shift'] },
    ]
    const pointUp = () => {
        setPoint(point + 1)
    }
    return(
        <KeyboardControls map={keyboardMap}>
            <span className={styles.point}>점수: {point}</span>
            <Canvas shadows camera={{position:[150, 150, 150], fov:30}}>{/* onPointerDown={(e) => e.target.requestPointerLock()} */}
                {/* <color attach="background" args={["#ececec"]} /> */}
                <Suspense>
                    <ambientLight intensity={Math.PI / 2}/>
                    <pointLight position={[0, 10, -10]} decay={1} intensity={15} castShadow />
                    <Physics gravity={[0, -9.8, 0]} debug>
                        <Plane />
                        <Player />
                        {coin_positions.map(({id, position})=>(
                            <Coin key={id} position={position} point={pointUp}/>
                        ))}
                    </Physics>
                </Suspense>
                <OrbitControls />
            </Canvas>
        </KeyboardControls>
    )
}