import { useEffect, useState } from "react";
import {useAuthRedirect} from '../../hooks/UseAuthRedirect';
import logoIntendencia from "../../img/LOGO.png";
import axios from "axios";
import NavBar from "../../components/navbar/NavBar";
import DataTable from "react-data-table-component";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./inicio.css";
import Footer from "../../components/footer/Footer";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { API_BASE_URL } from "../../../src/config";


const Inicio = () => {
  
  useAuthRedirect();

  const [data, setData] = useState(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(false);
  let user = JSON.parse(sessionStorage.getItem("user"));
  const url = `${API_BASE_URL}/reporte`;
 
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    Accept: "application/json",
  };
 
  useEffect(() => {
 
    if (desde && hasta) {
      fetchData();
    }
    else {
      obtenerFechasPorDefecto();
    }

  }, [desde, hasta]);

  const obtenerFechasPorDefecto = async () => {
    if (!desde || !hasta) {
      const fechaActual = new Date();
      const primerDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
      )
        .toISOString()
        .split("T")[0];
      const fechaActualISO = fechaActual.toISOString().split("T")[0];

      setDesde(primerDiaDelMes);
      setHasta(fechaActualISO);
    }
  };

  const fetchData = async () => {
    setLoading(true); // Inicia la carga
    try {
      const response = await axios.post(
        url,
        {
          fechainicio: desde,

          fechafin: hasta,

          fk_empleado_codigo: user.fk_empleado_codigo,
          fk_oficina_id: "ALL",
        },
        { headers }
      );

      let registros = null;

      if (response.data.registros_ok) {
        registros = response.data.registros_ok[user.fk_empleado_codigo];
      }
      console.log(registros);
      if (registros && registros.length >= 0) {
        registros = registros.reverse();
        setData(registros);

      }
      else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false); // Finaliza la carga
    }
  };

  const quitarPrefijoFicha = (codigo) => {
    if (codigo.startsWith("10000")) {
      return codigo.slice(5);
    } else if (codigo.startsWith("1000")) {
      return codigo.slice(4);
    } else if (codigo.startsWith("100")) {
      return codigo.slice(3);
    } else {
      return codigo;
    }
  };

  const imprimirTabla = () => {
    if (!data) {
      return;
    }

    const doc = new jsPDF();

    let startX = 10;
    //let centerX;
    let startY = 20;
    let currentY = startY;
    const tableColumn = ["Fecha", "Entrada", "Salida"];
    const tableRows = [];
    const title =
      "Reporte usuario: " + quitarPrefijoFicha(user.fk_empleado_codigo);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(16);
    doc.text(title, startX, currentY);


    const imageWidth = 75;
    const imageHeight = 20;
    const imageX = doc.internal.pageSize.width - imageWidth - startX;
    doc.addImage(
      logoIntendencia,
      "JPEG",
      imageX,
      currentY - 10,
      imageWidth,
      imageHeight
    );


    data.forEach(row => {
      const rowData = [
        row.registro_fecha.split('-').reverse().join('-'),
        row.entrada,
        row.salida,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    //doc.text(`Reporte usuario: ${quitarPrefijoFicha(user.fk_empleado_codigo)}`, 14, 15);
    doc.save(`Reporte_${quitarPrefijoFicha(user.fk_empleado_codigo)}.pdf`);
  };

  const columnas = [
    {
      name: "Fecha",
      selector: (row) => {
        const [year, month, day] = row.registro_fecha.split('-');
        return `${day}-${month}-${year}`;
      },
      sortable: true,
    }
    ,
    {
      name: "Entrada",
      selector: (row) => row.entrada,
      sortable: true,
    },
    {
      name: "Salida",
      selector: (row) => row.salida,
      sortable: true,
    },

  ];

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: "Seleccionar todas",
    selectAllRowsItemText: "todos",
    selectAllRowsItemDisabled: "Todas las filas seleccionadas",
  };

  const handleDesdeChange = (event) => {
    setDesde(event.target.value);
  };

  const handleHastaChange = (event) => {
    setHasta(event.target.value);
  };

  return (
    <>
      <NavBar className="nav" />

      <div className="container-fluid" id="root">
        <h4>Funcionario: {user.nombre} </h4>

        <Form>
          <Row>
            <Col>
              <Form.Group controlId="desde" className="mb-3">
                <Form.Label>Desde:</Form.Label>
                <Form.Control
                  type="date"
                  value={desde}
                  onChange={handleDesdeChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="hasta" className="mb-3">
                <Form.Label>Hasta:</Form.Label>
                <Form.Control
                  type="date"
                  value={hasta}
                  onChange={handleHastaChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" onClick={imprimirTabla} className="custom-button">
            Descargar PDF
          </Button>
        </Form>

        {loading ? (
          <div className="col-md-12 mt-3 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          data && (
            <DataTable
              id="tabla"
              className="tabla"
              columns={columnas}
              data={data}
              title=""
              pagination
              paginationComponentOptions={paginacionOpciones}
              fixedHeader
              fixedHeaderScrollHeight="600px"
              noDataComponent={<span>No hay datos disponibles</span>}
              striped
              highlightOnHover
              customStyles={{
                rows: {
                  style: {
                    backgroundColor: "#a8b5c1",
                    color: "#000",
                  },
                },
              }}
            />
          )
        )}
      </div>

      <Footer />
    </>
  );

};

export default Inicio;
