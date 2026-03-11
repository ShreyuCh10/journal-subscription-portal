import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button
} from "@mui/material";

import { getUserShipments } from "../../../Service/DispatchApi";

const TrackShipment = () => {

  const [shipments,setShipments] = useState([]);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {

    const res = await getUserShipments();

    setShipments(res.data);
  };

  const getStatusColor = (status) => {

    switch(status){

      case "PENDING":
        return "default";

      case "PACKED":
        return "warning";

      case "SHIPPED":
        return "info";

      case "DELIVERED":
        return "success";

      default:
        return "default";
    }
  };

  return (

    <Box sx={{px:4,py:4}}>

      <Typography variant="h4" mb={3}>
        My Shipments
      </Typography>

      <Card>

        <CardContent>

          <Table>

            <TableHead>

              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tracking</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dispatch Date</TableCell>
                <TableCell>Track</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {shipments.map((s)=>(

                <TableRow key={s.id}>

                  <TableCell>{s.id}</TableCell>

                  <TableCell>
                    {s.trackingNumber}
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={s.status}
                      color={getStatusColor(s.status)}
                      size="small"
                    />

                  </TableCell>

                  <TableCell>
                    {new Date(s.dispatchDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>

                    <Button
                      variant="contained"
                      size="small"
                      href={`https://www.delhivery.com/track/package/${s.trackingNumber}`}
                      target="_blank"
                    >
                      Track
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </Box>

  );
};

export default TrackShipment;