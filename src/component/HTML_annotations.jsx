import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import styles from "../css/annotations.module.css";

export default function HTML_annotations(){
    function Obj({time, ...props}){
        return(
            <mesh {...props}>
                <dodecahedronGeometry />
                <meshStandardMaterial roughness={0.75} emissive="#404057" />
                <Html distanceFactor={10}>
                    <div className={styles.textBox}>
                        Hello<br/>
                        World
                    </div>
                </Html>
            </mesh>
        )
    }

    function Content(){
        const ref = useRef();
        useFrame(() => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.01));
        return(
            <group ref={ref}>
                <Obj position={[-2, 0, 0]} />
                <Obj position={[0, -2, -3]} />
                <Obj position={[2, 0, 0]} />
            </group>
        )
    }

    return(
        <Canvas camera={{position:[0, 0, 7.5]}}>
            <pointLight color="indianred" />
            <pointLight position={[10, 10, -10]} color="orange" />
            <pointLight position={[-10, -10, 10]} color="lightblue" />
            <Content />
        </Canvas>
    )
}