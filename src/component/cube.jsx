import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Outline, Select, Selection} from '@react-three/postprocessing';
import { useRef, useState } from 'react';

function Box(props){
    const ref = useRef(); {/*랜더링에는 필요하지않지만 변화하는 값이 필요할때 쓰이는 Hook*/}
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    useFrame((state, delta) =>{ (ref.current.rotation.x = ref.current.rotation.y += delta); }); {/*현재 프레임이 랜더링되기전 호출되는 Hook
        state는 Three.js 객체의 상태이고 delta는 갱신속도를 의미 !!함수안에 setState는 절대 넣지 말것!!*/}
    return(
        <Select enabled={hovered}>
            <mesh {...props} ref={ref} scale={clicked ? 1.5 : 1} onClick={(e)=>{click(!clicked)}}
                onPointerOver={(e)=>{e.stopPropagation(), hover(true)}} onPointerOut={(e)=>{hover(false)}}>
                <boxGeometry args={[1, 1, 1]}/> {/*박스 형태를 만드는 태그*/}
                <meshStandardMaterial color={hovered ? 'hotpink':'orange'}/> {/*기본 형태의 텍스쳐 태그 */}
            </mesh>
        </Select>
    )
}

export default function Cube(){
    return(
        <Canvas>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} penumbra={1} decay={0} intensity={Math.PI / 2}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <Selection>
                <EffectComposer multisampling={8} autoClear={false}>
                    <Outline blur visibleEdgeColor="white" edgeStrength={100} width={1000}/>
                </EffectComposer>
                <Box position={[-1.2, 0, 0]}/>
                <Box position={[1.2, 0, 0]}/>
            </Selection>
            <OrbitControls/> {/*마우스로 화면을 움직이거나 확대 및 축소 등을 할 수 있게 해주는 태그*/}
        </Canvas>
    )
}
