import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Slider } from "antd";
import { useState } from "react";

export default function MixingHTML(){
    function Box(){
        const [size, setSize] = useState(0.5);
        const control = useThree((state)=> state.controls);
        return(
            <mesh scale={size * 2}>
                <boxGeometry/>
                <meshStandardMaterial/>
                <Html occlude distanceFactor={1.5} position={[0, 0, 0.51]} transform>
                    <span>Size</span>
                    <Slider style={{width: 100}} min={0.5} max={1} step={0.01} value={size}
                    onChange={(val)=>((control.enabled = false), setSize(val))} onChangeComplete={()=>((control.enabled = true))} />
                </Html>
            </mesh>
        )
    }

    return(
        <Canvas camera={{ position: [2, 1, 5], fov: 25 }}>
            <ambientLight intensity={1 * Math.PI}/>
            <pointLight position={[10, 10, 5]} decay={0} intensity={1}/>
            <pointLight position={[-10, -5, -10]} decay={0.5} intensity={0.5}/>
            <Box/>
            <OrbitControls makeDefault/>
        </Canvas>
    )
}