import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="text-center p-3">
        © {new Date().getFullYear()} Intendencia de Colonia - Unidad de
        Tecnologías de la Información y Comunicación.
      </div>
    </footer>
  );
};

export default Footer;
