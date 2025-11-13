import * as THREE from 'three';
import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import styles from '../css/scrollCanvas.module.css';

function Box({text, color, ...props}){
    const [hover, setHover] = useState(false);
    return(
        <mesh {...props} onPointerOver={(e)=>setHover(true)} onPointerOut={(e)=>setHover(false)}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={hover ? 'hotpink' : color} />
            <Html className={styles.cube} position={[0, 0, 1]} center>
                {text}
            </Html>
        </mesh>
    )
}

function ScrollContainer({ scroll, children}){
    const { viewport } = useThree();
    const group = useRef();
    useFrame((state, delta)=>{
        group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta);

    })
    return <group ref={group}>{children}</group>
}

function Scene(){
    const viewport = useThree((state)=> state.viewport);
    return(
        <>
            <Box text={<span>HTML입니다.</span>} color="aquamarine" />
            <Box text={<h1>h1텍스트</h1>} color="lightblue" position={[0, -viewport.height, 0]} />
        </>
    )
}

export default function ScrollCanvas(){
    const scrollRef = useRef();
    const scroll = useRef(0);
    return(
        <>
            <Canvas eventSource={document.getElementById('root')} eventPrefix='client'>
                <ambientLight intensity={1} />
                <pointLight position={[10, 0, 10]} intensity={1} />
                <ScrollContainer scroll={scroll}>
                    <Scene />
                </ScrollContainer>
            </Canvas>
            <div className={styles.scroll} ref={scrollRef} 
            onScroll={(e)=> (scroll.current = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight))}>
                <div style={{height: `200vh`, pointerEvents: `none`}}></div>
            </div>
        </>
    )
}