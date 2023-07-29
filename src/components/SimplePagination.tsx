import { Button, Grid } from "@mui/material";

interface SimplePaginationProps {
  page: number;
  nextButtonDisabled: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const SimplePagination = (props: SimplePaginationProps) => {
  const { page, nextButtonDisabled, setPage } = props;
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <Button
          onClick={() => setPage((page) => page - 1)}
          disabled={page === 1}
        >
          Prev
        </Button>
      </Grid>

      <Grid item>{page}</Grid>
      <Grid item>
        <Button
          onClick={() => setPage((page) => page + 1)}
          disabled={nextButtonDisabled}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};
