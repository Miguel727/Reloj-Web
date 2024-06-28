import Inicio from "./pages/inicio/Inicio";
import Reasignar from "./pages/reasignar/Reasignar";
import Recuperar from "./pages/recuperar/Recuperar";
import AgregarEmail from "./pages/agregarEmail/AgregarEmail";
import Login from "./pages/login/Login";


import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (

    <>

      <BrowserRouter basename="/web">
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/inicio" element={<Inicio />}></Route>
          <Route exact path="/reasignar" element={<Reasignar />}></Route>
          <Route exact path="/recuperar" element={<Recuperar />}></Route>
          <Route exact path="/agregar-email" element={<AgregarEmail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
