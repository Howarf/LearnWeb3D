import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import styles from "../css/canvasWithText.module.css";

export default function CanvasWithText(){
    const ref = useRef();

    return(
        <div className={styles.container} ref={ref}>
            <div className={styles.text}>
                "캔버스와 같이 텍스트를 출력해서 서로 같이 랜더할수있음을 공부해보는 예제파일인거같다 그림자도 넣고 이뿌네"
            </div>
            <Canvas className={styles.canvas} shadows frameloop="demand" camera={{position:[0, 0, 4]}} 
                style={{ pointerEvents: 'none' }} eventSource={ref} eventPrefix="offset">
                <ambientLight intensity={.5 * Math.PI} />
                <directionalLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow shadow-mapSize={[2024, 2024]} />
                <pointLight position={[10, 0, 0]} />
                <Box position={[-1.2, 0, 0]}/>
                <Box position={[1.2, 0, 0]}/>
                <Shadows position={[0, 0, -0.5]}/>
            </Canvas>
        </div>
    )
}

function Box(props){
    const ref = useRef();
    const [hovered, hover] = useState(false);
    return(
        <mesh {...props} castShadow ref={ref} onPointerOver={(event)=> hover(true)} onPointerOut={(e)=> hover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink':'orange'}/>
        </mesh>
    )
}
function Shadows(props){
    const { viewport } = useThree();
    return(
        <mesh receiveShadow scale={[viewport.width, viewport.height, 1]} {...props}>
            <planeGeometry/>
            <shadowMaterial transparent opacity={0.5} />
        </mesh>
    )
}