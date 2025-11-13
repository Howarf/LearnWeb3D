import { Physics, useBox, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

function Plane(props){
    const [ref] = usePlane(()=>({ rotation : [-Math.PI / 2, 0, 0], props}));
    return(
        <mesh receiveShadow ref={ref}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>
    )
}

function Cube(props){
    const [ref] = useBox(()=>({mass:1, ...props}));
    return(
        <mesh castShadow ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>
    )
}

export default function Simple_physics(){
    const [ready, setReady] = useState(false);
    useEffect(()=>{
        const timeOut = setTimeout(()=> setReady(true), 1000);
        return() => clearTimeout(timeOut);
    },[])
    return(
        <Canvas dpr={[1, 2]} shadows camera={{ position: [-5, 5, 5], fov: 50 }}>
            <ambientLight intensity={Math.PI / 2}/>
            <directionalLight castShadow color={0xffffff} intensity={0.9} position={[0, 5, 0]} target-position={[0, 0, 0]} />
            <spotLight angle={0.25} penumbra={0.5} intensity={100} position={[10, 10, 5]} castShadow />
            <Physics>
                <Plane />
                <Cube position={[0, 5, 0]} />
                <Cube position={[0.45, 7, -0.25]} />
                <Cube position={[-0.45, 9, 0.25]} />
                {ready && <Cube position={[-0.45, 10, 0.25]} />}
            </Physics>
            <OrbitControls />
        </Canvas>
    )
}
