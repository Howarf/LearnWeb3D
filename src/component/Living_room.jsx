import React, { useRef, useState } from 'react'
import { useGLTF, useHelper } from '@react-three/drei'
import { Object3D, SpotLightHelper } from 'three'
import { getModelUrl } from '../supabaseClient'

export function Living_room(props) {
  const { nodes, materials } = useGLTF(getModelUrl('living_room.glb'));
  // const lightRef = useRef();
  // useHelper(lightRef, SpotLightHelper, "cyan"); 빛이 어디로 보여지는지 알려주는 함수
  const [targetObj] = useState(()=> new Object3D());
  const [targetObj2] = useState(()=> new Object3D());
  return (
    <group {...props} dispose={null}>
      {/*티비*/}
      <group position={[0, -9.589, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cube004_Material001_0.geometry} material={materials['Material.001']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube004_Material012_0.geometry} material={materials['Material.012']} castShadow receiveShadow/>
      </group>
      {/*책*/}
      <group position={[-8.438, 0.572, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cube006_Material015_0.geometry} material={materials['Material.015']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube006_Material016_0.geometry} material={materials['Material.016']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube006_Material017_0.geometry} material={materials['Material.017']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube006_Material018_0.geometry} material={materials['Material.018']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube006_Material019_0.geometry} material={materials['Material.019']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube006_Material023_0.geometry} material={materials['Material.023']} castShadow receiveShadow/>
      </group>
      {/*알람시계*/}
      <group position={[-8.237, 4.004, -1.738]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cube007_Material020_0.geometry} material={materials['Material.020']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube007_Material021_0.geometry} material={materials['Material.021']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube007_Material022_0.geometry} material={materials['Material.022']} castShadow receiveShadow/>
      </group>
      {/*테이블위 컵1*/}
      <group position={[-0.852, 0, 0]} rotation={[-Math.PI / 2, 0, 1.978]}>
        <mesh geometry={nodes.Cube008_Material025_0.geometry} material={materials['Material.025']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube008_Material024_0.geometry} material={materials['Material.024']} castShadow receiveShadow/>
      </group>
      {/*테이블위 컵2*/}
      <group position={[0.318, 0, -0.967]} rotation={[-Math.PI / 2, 0, 1.978]}>
        <mesh geometry={nodes.Cube009_Material027_0.geometry} material={materials['Material.027']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube009_Material017_0.geometry} material={materials['Material.017']} castShadow receiveShadow/>
      </group>
      {/*액자*/}
      <group position={[0, 0, -0.103]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cube010_Material028_0.geometry} material={materials['Material.028']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube010_Material029_0.geometry} material={materials['Material.029']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube010_Material030_0.geometry} material={materials['Material.030']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cube010_Material031_0.geometry} material={materials['Material.031']} castShadow receiveShadow/>
      </group>
      {/*큰 조명*/}
      <group position={[-7.711, 0.067, -5.896]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cylinder_Material009_0.geometry} material={materials['Material.009']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cylinder_Material008_0.geometry} material={materials['Material.008']} castShadow receiveShadow>
          <spotLight target={targetObj} position={[.3, 0.8, 4]} angle={15} intensity={10} penumbra={1} decay={2} color={"#F0DFCC"} castShadow/>
          <mesh object={targetObj} position={[.3, 0.8, 0]} scale={[1, 1, 1]}><boxGeometry/></mesh>
        </mesh>
      </group>
      {/*작은 조명*/}
      <group position={[4.521, 0.067, 7.128]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cylinder001_Material009_0.geometry} material={materials['Material.009']} castShadow receiveShadow/>
        <mesh geometry={nodes.Cylinder001_Material008_0.geometry} material={materials['Material.008']} castShadow receiveShadow/>
        <spotLight target={targetObj2} position={[.29, 14.9, 3.5]} angle={15} intensity={10} penumbra={1} decay={2} color={"#F0DFCC"} castShadow/>
        <mesh object={targetObj2} position={[.29, 14.9, 0]} scale={[1, 1, 1]}><boxGeometry/></mesh>
      </group>
      {/* 벽, 바닥 */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Plane_Material003_0.geometry} material={materials['Material.003']} receiveShadow/>
        <mesh geometry={nodes.Plane_Material002_0.geometry} material={materials['Material.002']} receiveShadow/>
        <mesh geometry={nodes.Plane_Material004_0.geometry} material={materials['Material.004']} receiveShadow/>
      </group>
      {/*쇼파1*/}
      <mesh geometry={nodes.Cube_Material001_0.geometry} material={materials['Material.001']} position={[-0.214, -0.851, 1.322]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow/>
      {/*쇼파2*/}
      <mesh geometry={nodes.Cube001_Material001_0.geometry} material={materials['Material.001']} position={[0.15, -0.867, -0.246]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow receiveShadow/>
      {/*작은 서랍*/}
      <mesh geometry={nodes.Cube002_Material007_0.geometry} material={materials['Material.007']} position={[9.102, 0, 0.007]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} castShadow receiveShadow/>
      {/*큰 서랍*/}
      <mesh geometry={nodes.Cube003_Material009_0.geometry} material={materials['Material.009']} position={[0, -7.793, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow/>
      {/*테이블*/}
      <mesh geometry={nodes.Cube005_Material014_0.geometry} material={materials['Material.014']} position={[0, -3.369, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow/>
      {/*찬장*/}
      <mesh geometry={nodes.Plane001_Material005_0.geometry} material={materials['Material.005']} position={[0.035, 0.396, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow/>
      {/*카펫*/}
      <mesh geometry={nodes.Plane002_Material013_0.geometry} material={materials['Material.013']} position={[0, 0.278, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow/>
    </group>
  )
}

useGLTF.preload(getModelUrl('living_room.glb'));