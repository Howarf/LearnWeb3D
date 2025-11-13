import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

function WireBox(props){
    const ref = useRef();
    useFrame((state, delta) => {
        ref.current.rotation.x = ref.current.rotation.y += delta;
        const t = state.clock.getElapsedTime();
        const s = 1 + 0.1 * Math.sin(2*Math.PI * 0.5 * t);
        ref.current.scale.set(s, s, s);
    })
    return(
        <mesh {...props} ref={ref}>
            <boxGeometry />
            <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    )
}

export default function Home(){
    return(
        <Canvas camera={{ position: [0, 0, 2] }}>
            <WireBox/>
            <OrbitControls/>
        </Canvas>
    )
}