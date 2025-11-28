import { ContactShadows, Environment, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Living_room } from "./Living_room";
import { Suspense } from "react";
import tunnel from "tunnel-rat";

function ModelScene(){
    const states = tunnel();
    return(
        <>
            <axesHelper args={[200]}/>
            <Environment preset="city"/>
            <hemisphereLight color="#b1e1ff" groundColor="#b97a20" intensity={0.2}/>
            <pointLight position={[10, 10, 10]} decay={2} intensity={300} castShadow shadow-normalBias={0.04}/>
            <Suspense fallback={<states.In>Loading...</states.In>}>
                <Living_room position={[10, 0 ,10]}/>
            </Suspense>
            <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />
            <OrbitControls />
        </>
    )
}

export default function LoadModel(){
    return(
        <Canvas camera={{ position: [30, 20, 30], fov: 50}} shadows>
            <ModelScene/>
        </Canvas>
    )
}
