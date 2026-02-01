import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { getModelUrl } from '../supabaseClient'

export function CharModel({currentAnim = "Idle" , ...props}) {
  const group = React.useRef()
  const { scene, animations } = useGLTF(getModelUrl('voxelCharacter.glb'))
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  useEffect(()=>{
    clone.traverse((object) => {
      if(object.isMesh){
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }, [clone])

  useEffect(()=> {
    const action = actions[currentAnim]
    if(action){
      action.reset().fadeIn(0.2)
      if(currentAnim === "Jump"){
        action.setLoop(THREE.LoopOnce, 1)
        action.clampWhenFinished = true
      }else{
        action.setLoop(THREE.LoopRepeat)
      }
      action.play()
      return()=>{
        action.fadeOut(0.2)
      }
    }
  }, [currentAnim, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0, 1.06, 0]}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone_L004} />
          <primitive object={nodes.Bone_R004} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(getModelUrl('voxelCharacter.glb'))