import NavBar from "../../components/navbar/NavBar";
import "./Recuperar.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { API_BASE_URL } from "../../../src/config";
import Swal from "sweetalert2";

const Recuperar = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handlePasswordChange = (event) => {
    event.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las nuevas contraseñas no coinciden.",
      });
      return;
    }

    const requestData = {
      fk_empleado_codigo: user.fk_empleado_codigo,
      currentPassword,
      newPassword,
    };

    axios
      .post(`${API_BASE_URL}/cambioContrasenaWeb`, requestData)
      .then((response) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Contraseña cambiada",
          text: "Tu contraseña ha sido cambiada exitosamente.",
        }).then(() => {
          navigate("/inicio");
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar la contraseña. Por favor, intenta de nuevo.",
        });
      });
  };

  return (
    <>
      <NavBar className="nav" />
      <div className="container login-container">
        <div className="contenedor-recuperar col-md-9 col-sm-12">
          <h4>Funcionario: {user.nombre}</h4>
          <div className="card shadow">
            {loading && (
              <div className="col-md-12 mt-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body px-9">
              <h3>Cambiar Contraseña</h3>
              <form onSubmit={handlePasswordChange}>
                <input
                  type="password"
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="Repetir contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="mt-3 d-grid">
                  <button
                    type="submit"
                    className="custom-btn custom-btn-blue"
                  >
                    
                      Recuperar
                   
                  </button>
                </div>
                <div className="my-4">
                  <hr className="text-muted" />
                </div>
                <div className="mt-3 mb-5 d-grid">
                  <Link to="/inicio" className="text-muted fs-6">
                    Volver
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recuperar;
