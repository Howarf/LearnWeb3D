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
import CharacterMove from './component/characterMove';
import MyPhysics from './component/myPhysics';
import './App.css';

function App() {
  return (
    <BrowserRouter>
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
              <Route path='/CharacterMove' element={<CharacterMove />} />
              <Route path='/MyPhysics' element={<MyPhysics />} />
          </Routes>
      </div>
  </BrowserRouter>
  )
}

export default App