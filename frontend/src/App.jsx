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
import CameraFeed from './CameraFeed';
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
  {path:"/CameraFeed", element: <CameraFeed/>},

]);

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}

export default App;
