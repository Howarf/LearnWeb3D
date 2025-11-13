import { OrbitControls, TransformControls, useCursor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { create } from "zustand";

const useStore = create((set)=> ( { target: null, setTarget: (target)=> set({target}) } ))

function Box(props){
    const setTarget = useStore((state) => state.setTarget);
    const [hovered, hover] = useState(false);
    useCursor(hovered);
    return(
        <mesh {...props} onClick={(e)=>setTarget(e.object)} onPointerOver={()=>hover(true)} onPointerOut={()=>hover(false)}>
            <boxGeometry/>
            <meshNormalMaterial/>
        </mesh>
    )
}

export default function Mix_Controlls(){
    const {target, setTarget} = useStore(); //타겟 리셋을 위한 선언
    const {mode, position_x, position_y, position_z} = useControls({ mode: {value: 'translate', options: ['translate', 'rotate', 'scale'] },
        position_x:{value: 2}, position_y:{value: 2}, position_z:{value: 0}});
    const [x, setX] = useState(2);
    const [y, setY] = useState(2);
    const [z, setZ] = useState(0);

    useEffect(()=>{
        target === null ? (console.log(target)):(console.log(target.position.x));
        setX(position_x);   //controls에는 변수들 선언한후 그 변수에 value들과
        setY(position_y);   //컨트롤하는 방식(옵션,드래그바,수치)을 고르는 객체를 만드는 느낌
        setZ(position_z);
    },[position_x, position_y, position_z,target])

    return(
        <Canvas dpr={[1, 2]} onPointerMissed={()=>setTarget(null)}>
            <Box position={[x, y, z]}/>
            <Box />
            {target && <TransformControls object={target} mode={mode}/>}
            <OrbitControls makeDefault/>
        </Canvas>
    )
}