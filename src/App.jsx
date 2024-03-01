import Inicio from "./pages/inicio/Inicio";
import Reasignar from "./pages/reasignar/Reasignar";
import Login from "./pages/login/Login";


import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (

    <>
    
      <BrowserRouter>
      
        <Routes>
          <Route exact path="/"  element={<Login/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/inicio" element={<Inicio/>}></Route>
          <Route exact path="/reasignar" element={<Reasignar/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
