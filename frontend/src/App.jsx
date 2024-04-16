// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, RouterProvider } from 'react-router-dom';
import InscrireEnseignant from './InscrireEnseignant';
import Authontification from './Authontification';
import Welcome from './Welcome';
import SupprimerEnseignant from './SupprimerEnseignant';
import ModifierEnseignant from './ModifierEnseignant';
import CreateModule from './CreateModule';
import UpdateModule from './UpdateModule';
import ModuelsTreeview from './ModuelsTreeview';
import MyComponent from './MyComponent';
import CameraView from './CameraView';
import SimplePostRequest from './SimplePostRequest';
import HomeEnseignant from './HomeEnseignant';
import AttendanceReport from './components/AttendanceReport'
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {path:"/InscrireEnseignant", element: <InscrireEnseignant/>},
  {path:"/Authontification", element: <Authontification/>},
  {path:"/Welcome", element: <Welcome/>},
  {path:"/SupprimerEnseignant", element: <SupprimerEnseignant/>},
  {path:"/ModifierEnseignant", element: <ModifierEnseignant/>},
  {path:"/CreateModule", element: <CreateModule/>},
  {path:"/UpdateModule", element: <UpdateModule/>},
  {path:"/ModuelsTreeview", element: <ModuelsTreeview/>},
  {path:"/MyComponent", element: <MyComponent/>},
  {path:"/CameraView", element: <CameraView/>},
  {path:"/SimplePostRequest", element: <SimplePostRequest/>},
  {path:"/HomeEnseignant/:enseignantId", element: <HomeEnseignant/>},
  {path:"/HomeEnseignant/:enseignantId", element: <AttendanceReport/>},

]);

function App() {
  return (
    //<div className="App">
          //<HomeEnseignant />
    //</div>
    //<RouterProvider router = {router}/>
    <MyComponent/>

  );
}

export default App;
