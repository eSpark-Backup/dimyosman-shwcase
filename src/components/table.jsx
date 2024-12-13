import {
  Box,
  LinearProgress,
  Table as MUITable,
  Pagination,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getValue } from "../utils";
import { useRef, useState } from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';

export const DynamicTable = ({ data, columns, isLoading, page, handlePageChange, total, ...rest }) => {
  const tableRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const extendedColumns = columns?.map((column) => {
    return { ...column, key: column.key.split(".") };
  });

  const generateCell = (column, item) => {
    const cell = column.component
      ? column.component(item)
      : getValue(item, column.key);

    return cell;
  };

  if (data.length === 0 && !isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>no data</div>
    );
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <TableContainer
        {...rest}
        className="table"
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <PerfectScrollbar options={{ suppressScrollX: false, suppressScrollY: true }}>
          <MUITable sx={{ minWidth: 650, borderCollapse: "separate" }}>
            <TableHead>
              <TableRow>
                {extendedColumns?.map((column, index) => (
                  <TableCell
                    key={`${index}`}
                    sx={{
                      // width: column.width || "initial",
                      // minWidth: column.minWidth || "initial",
                      position:
                        index === 0 || index === extendedColumns.length - 1
                          ? { xs: "static", lg: "sticky" }
                          : "static",
                      left: index === 0 ? 0 : undefined,
                      right:
                        index === extendedColumns.length - 1 ? 0 : undefined,
                      borderRight: (theme) =>
                        index === 0 ? theme.palette.border.primary : "0",
                      borderLeft: (theme) =>
                        index === extendedColumns.length - 1
                          ? theme.palette.border.primary
                          : "0",
                      background:
                        index === 0 || index === extendedColumns.length - 1
                          ? "#edf1ef"
                          : "#f6f8f7",
                      zIndex:
                        index === 0 || index === extendedColumns.length - 1
                          ? 2
                          : 1,
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={
                        column.key[0] === "action"
                          ? "flex-start"
                          : "space-between"
                      }
                    >
                      {column.name}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {!isLoading && (
              <TableBody>
                {data?.map((item) => (
                  <TableRow hover key={item.id}>
                    {extendedColumns?.map((column, index) => (
                      <TableCell
                        key={column.key.join(".")}
                        sx={{
                          position:
                            index === 0 || index === extendedColumns.length - 1
                              ? { xs: "static", lg: "sticky" }
                              : "static",
                          left: index === 0 ? 0 : undefined,
                          right:
                            index === extendedColumns.length - 1
                              ? 0
                              : undefined,
                          borderRight: (theme) =>
                            index === 0 ? theme.palette.border.primary : "0",
                          borderLeft: (theme) =>
                            index === extendedColumns.length - 1
                              ? theme.palette.border.primary
                              : "0",
                          minWidth:
                            index === 0
                              ?
                              "300px"
                              : index === extendedColumns.length - 1
                                ? "100px"
                                : "160px",
                          zIndex:
                            index === 0 || index === extendedColumns.length - 1
                              ? 2
                              : 1,
                          background: (theme) =>
                            theme.palette.primary.contrastText,
                          // wordBreak: { xs: "unset", lg: "break-word" }
                        }}
                      >
                        {generateCell(column, item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </MUITable>

          {isLoading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

        </PerfectScrollbar>

      </TableContainer>
      {
        data?.length >= 1 && !isLoading ? <Stack sx={{ marginTop: { xs: "20px", sm: "10px" } }} p={{ xs: 0, sm: 2 }} alignItems="center">
          <Pagination
            page={page}
            variant="outlined" shape="rounded" onChange={handlePageChange ? (_, page) => handlePageChange(page) : () => { }} count={Math.ceil((total || 1) / 7)} />
        </Stack> : data?.length >= 7 && !isLoading ? <Stack sx={{ marginTop: { xs: "20px", sm: "10px" } }} p={{ xs: 0, sm: 2 }} alignItems="center">
          <Pagination
            page={page}
            variant="outlined" shape="rounded" onChange={handlePageChange ? (_, page) => handlePageChange(page) : () => { }} count={Math.ceil((total || 1) / 7)} />
        </Stack> : null
      }
    </>
  );
};
