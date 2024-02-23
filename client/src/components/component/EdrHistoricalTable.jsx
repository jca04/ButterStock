import React, { useEffect, useState } from 'react';
import { getAllEdr } from '../../api/edr';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Collapse, Box, TablePagination } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

const EdrHistoricalTable = ({ id_restaurant }) => {
  const [edrs, setEdrs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllEdr(id_restaurant);
      setEdrs(response.data.edrs);
    };
    fetchData();
  }, [id_restaurant]);

  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <p style={{
        textAlign: 'center',
        color: '#555',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '15px'
      }}>Historial de Estados de Resultados</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Total Ventas</TableCell>
              <TableCell>Total Costos</TableCell>
              <TableCell>Total otros gastos</TableCell>
              <TableCell>Utilidad</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {edrs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((estado, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>{new Date(estado.time_stamp).toLocaleDateString()}</TableCell>
                  <TableCell>${Number(estado.ventas).toLocaleString()}</TableCell>
                  <TableCell>${Number(estado.costos).toLocaleString()}</TableCell>
                  <TableCell>${Number(estado.otros_gastos_valor).toLocaleString()}</TableCell>
                  <TableCell>${Number(estado.utilidad).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleExpand(index)}
                      aria-expanded={expandedRow === index}
                      aria-label="expand row"
                    >
                      {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Otros Gastos
                        </Typography>
                        {estado.otros_gastos ? (
                          <ul>
                            {Object.entries(JSON.parse(estado.otros_gastos)).map(([tipoGasto, valorGasto]) => (
                              <li key={tipoGasto}>
                                {tipoGasto}: ${valorGasto}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography>No hay otros gastos</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[4, 10, 25]}
          component="div"
          count={edrs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default EdrHistoricalTable;
