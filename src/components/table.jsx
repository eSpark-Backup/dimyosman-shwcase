import {
  Box,
  LinearProgress,
  Table as MUITable,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getValue } from "../utils";

export const DynamicTable = ({ data, columns, isLoading, ...rest }) => {
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

  return (
    <>
      <TableContainer {...rest} className="table">
        <PerfectScrollbar>
          <MUITable sx={{ minWidth: 650, borderCollapse: "separate" }}>
            <TableHead>
              <TableRow>
                {extendedColumns?.map((column, index) => (
                  <TableCell
                    key={`${index}`}
                    sx={{
                      width: column.width || "initial",
                      minWidth: column.minWidth || "initial",
                      position:
                        index === 0 || index === extendedColumns.length - 1
                          ? { xs: "static", md: "sticky" }
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
                              ? { xs: "static", md: "sticky" }
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
                              ? "300px"
                              : index === extendedColumns.length - 1
                              ? "100px"
                              : "150px",
                          zIndex:
                            index === 0 || index === extendedColumns.length - 1
                              ? 2
                              : 1,
                          background: (theme) =>
                            theme.palette.primary.contrastText,
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
    </>
  );
};
