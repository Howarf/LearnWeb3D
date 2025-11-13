import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";

function SceneUpdater({ bgColor }) {
  // useThree 훅으로 Three.js의 씬(scene) 객체에 직접 접근합니다.
  const { scene } = useThree();

  // useEffect를 사용해서 'bgColor'라는 상태가 변할 때마다 아래 코드를 실행시킵니다.
  useEffect(() => {
    // 씬의 배경색과 안개색을 직접 명령하여 변경합니다.
    if (scene.background) {
      scene.background.set(bgColor);
    }
    if (scene.fog) {
      scene.fog.color.set(bgColor);
    }
  }, [bgColor]); // 종속성 배열에 bgColor를 넣어주어, bgColor가 바뀔 때만 실행되도록 설정

  return null; // 화면에는 아무것도 렌더링하지 않습니다.
}

function BoxTrigger({onCollide, size, position}){
    const [ref] = useBox(()=>({isTrigger: true, args: size, position, onCollide}))
    return(
        <mesh ref={ref} position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial wireframe color="green" />
        </mesh>
    )
}

function Ball(){
    const [ref] = useSphere(() => ({
        mass: 1,
        position: [0, 20, 0]
    }))
    return(
        <mesh castShadow receiveShadow ref={ref}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshLambertMaterial color={"white"} />
        </mesh>
    )
}

function Plane(props){
    const [ref] = usePlane(() => ({type:'Static', ...props}))
    return(
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial color="#171717" />
        </mesh>
    )
}

export default function TriggerMesh(){
    const [bg, setBg] = useState('#171720');
    return(
        <Canvas shadows dpr={[1, 2]} camera={{ position:[-10, 15, 5], material:{ restitution: 10 }, fov: 50 }}>
            <fog attach="fog" args={[bg, 10, 50]} /> {/* 안개태그로 카메라와 일정 거리 멀어지면 오브젝트가 흐려지게 하는 태그 */}
            <color attach="background" args={[bg]} />
            <SceneUpdater bgColor={bg} />
            <directionalLight  intensity={0.9} position={[10, 10, 10]} target-position={[0, 0, 0]} />
            <ambientLight intensity={0.1 * Math.PI}/>
            <spotLight position={[10, 10, 10]} angle={0.5} intensity={1} castShadow penumbra={1} />
            <Physics>
                <BoxTrigger onCollide={(e) => {
                    console.log("Collision event is BoxTrigger", e, bg);
                    setBg('#fe4365');
                }} 
                position={[0, 5, 0]}
                size={[4, 1, 4]} />
                <Ball />
                <Plane rotation={[-Math.PI / 2, 0, 0]}/>
            </Physics>
            <OrbitControls />
        </Canvas>
    )
}