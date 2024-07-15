import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoIntendencia from "../../img/LOGO.png";
import axios from "axios";
import NavBar from "../../components/navbar/NavBar";
import DataTable from "react-data-table-component";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./inicio.css";
import Footer from "../../components/footer/Footer";
import jsPDF from "jspdf";

const url = "http://control.horario.ic.gub.uy/api/reporte";
let token = sessionStorage.getItem("token")

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
};

const Inicio = () => {
  const [data, setData] = useState(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  let user = JSON.parse(sessionStorage.getItem("user"));
 
  useEffect(() => {
    obtenerFechasPorDefecto();
    if (desde && hasta) {
      fetchData();
    }
  }, [desde, hasta]);

  const obtenerFechasPorDefecto = async () => {
    if (!desde || !hasta) {
      const fechaActual = new Date();
      const primerDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const fechaActualISO = fechaActual.toISOString().split("T")[0];

      setDesde(primerDiaDelMes);
      setHasta(fechaActualISO);
    }

    await fetchData();
  };

  const fetchData = async () => {
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
      
      if(response.data.registros_ok){
        registros = response.data.registros_ok[user.fk_empleado_codigo];
      }

      setData(registros);
    } catch (error) {
      console.log(error);
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


  const generateColumns = (data) => {
    return Object.keys(data[0])
      .filter((key, index) => !columnsToSkip.includes(index))
      .map((key) => ({
        name: columnNames[key] || key,
        selector: (row) => row[key],
      }));
  };
  
  const generarPDF = () => {
    if (!data) {
      return;
    }
  
    const doc = new jsPDF();
  
    let startX = 10;
    let startY = 20;
  
    const cellHeight = 10;
    const minRowsPerPage = 20; // Número mínimo de filas por página
  
    let currentY = startY;
  
    const columnsToSkip = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]; // Columnas a omitir
  
    const columnNames = {
      registro_fecha: "Fecha",
      entrada: "Entrada",
      salida: "Salida",
    };
  
    const visibleColumns = generateColumns(data);
    const columnKeys = visibleColumns.map((col) => col.name);
  
    const title = "Reporte usuario: " + quitarPrefijoFicha(user.fk_empleado_codigo); // Título del PDF
  
    const monthsInSpanish = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
  
    const now = new Date();
    const month = now.getMonth();
    const spanishMonth = monthsInSpanish[month];
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
  
    // Agregar título
    doc.setFontSize(16);
    doc.text(title, startX, currentY);
  
    // Agregar imagen en el lado opuesto
    const imageWidth = 75; // Ancho de la imagen
    const imageHeight = 20; // Alto de la imagen
    const imageX = doc.internal.pageSize.width - imageWidth - startX;
    doc.addImage(logoIntendencia, "JPEG", imageX, currentY - 10, imageWidth, imageHeight);
  
    currentY += 20; // Espacio después del título
  
    // Agregar encabezados de columna con mejor formato (omitir columnas)
    visibleColumns.forEach((column, index) => {
      const columnWidth = (doc.internal.pageSize.width - 20) / visibleColumns.length;
      const cellX = startX + index * columnWidth;
      doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
      doc.text(column.name, cellX + columnWidth / 2, currentY + cellHeight / 2, {
        align: "center",
        valign: "middle",
      });
    });
  
    currentY += cellHeight;
    let rowsAdded = 0;
  
    // Agregar filas de datos (omitir columnas)
    data.forEach((row) => {
      if (rowsAdded >= minRowsPerPage) {
        doc.addPage();
        currentY = startY;
        rowsAdded = 0;
  
        // Agregar encabezados de columna nuevamente en la nueva página
        visibleColumns.forEach((column, index) => {
          const columnWidth = (doc.internal.pageSize.width - 20) / visibleColumns.length;
          const cellX = startX + index * columnWidth;
          doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
          doc.text(column.name, cellX + columnWidth / 2, currentY + cellHeight / 2, {
            align: "center",
            valign: "middle",
          });
        });
  
        currentY += cellHeight;
      }
  
      visibleColumns.forEach((column, columnIndex) => {
        const value = column.selector(row);
        const columnWidth = (doc.internal.pageSize.width - 20) / visibleColumns.length;
        const cellX = startX + columnIndex * columnWidth;
        doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
  
        // Formatear la fecha antes de agregarla al PDF (inversión)
        if (column.name === "Fecha") {
          const dateParts = value.split("-");
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          doc.text(formattedDate, cellX + columnWidth / 2, currentY + cellHeight / 2, {
            align: "center",
            valign: "middle",
          });
        } else {
          doc.text(value.toString(), cellX + columnWidth / 2, currentY + cellHeight / 2, {
            align: "center",
            valign: "middle",
          });
        }
      });
  
      currentY += cellHeight;
      rowsAdded += 1;
    });
  
    // Guardar el PDF como archivo descargable
    doc.save("Reporte_" + quitarPrefijoFicha(user.fk_empleado_codigo) + ".pdf");
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

        {/* <Form onSubmit={handleSubmit}> */}

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

          <Button
            variant="primary"
            onClick={generarPDF}
            className="custom-button"
          >
            Descargar PDF
          </Button>
        </Form>

        {data && (
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
        )}
      </div>

      <Footer />
    </>
  );
};

export default Inicio;
