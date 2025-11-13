import { BakeShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Room1 from "./Room12"
import Room2 from "./Room"

export default function LoadModel(){
    return(
        <Canvas camera={{ position: [5, 7, 5], fov: 70}}>
            <axesHelper args={[200, 200, 200]} />
            <Room2 />
            <directionalLight castShadow intensity={1} position={[10, 5, 10]} />
            <ambientLight intensity={1* Math.PI} />
            <OrbitControls />
        </Canvas>
    )
}
