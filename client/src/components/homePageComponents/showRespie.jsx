import React from "react";
import { Fade } from "react-awesome-reveal";
import DataTable from "react-data-table-component";

function ShowRespie() {
  const columns = [
    {
      name: "Nombre",
      selector : (row) => row.name
    },
    {
      name: "Descripcion",
      selector : (row) => row.descripcion
    },
    {
      name: "Cantidad plato",
      selector : (row) => row.cantida_plato
    },
    {
      name: "Activo",
      selector : (row) => row.activo
    },{
      name: "Creacion",
      selector : (row) => row.creacion
    },{
      name: "Desactivar",
      selector : (row) => row.name,
      cell: (row) => <button>desactivar</button>
    },{
      name: "Editar",
      selector : (row) => row.name,
      cell: (row) => <button>Editar</button>
    }
  ];

  const data = [
    {
      name: "arroz con huevo",
      descripcion: "arrozonasdjsabjydvsadvsadva",
      cantida_plato: "5",
      activo: "si",
      creacion: "45/1as"

    },
  ];

  return (
    <Fade>
      <section className="modal-show-respie">
        <section className="section-show-respie">
          <header></header>
          <div>
            <DataTable
              title="Restaurantes"
              columns={columns}
              data={data}
              pagination
              responsive
              expandOnRowClicked
              expandableRows
              highlightOnHover
              pointerOnHover
              subHeader
              // subHeaderComponent={subHeaderComponent}
              // progressPending={pending}
              // expandableRowExpanded={(row) => row === currentRow}
              // expandableRowsComponent={(row) => expandableComponent(row)}
              // onRowClicked={onRowClicked}
            />
          </div>
          <footer></footer>
        </section>
      </section>
    </Fade>
  );
}

export default ShowRespie;
