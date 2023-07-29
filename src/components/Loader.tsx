import { CircularProgress, Grid } from "@mui/material";

export const Loader = () => {
  return (
    <Grid container justifyContent="center" minHeight={500} alignItems="center">
      <CircularProgress />
    </Grid>
  );
};
