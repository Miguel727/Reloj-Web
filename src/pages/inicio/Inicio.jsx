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
import printJS from "print-js";

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

        // Invertir el orden de los datos
        registros = registros.reverse();


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

 
  const generarPDF = () => {
    if (!data) {
      return;
    }

    const doc = new jsPDF();

    let startX = 10;
    let startY = 20;

    const cellHeight = 10;
    const minRowsPerPage = 20;

    let currentY = startY;

    const headers = Object.keys(data[0]);
    const columnsToSkip = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13];

    const columnNames = {
      registro_fecha: "Fecha",
      entrada: "Entrada",
      salida: "Salida",
    };

    const title =
      "Reporte usuario: " + quitarPrefijoFicha(user.fk_empleado_codigo);

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

    currentY += 20;

    doc.setFontSize(14);
    currentY += 15;

    headers.forEach((header, index) => {
      if (!columnsToSkip.includes(index)) {
        const columnName = columnNames[header] || header;
        const columnWidth =
          (doc.internal.pageSize.width - 20) /
          (headers.length - columnsToSkip.length);
        const cellX =
          startX +
          (index - columnsToSkip.filter((col) => col < index).length) *
            columnWidth;
        doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
        doc.text(
          columnName,
          cellX + columnWidth / 2,
          currentY + cellHeight / 2,
          {
            align: "center",
            valign: "middle",
          }
        );
      }
    });

    currentY += cellHeight;

    let rowsAdded = 0;

    data.forEach((row) => {
      if (rowsAdded >= minRowsPerPage) {
        doc.addPage();
        currentY = startY;
        rowsAdded = 0;

        headers.forEach((header, index) => {
          if (!columnsToSkip.includes(index)) {
            const columnName = columnNames[header] || header;
            const columnWidth =
              (doc.internal.pageSize.width - 20) /
              (headers.length - columnsToSkip.length);
            const cellX =
              startX +
              (index - columnsToSkip.filter((col) => col < index).length) *
                columnWidth;
            doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
            doc.text(
              columnName,
              cellX + columnWidth / 2,
              currentY + cellHeight / 2,
              {
                align: "center",
                valign: "middle",
              }
            );
          }
        });

        currentY += cellHeight;
      }

      const values = Object.values(row);
      values.forEach((value, columnIndex) => {
        if (!columnsToSkip.includes(columnIndex)) {
          const columnWidth =
            (doc.internal.pageSize.width - 20) /
            (headers.length - columnsToSkip.length);
          const cellX =
            startX +
            (columnIndex -
              columnsToSkip.filter((col) => col < columnIndex).length) *
              columnWidth;
          doc.rect(cellX, currentY, columnWidth, cellHeight, "S");
          if (headers[columnIndex] === "registro_fecha") {
            const dateParts = value.split("-");
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            doc.text(
              formattedDate,
              cellX + columnWidth / 2,
              currentY + cellHeight / 2,
              {
                align: "center",
                valign: "middle",
              }
            );
          } else {
            doc.text(
              value.toString(),
              cellX + columnWidth / 2,
              currentY + cellHeight / 2,
              { align: "center", valign: "middle" }
            );
          }
        }
      });

      currentY += cellHeight;
      rowsAdded += 1;
    });

    doc.save("Reporte_" + quitarPrefijoFicha(user.fk_empleado_codigo) + ".pdf");
  };


  const imprimirTabla = () => {
    if (!data) {
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Fecha", "Entrada", "Salida"];
    const tableRows = [];

    data.forEach(row => {
      const rowData = [
        row.registro_fecha.split('-').reverse().join('-'),
        row.entrada,
        row.salida,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    doc.text(`Reporte usuario: ${quitarPrefijoFicha(user.fk_empleado_codigo)}`, 14, 15);
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
          <Button variant="primary" onClick={imprimirTabla} className="custom-button">
  Imprimir Tabla
</Button>
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
