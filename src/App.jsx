import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Menu from './component/menu';
import Home from './component/home';
import Cube from './component/cube';
import UiPairing from './component/uiPairing';
import Mix_Controlls from './component/mix_controlls';
import MixingHTML from './component/mixingHTML';
import CanvasWithText from './component/canvasWithText';
import ScrollCanvas from './component/scrollCanvas';
import LoadModel from './component/loadGLTF';
import HTML_annotations from './component/HTML_annotations';
import Simple_physics1 from './component/Simple_physics1';
import TriggerMesh from './component/TriggerMesh';
import SimplArkanoid from './component/simpleArkanoid';
import CollisionEvent from './component/collisionEvent';
import MyPhysics from './component/myPhysics';
import RollTheDice from './component/RollTheDice';
import FlowCamera from './component/flowCamera';
import './App.css';
import YachtDice from './component/YachtDice';
import BpmSurvival from './component/BpmSurvival';

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
    return <MobileNotice />
  }
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true }}>
      <div className='App'>
          <Menu/>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Cube' element={<Cube />} />
              <Route path='/UiPairing' element={<UiPairing />} />
              <Route path='/Mix_Controlls' element={<Mix_Controlls />} />
              <Route path='/Mix_HTML' element={<MixingHTML />} />
              <Route path='/CanvasWithText' element={<CanvasWithText />} />
              <Route path='/ScrollCanvas' element={<ScrollCanvas />} />
              <Route path='/LoadGLTF' element={<LoadModel />} />
              <Route path='/HTML_annotation' element={<HTML_annotations />} />
              <Route path='/SimplPhysics1' element={<Simple_physics1 />} />
              <Route path='/TriggerEvent' element={<TriggerMesh />} />
              <Route path='/SimpleArkanoid' element={<SimplArkanoid />} />
              <Route path='/CollisionEvent' element={<CollisionEvent />} />
              <Route path='/MyPhysics' element={<MyPhysics />} />
              <Route path='/RollTheDice' element={<RollTheDice />} />
              <Route path='/FlowCamera' element={<FlowCamera />} />
              <Route path='/YachtDice' element={<YachtDice />} />
              <Route path='/BpmSurvival' element={<BpmSurvival />} />
          </Routes>
      </div>
  </BrowserRouter>
  )
}

export default App