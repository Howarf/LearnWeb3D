import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Mini_room(props) {
  const { nodes, materials } = useGLTF('https://hlgbuvqehgcdsanlkzat.supabase.co/storage/v1/object/public/3dWeb-models/mini_room.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.Object_4.geometry} material={materials.Material} position={[0, 1.066, 0]} />
          <mesh geometry={nodes.Object_6.geometry} material={materials['Material.011']} position={[0.859, 0.267, 0.005]} scale={[0.135, 0.336, 0.326]} />
          <mesh geometry={nodes.Object_8.geometry} material={materials['Material.008']} position={[0.866, 0.173, -0.428]} scale={[0.132, 0.107, 0.108]} />
          <mesh geometry={nodes.Object_10.geometry} material={materials['Material.018']} position={[0.733, 0.264, -0.381]} rotation={[-Math.PI, 0, 0]} scale={[-0.007, 0.007, 0.007]} />
          <mesh geometry={nodes.Object_12.geometry} material={materials['Material.019']} position={[0.733, 0.264, -0.481]} rotation={[-Math.PI, 0, 0]} scale={[-0.007, 0.007, 0.007]} />
          <mesh geometry={nodes.Object_14.geometry} material={materials['Material.020']} position={[0.733, 0.172, -0.381]} rotation={[-Math.PI, 0, 0]} scale={[-0.007, 0.007, 0.007]} />
          <mesh geometry={nodes.Object_16.geometry} material={materials['Material.021']} position={[0.733, 0.172, -0.481]} rotation={[-Math.PI, 0, 0]} scale={[-0.007, 0.007, 0.007]} />
          <mesh geometry={nodes.Object_18.geometry} material={materials['Material.013']} position={[0.748, 0.244, -0.264]} rotation={[-Math.PI, 0, 0]} scale={[-0.024, 0.024, 0.031]} />
          <mesh geometry={nodes.Object_20.geometry} material={materials['Material.022']} position={[0.723, 0.262, -0.265]} rotation={[-Math.PI, 0, 0]} scale={[-0.004, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_22.geometry} material={materials['Material.007']} position={[0.873, 0.433, -0.77]} scale={[0.121, 0.371, 0.228]} />
          <mesh geometry={nodes.Object_24.geometry} material={materials['Material.016']} position={[0.74, 0.271, -0.745]} rotation={[-Math.PI, 0, 0]} scale={[-0.006, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_26.geometry} material={materials['Material.015']} position={[0.74, 0.271, -0.787]} rotation={[-Math.PI, 0, 0]} scale={[-0.006, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_28.geometry} material={materials['Material.017']} position={[0.74, 0.616, -0.787]} rotation={[-Math.PI, 0, 0]} scale={[-0.006, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_30.geometry} material={materials['Material.054']} position={[0.981, 0.767, -0.573]} rotation={[-Math.PI, 0, 0]} scale={[-0.013, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_32.geometry} material={materials['Material.053']} position={[0.981, 0.767, -0.636]} rotation={[-Math.PI, 0, 0]} scale={[-0.013, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_34.geometry} material={materials['Material.052']} position={[0.981, 0.767, -0.71]} rotation={[-Math.PI, 0, 0]} scale={[-0.013, 0.004, 0.004]} />
          <mesh geometry={nodes.Object_36.geometry} material={materials['Material.049']} position={[0.916, 0.768, -0.573]} rotation={[0, 0, -1.57]} scale={[0.002, 0.054, 0.002]} />
          <mesh geometry={nodes.Object_38.geometry} material={materials['Material.050']} position={[0.916, 0.768, -0.637]} rotation={[0, 0, -1.57]} scale={[0.002, 0.054, 0.002]} />
          <mesh geometry={nodes.Object_40.geometry} material={materials['Material.051']} position={[0.916, 0.768, -0.711]} rotation={[0, 0, -1.57]} scale={[0.002, 0.054, 0.002]} />
          <mesh geometry={nodes.Object_42.geometry} material={materials['Material.012']} position={[0.813, 0.261, -0.054]} scale={[0.09, 0.172, 0.172]} />
          <mesh geometry={nodes.Object_44.geometry} material={materials['Material.023']} position={[0.867, 0.265, 0.101]} scale={[0.002, 0.005, 0.002]} />
          <mesh geometry={nodes.Object_46.geometry} material={materials['Material.024']} position={[0.867, 0.265, -0.221]} scale={[0.002, 0.005, 0.002]} />
          <mesh geometry={nodes.Object_48.geometry} material={materials['Material.009']} position={[0.898, 0.07, 0.663]} scale={[0.072, 0.004, 0.212]} />
          <mesh geometry={nodes.Object_50.geometry} material={materials['Material.033']} position={[0.838, 0.199, 0.867]} scale={0.005} />
          <mesh geometry={nodes.Object_52.geometry} material={materials['Material.035']} position={[0.838, 0.199, 0.461]} scale={0.005} />
          <mesh geometry={nodes.Object_54.geometry} material={materials['Material.034']} position={[0.96, 0.199, 0.867]} scale={0.005} />
          <mesh geometry={nodes.Object_56.geometry} material={materials['Material.037']} position={[0.96, 0.199, 0.461]} scale={0.005} />
          <mesh geometry={nodes.Object_58.geometry} material={materials['Material.040']} position={[0.894, 0.204, 0.661]} scale={[0.072, 0.01, 0.229]} />
          <mesh geometry={nodes.Object_60.geometry} material={materials['Material.039']} position={[0.892, 0.211, 0.666]} rotation={[0, -0.364, Math.PI]} scale={[0.004, 0.004, 0.075]} />
          <mesh geometry={nodes.Object_62.geometry} material={materials['Material.078']} position={[0.89, 0.375, 0.67]} rotation={[-1.562, -0.003, -0.364]} scale={[-0.002, 0.243, 0.14]} />
          <mesh geometry={nodes.Object_64.geometry} material={materials['Material.001']} position={[0.002, 0.99, -1.005]} rotation={[-Math.PI, 0, 0]} scale={[-0.307, 0.368, 0.017]} />
          <mesh geometry={nodes.Object_66.geometry} material={materials['Material.014']} position={[0.002, 0.99, -0.997]} rotation={[-Math.PI, 0, 0]} scale={[-0.324, 0.373, 0.02]} />
          <mesh geometry={nodes.Object_68.geometry} material={materials['Material.056']} position={[0.128, 0.108, 0.651]} rotation={[-Math.PI, 0, 0]} scale={[-0.147, 0.022, 0.186]} />
          <mesh geometry={nodes.Object_70.geometry} material={materials['Material.055']} position={[0.067, 0.241, 0.656]} rotation={[-Math.PI, 0, -0.179]} scale={[-0.019, 0.11, 0.145]} />
          <mesh geometry={nodes.Object_72.geometry} material={materials['Material.025']} position={[0.005, 0.078, 0.812]} scale={[0.008, 0.012, 0.008]} />
          <mesh geometry={nodes.Object_74.geometry} material={materials['Material.027']} position={[0.005, 0.078, 0.485]} scale={[0.008, 0.012, 0.008]} />
          <mesh geometry={nodes.Object_76.geometry} material={materials['Material.028']} position={[0.243, 0.078, 0.812]} scale={[0.008, 0.012, 0.008]} />
          <mesh geometry={nodes.Object_78.geometry} material={materials['Material.026']} position={[0.243, 0.078, 0.485]} scale={[0.008, 0.012, 0.008]} />
          <mesh geometry={nodes.Object_80.geometry} material={materials['Material.010']} position={[-0.141, 0.12, -0.495]} scale={[0.364, 0.024, 0.504]} />
          <mesh geometry={nodes.Object_82.geometry} material={materials['Material.030']} position={[-0.464, 0.088, -0.026]} scale={[0.011, 0.018, 0.011]} />
          <mesh geometry={nodes.Object_84.geometry} material={materials['Material.029']} position={[0.169, 0.088, -0.026]} scale={[0.011, 0.018, 0.011]} />
          <mesh geometry={nodes.Object_86.geometry} material={materials['Material.032']} position={[-0.464, 0.088, -0.943]} scale={[0.011, 0.018, 0.011]} />
          <mesh geometry={nodes.Object_88.geometry} material={materials['Material.031']} position={[0.169, 0.088, -0.943]} scale={[0.011, 0.018, 0.011]} />
          <mesh geometry={nodes.Object_90.geometry} material={materials['Material.057']} position={[-0.14, 0.158, -0.478]} scale={[0.363, 0.018, 0.48]} />
          <mesh geometry={nodes.Object_92.geometry} material={materials['Material.059']} position={[-0.006, 0.271, -0.922]} rotation={[-2.001, 0, 0]} scale={[-0.141, 0.017, 0.076]} />
          <mesh geometry={nodes.Object_94.geometry} material={materials['Material.058']} position={[-0.302, 0.271, -0.922]} rotation={[-2.001, 0, 0]} scale={[-0.141, 0.017, 0.076]} />
          <mesh geometry={nodes.Object_96.geometry} material={materials['Material.043']} position={[0.965, 0.734, 0.15]} rotation={[-Math.PI, 0, 0]} scale={[-0.061, 0.008, 0.164]} />
          <mesh geometry={nodes.Object_98.geometry} material={materials['Material.094']} position={[-0.872, 0.801, -0.936]} scale={[0.012, 0.756, 0.012]} />
          <mesh geometry={nodes.Object_100.geometry} material={materials.material_0} position={[0.004, 0.054, -0.078]} scale={[0.838, 0.838, 0.877]} />
          <mesh geometry={nodes.Object_102.geometry} material={materials['Material.045']} position={[0.946, 0.287, -0.028]} rotation={[-Math.PI, 0.051, 0]} scale={[-0.02, 0.003, 0.057]} />
          <mesh geometry={nodes.Object_104.geometry} material={materials['Material.046']} position={[0.933, 0.384, -0.026]} rotation={[1.573, -0.004, 0.05]} scale={[0.004, 0.145, 0.075]} />
          <mesh geometry={nodes.Object_106.geometry} material={materials.material_0} position={[0.79, 0.288, -0.119]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.028]} />
          <mesh geometry={nodes.Object_108.geometry} material={materials.material_0} position={[0.79, 0.288, -0.155]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_110.geometry} material={materials.material_0} position={[0.79, 0.288, -0.168]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_112.geometry} material={materials.material_0} position={[0.799, 0.288, -0.164]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.01]} />
          <mesh geometry={nodes.Object_114.geometry} material={materials.material_0} position={[0.799, 0.288, -0.132]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_116.geometry} material={materials.material_0} position={[0.799, 0.288, -0.144]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_118.geometry} material={materials.material_0} position={[0.799, 0.288, -0.106]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_120.geometry} material={materials.material_0} position={[0.799, 0.288, -0.119]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_122.geometry} material={materials.material_0} position={[0.799, 0.288, -0.08]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_124.geometry} material={materials.material_0} position={[0.799, 0.288, -0.093]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_126.geometry} material={materials.material_0} position={[0.799, 0.288, -0.047]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_128.geometry} material={materials.material_0} position={[0.799, 0.288, -0.067]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_130.geometry} material={materials.material_0} position={[0.79, 0.288, -0.082]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_132.geometry} material={materials.material_0} position={[0.79, 0.288, -0.051]} rotation={[-Math.PI, 0, 0]} scale={[-0.004, 0.003, 0.01]} />
          <mesh geometry={nodes.Object_134.geometry} material={materials.material_0} position={[0.79, 0.288, -0.069]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_136.geometry} material={materials.material_0} position={[0.807, 0.288, -0.139]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_138.geometry} material={materials.material_0} position={[0.807, 0.288, -0.152]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_140.geometry} material={materials.material_0} position={[0.807, 0.288, -0.113]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_142.geometry} material={materials.material_0} position={[0.807, 0.288, -0.126]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_144.geometry} material={materials.material_0} position={[0.807, 0.288, -0.087]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_146.geometry} material={materials.material_0} position={[0.807, 0.288, -0.1]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_148.geometry} material={materials.material_0} position={[0.807, 0.288, -0.06]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_150.geometry} material={materials.material_0} position={[0.807, 0.288, -0.074]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_152.geometry} material={materials.material_0} position={[0.816, 0.288, -0.132]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_154.geometry} material={materials.material_0} position={[0.816, 0.288, -0.144]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_156.geometry} material={materials.material_0} position={[0.816, 0.288, -0.106]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_158.geometry} material={materials.material_0} position={[0.816, 0.288, -0.119]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_160.geometry} material={materials.material_0} position={[0.816, 0.288, -0.08]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_162.geometry} material={materials.material_0} position={[0.816, 0.288, -0.093]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_164.geometry} material={materials.material_0} position={[0.816, 0.288, -0.05]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.008]} />
          <mesh geometry={nodes.Object_166.geometry} material={materials.material_0} position={[0.816, 0.288, -0.067]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_168.geometry} material={materials.material_0} position={[0.816, 0.288, -0.157]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_170.geometry} material={materials.material_0} position={[0.807, 0.288, -0.167]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_172.geometry} material={materials.material_0} position={[0.816, 0.288, -0.168]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.005]} />
          <mesh geometry={nodes.Object_174.geometry} material={materials.material_0} position={[0.824, 0.288, -0.126]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_176.geometry} material={materials.material_0} position={[0.824, 0.288, -0.139]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_178.geometry} material={materials.material_0} position={[0.824, 0.288, -0.101]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_180.geometry} material={materials.material_0} position={[0.824, 0.288, -0.113]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_182.geometry} material={materials.material_0} position={[0.824, 0.288, -0.074]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_184.geometry} material={materials.material_0} position={[0.824, 0.288, -0.087]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_186.geometry} material={materials.material_0} position={[0.824, 0.288, -0.047]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_188.geometry} material={materials.material_0} position={[0.824, 0.288, -0.061]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_190.geometry} material={materials.material_0} position={[0.824, 0.288, -0.152]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_192.geometry} material={materials.material_0} position={[0.824, 0.288, -0.169]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.005]} />
          <mesh geometry={nodes.Object_194.geometry} material={materials.material_0} position={[0.79, 0.288, -0.031]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_196.geometry} material={materials.material_0} position={[0.79, 0.288, -0.018]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_198.geometry} material={materials.material_0} position={[0.79, 0.288, -0.004]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_200.geometry} material={materials.material_0} position={[0.799, 0.288, -0.018]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_202.geometry} material={materials.material_0} position={[0.807, 0.288, -0.047]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_204.geometry} material={materials.material_0} position={[0.79, 0.288, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_206.geometry} material={materials.material_0} position={[0.79, 0.288, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_208.geometry} material={materials.material_0} position={[0.79, 0.288, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_210.geometry} material={materials.material_0} position={[0.799, 0.288, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_212.geometry} material={materials.material_0} position={[0.799, 0.288, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_214.geometry} material={materials.material_0} position={[0.799, 0.288, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_216.geometry} material={materials.material_0} position={[0.809, 0.288, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_218.geometry} material={materials.material_0} position={[0.809, 0.288, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_220.geometry} material={materials.material_0} position={[0.809, 0.288, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_222.geometry} material={materials.material_0} position={[0.819, 0.288, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_224.geometry} material={materials.material_0} position={[0.819, 0.288, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_226.geometry} material={materials.material_0} position={[0.819, 0.288, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_228.geometry} material={materials.material_0} position={[0.819, 0.287, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_230.geometry} material={materials.material_0} position={[0.819, 0.287, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_232.geometry} material={materials.material_0} position={[0.819, 0.287, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_234.geometry} material={materials.material_0} position={[0.807, 0.286, -0.065]} rotation={[0, 0, -Math.PI]} scale={[0.023, 0.003, 0.112]} />
          <mesh geometry={nodes.Object_236.geometry} material={materials.material_0} position={[0.809, 0.287, 0.012]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_238.geometry} material={materials.material_0} position={[0.809, 0.287, 0.025]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_240.geometry} material={materials.material_0} position={[0.809, 0.287, 0.039]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_242.geometry} material={materials.material_0} position={[0.809, 0.288, -0.031]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_244.geometry} material={materials.material_0} position={[0.809, 0.288, -0.018]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_246.geometry} material={materials.material_0} position={[0.809, 0.288, -0.005]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_248.geometry} material={materials.material_0} position={[0.818, 0.288, -0.031]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_250.geometry} material={materials.material_0} position={[0.818, 0.288, -0.018]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_252.geometry} material={materials.material_0} position={[0.818, 0.288, -0.005]} rotation={[0, 0, -Math.PI]} scale={[0.004, 0.003, 0.006]} />
          <mesh geometry={nodes.Object_254.geometry} material={materials['Material.048']} position={[0.811, 0.286, 0.09]} rotation={[Math.PI, -0.253, 0]} scale={[-0.019, 0.003, 0.01]} />
          <mesh geometry={nodes.Object_256.geometry} material={materials['Material.047']} position={[0.809, 0.285, -0.026]} scale={[0.046, 0.05, 0.162]} />
          <mesh geometry={nodes.Object_258.geometry} material={materials['Material.004']} position={[1.002, 0.711, 0.141]} rotation={[-Math.PI, 0, 0]} scale={[-0.004, 0.008, 0.164]} />
          <mesh geometry={nodes.Object_260.geometry} material={materials['Material.006']} position={[-0.494, 0.095, -0.511]} scale={[0.002, 0.002, 0.443]} />
          <mesh geometry={nodes.Object_262.geometry} material={materials['Material.005']} position={[0.21, 0.095, -0.511]} scale={[0.002, 0.002, 0.443]} />
          <mesh geometry={nodes.Object_264.geometry} material={materials['Material.041']} position={[0.822, 0.388, 0.88]} rotation={[0, -0.442, 0]} scale={[0.003, 0.061, 0.005]} />
          <mesh geometry={nodes.Object_266.geometry} material={materials['Material.060']} position={[0.985, 0.068, -0.034]} rotation={[0, 0, -Math.PI]} scale={[0.001, 0.001, 0.259]} />
          <mesh geometry={nodes.Object_268.geometry} material={materials['Material.061']} position={[-0.048, 2.019, -1]} scale={[0.479, 0.013, 0.013]} />
          <mesh geometry={nodes.Object_270.geometry} material={materials['Material.003']} position={[0.848, 0.367, 0.236]} rotation={[-Math.PI, 0, 0]} scale={[-0.081, 0.083, 0.032]} />
          <mesh geometry={nodes.Object_272.geometry} material={materials['Material.063']} position={[0.867, 0.354, 0.265]} rotation={[0, 0, -Math.PI]} scale={[0.055, 0.055, 0.002]} />
          <mesh geometry={nodes.Object_274.geometry} material={materials.material_0} position={[0.919, 0.406, 0.262]} rotation={[-1.558, 0, 0]} scale={[-0.001, 0.002, 0.001]} />
          <mesh geometry={nodes.Object_276.geometry} material={materials.material_0} position={[0.919, 0.303, 0.262]} rotation={[-1.558, 0, 0]} scale={[-0.001, 0.002, 0.001]} />
          <mesh geometry={nodes.Object_278.geometry} material={materials.material_0} position={[0.816, 0.406, 0.262]} rotation={[-1.558, 0, 0]} scale={[-0.001, 0.002, 0.001]} />
          <mesh geometry={nodes.Object_280.geometry} material={materials.material_0} position={[0.816, 0.303, 0.262]} rotation={[-1.558, 0, 0]} scale={[-0.001, 0.002, 0.001]} />
          <mesh geometry={nodes.Object_282.geometry} material={materials['Material.062']} position={[0.899, 0.381, 0.253]} rotation={[-Math.PI, 0, 0]} scale={[-0.006, 0.006, 0.006]} />
          <mesh geometry={nodes.Object_284.geometry} material={materials['Material.038']} position={[0.899, 0.381, 0.246]} rotation={[-1.514, 0, 0]} scale={[-0.009, 0.009, 0.009]} />
          <mesh geometry={nodes.Object_286.geometry} material={materials['Material.064']} position={[0.899, 0.381, 0.243]} rotation={[-1.514, 0, 0]} scale={[-0.004, 0.002, 0.004]} />
          <mesh geometry={nodes.Object_288.geometry} material={materials['Material.065']} position={[0.885, 0.334, 0.244]} rotation={[0, 0, -Math.PI]} scale={[-0.036, 0, 0.002]} />
          <mesh geometry={nodes.Object_290.geometry} material={materials['Material.066']} position={[0.885, 0.329, 0.244]} scale={[0.036, 0, 0.002]} />
          <mesh geometry={nodes.Object_292.geometry} material={materials['Material.067']} position={[0.885, 0.338, 0.252]} rotation={[0, 0, -Math.PI]} scale={[-0.036, 0, 0.002]} />
          <mesh geometry={nodes.Object_294.geometry} material={materials['Material.069']} position={[0.864, 0.378, 0.254]} rotation={[-Math.PI, 0, 0]} scale={[0, 0.019, 0.001]} />
          <mesh geometry={nodes.Object_296.geometry} material={materials['Material.069']} position={[0.869, 0.378, 0.254]} rotation={[-Math.PI, 0, 0]} scale={[0, 0.019, 0.001]} />
          <mesh geometry={nodes.Object_298.geometry} material={materials['Material.069']} position={[0.873, 0.378, 0.254]} rotation={[-Math.PI, 0, 0]} scale={[0, 0.019, 0.001]} />
          <mesh geometry={nodes.Object_300.geometry} material={materials['Material.070']} position={[0.831, 0.37, 0.204]} rotation={[0, 0, -Math.PI]} scale={[0.002, 0.08, 0.001]} />
          <mesh geometry={nodes.Object_302.geometry} material={materials['Material.071']} position={[0.791, 0.413, 0.264]} rotation={[1.564, 0, 0]} scale={[0.01, 0.001, 0.01]} />
          <mesh geometry={nodes.Object_304.geometry} material={materials['Material.071']} position={[0.791, 0.38, 0.264]} rotation={[1.564, 0, 0]} scale={[0.01, 0.001, 0.01]} />
          <mesh geometry={nodes.Object_306.geometry} material={materials['Material.071']} position={[0.791, 0.347, 0.264]} rotation={[1.564, 0, 0]} scale={[0.01, 0.001, 0.01]} />
          <mesh geometry={nodes.Object_308.geometry} material={materials['Material.071']} position={[0.791, 0.314, 0.264]} rotation={[1.564, 0, 0]} scale={[0.01, 0.001, 0.01]} />
          <mesh geometry={nodes.Object_310.geometry} material={materials['Material.074']} position={[0.781, 0.396, 0.236]} rotation={[0, 0, 1.578]} scale={0.017} />
          <mesh geometry={nodes.Object_312.geometry} material={materials['Material.072']} position={[0.781, 0.39, 0.236]} rotation={[0, 0, 1.578]} scale={0.011} />
          <mesh geometry={nodes.Object_314.geometry} material={materials['Material.073']} position={[0.781, 0.394, 0.236]} rotation={[0, 0, 1.578]} scale={0.016} />
          <mesh geometry={nodes.Object_316.geometry} material={materials['Material.075']} position={[0.768, 0.364, 0.236]} rotation={[-Math.PI, 0, 0]} scale={[-0.001, 0.069, 0.025]} />
          <mesh geometry={nodes.Object_318.geometry} material={materials['Material.074']} position={[0.781, 0.359, 0.236]} rotation={[0, 0, 1.578]} scale={0.017} />
          <mesh geometry={nodes.Object_320.geometry} material={materials['Material.072']} position={[0.781, 0.353, 0.236]} rotation={[0, 0, 1.578]} scale={0.011} />
          <mesh geometry={nodes.Object_322.geometry} material={materials['Material.073']} position={[0.781, 0.357, 0.236]} rotation={[0, 0, 1.578]} scale={0.016} />
          <mesh geometry={nodes.Object_324.geometry} material={materials['Material.074']} position={[0.781, 0.316, 0.236]} rotation={[0, 0, 1.578]} scale={0.017} />
          <mesh geometry={nodes.Object_326.geometry} material={materials['Material.072']} position={[0.781, 0.31, 0.236]} rotation={[0, 0, 1.578]} scale={0.011} />
          <mesh geometry={nodes.Object_328.geometry} material={materials['Material.073']} position={[0.781, 0.314, 0.236]} rotation={[0, 0, 1.578]} scale={0.016} />
          <mesh geometry={nodes.Object_330.geometry} material={materials['Material.077']} position={[0.987, 0.622, -0.299]} rotation={[1.572, 0, 1.576]} scale={[0.13, 0.06, 0.183]} />
          <mesh geometry={nodes.Object_332.geometry} material={materials['Material.076']} position={[0.987, 0.622, -0.299]} rotation={[0, 0, 1.576]} scale={[0.186, 0.136, 0.136]} />
          <mesh geometry={nodes.Object_334.geometry} material={materials['Material.057']} position={[-0.14, 0.189, -0.478]} scale={[0.363, 0.018, 0.48]} />
          <mesh geometry={nodes.Object_336.geometry} material={materials['Material.080']} position={[0.766, 0.443, 0.256]} scale={[0.002, 0.001, 0.002]} />
          <mesh geometry={nodes.Object_338.geometry} material={materials['Material.081']} position={[0.766, 0.443, 0.244]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.002, 0.001, 0.009]} />
          <mesh geometry={nodes.Object_340.geometry} material={materials['Material.082']} position={[-0.145, 0.38, -0.382]} scale={0.464} />
          <mesh geometry={nodes.Object_342.geometry} material={materials['Material.036']} position={[0.812, 0.298, -0.279]} scale={[0.011, 0.015, 0.011]} />
          <mesh geometry={nodes.Object_344.geometry} material={materials['Material.042']} position={[0.863, 0.284, -0.364]} scale={[0.024, 0.005, 0.024]} />
          <mesh geometry={nodes.Object_346.geometry} material={materials['Material.084']} position={[0.863, 0.362, -0.364]} scale={0.023} />
          <mesh geometry={nodes.Object_348.geometry} material={materials['Material.085']} position={[0.863, 0.366, -0.364]} rotation={[-Math.PI, 0, 0]} scale={[-0.006, 0.006, 0.006]} />
          <mesh geometry={nodes.Object_350.geometry} material={materials.material_0} position={[0.813, 0.301, -0.281]} rotation={[-2.925, 0.129, 0]} scale={[-0.003, 0.003, 0.003]} />
          <mesh geometry={nodes.Object_352.geometry} material={materials['Material.086']} position={[0.812, 0.296, -0.279]} scale={[0.008, 0.011, 0.008]} />
          <mesh geometry={nodes.Object_354.geometry} material={materials.material_0} position={[0.813, 0.3, -0.277]} rotation={[0.295, 0, 0]} scale={0.002} />
          <mesh geometry={nodes.Object_356.geometry} material={materials['Material.088']} position={[0.864, 0.281, -0.425]} scale={0.099} />
          <mesh geometry={nodes.Object_358.geometry} material={materials['Material.089']} position={[0.944, 0.289, -0.261]} rotation={[1.594, 0.02, -1.315]} scale={[0.018, 0.036, 0.004]} />
          <mesh geometry={nodes.Object_360.geometry} material={materials['Material.090']} position={[0.943, 0.289, -0.261]} rotation={[-1.548, -0.02, 1.315]} scale={[-0.017, 0.035, 0.003]} />
          <mesh geometry={nodes.Object_362.geometry} material={materials['Material.089']} position={[0.944, 0.296, -0.261]} rotation={[1.591, 0.023, -1.178]} scale={[0.018, 0.036, 0.004]} />
          <mesh geometry={nodes.Object_364.geometry} material={materials['Material.090']} position={[0.943, 0.296, -0.261]} rotation={[-1.551, -0.023, 1.178]} scale={[-0.017, 0.035, 0.003]} />
          <mesh geometry={nodes.Object_366.geometry} material={materials['Material.089']} position={[0.944, 0.296, -0.261]} rotation={[1.591, 0.023, -1.178]} scale={[0.018, 0.036, 0.004]} />
          <mesh geometry={nodes.Object_368.geometry} material={materials['Material.091']} position={[0.944, 0.305, -0.261]} rotation={[1.596, 0.017, -1.428]} scale={[0.018, 0.036, 0.004]} />
          <mesh geometry={nodes.Object_370.geometry} material={materials['Material.092']} position={[0.943, 0.305, -0.261]} rotation={[-1.546, -0.017, 1.428]} scale={[-0.017, 0.035, 0.003]} />
          <mesh geometry={nodes.Object_372.geometry} material={materials['Material.091']} position={[0.944, 0.305, -0.261]} rotation={[1.596, 0.017, -1.428]} scale={[0.018, 0.036, 0.004]} />
          <mesh geometry={nodes.Object_374.geometry} material={materials['Material.095']} position={[0.514, 0.293, -0.794]} rotation={[-Math.PI, 0.543, -Math.PI]} scale={[-0.07, 0.231, 0.013]} />
          <mesh geometry={nodes.Object_376.geometry} material={materials['Material.102']} position={[0.522, 0.408, -0.829]} rotation={[-0.339, -0.515, -1.75]} scale={[0.165, 0.114, 0.002]} />
          <mesh geometry={nodes.Object_378.geometry} material={materials['Material.096']} position={[0.531, 0.408, -0.832]} rotation={[-0.36, -0.514, -0.183]} scale={[0.109, 0.17, 0.003]} />
          <mesh geometry={nodes.Object_380.geometry} material={materials['Material.097']} position={[-0.735, 0.104, -0.741]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.074, 0.05, 0.249]} />
          <mesh geometry={nodes.Object_382.geometry} material={materials['Material.098']} position={[-0.735, 0.244, -0.741]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.074, 0.092, 0.249]} />
          <mesh geometry={nodes.Object_384.geometry} material={materials['Material.099']} position={[-0.733, 0.136, -0.747]} scale={[0.033, 0.016, 0.057]} />
          <mesh geometry={nodes.Object_386.geometry} material={materials['Material.106']} position={[-0.735, 0.202, -0.739]} scale={[0.072, 0.053, 0.247]} />
          <mesh geometry={nodes.Object_388.geometry} material={materials['Material.108']} position={[-0.735, 0.174, -0.739]} scale={[0.072, 0.02, 0.247]} />
          <mesh geometry={nodes.Object_390.geometry} material={materials['Material.109']} position={[-0.706, 0.202, -0.878]} scale={0.007} />
          <mesh geometry={nodes.Object_392.geometry} material={materials['Material.110']} position={[-0.76, 0.227, -0.685]} scale={[0.002, 0.049, 0.002]} />
          <mesh geometry={nodes.Object_394.geometry} material={materials['Material.068']} position={[0.87, 0.33, 0.242]} rotation={[1.548, 0.001, 3.103]} scale={0.003} />
          <mesh geometry={nodes.Object_396.geometry} material={materials['Material.068']} position={[0.875, 0.331, 0.242]} rotation={[1.548, 0.001, 3.103]} scale={0.002} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('https://hlgbuvqehgcdsanlkzat.supabase.co/storage/v1/object/public/3dWeb-models/mini_room.glb')
