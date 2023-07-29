import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { SimplePagination } from "../../components/SimplePagination";
import { Beer, SortByOption } from "../../types";
import { encodeStringForSorting } from "../../utils";
import { fetchData } from "../../utils/api";
import { sortArray } from "../../utils/array";
import styles from "./Home.module.css";

const sortByOptions = [
  { value: "by_city", label: "City" },
  { value: "by_country", label: "Country" },
  { value: "by_name", label: "Name" },
  { value: "by_postal", label: "Postal Code" },
  { value: "by_state", label: "State" },
  { value: "by_type", label: "Type" },
];

const Home = () => {
  const [favourites, setFavourites] = useState<Array<Beer>>([]);
  const [searchString, setSearchString] = useState("");
  const [sortType, setSortType] = useState<SortByOption>("by_name");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const savedBeers = JSON.parse(
      localStorage.getItem("favourites") || "[]"
    ) as Beer[];
    setFavourites(savedBeers);
  }, []);

  const {
    data: beerList,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Beer[]>(["filteredBeerList", page], () =>
    fetchData("breweries", {
      [sortType]: encodeStringForSorting(searchString),
      per_page: 20,
      page,
    })
  );

  const handleOnCheckboxClick = (beer: Beer) => {
    const isFavourite = favourites.find(
      (favouriteBeer) => favouriteBeer.id === beer.id
    );
    let newFavouriteList = [];

    if (isFavourite) {
      newFavouriteList = favourites.filter(
        (favouriteBeer) => favouriteBeer.id !== beer.id
      );
    } else {
      newFavouriteList = [...favourites, beer];
    }

    setFavourites(newFavouriteList);
    localStorage.setItem("favourites", JSON.stringify(newFavouriteList));
  };

  const clearFavourites = () => {
    setFavourites([]);
    localStorage.setItem("favourites", JSON.stringify([]));
  };

  const sortedBeerList = beerList ? sortArray(beerList, "name") : [];
  const sortedFavourites = sortArray(favourites, "name");

  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <TextField
                  label="Filter"
                  variant="outlined"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <FormControl>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    value={sortType}
                    label="Sort Type"
                    onChange={(event) =>
                      setSortType(event.target.value as SortByOption)
                    }
                  >
                    {sortByOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPage(1);
                    refetch();
                  }}
                >
                  Reload list
                </Button>
              </div>
              {isLoading || isRefetching ? (
                <Loader />
              ) : sortedBeerList?.length ? (
                <>
                  <ul className={styles.list}>
                    {sortedBeerList.map((beer, index) => (
                      <li key={index.toString()}>
                        <Checkbox
                          checked={
                            !!favourites?.find(
                              (savedBeer) => savedBeer.id === beer.id
                            )
                          }
                          onChange={() => handleOnCheckboxClick(beer)}
                        />
                        <Link component={RouterLink} to={`/beer/${beer.id}`}>
                          {beer.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <SimplePagination
                    page={page}
                    setPage={setPage}
                    nextButtonDisabled={sortedBeerList?.length < 20}
                  />
                </>
              ) : (
                <Grid
                  container
                  justifyContent="center"
                  minHeight={500}
                  alignItems="center"
                >
                  <p className={styles.noBeersFoundMessage}>
                    No beers found for that filter
                  </p>
                </Grid>
              )}
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                {sortedFavourites.length > 0 && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={clearFavourites}
                  >
                    Remove all items
                  </Button>
                )}
              </div>
              <ul className={styles.list}>
                {sortedFavourites.map((beer, index) => (
                  <li key={index.toString()}>
                    <Checkbox
                      checked={
                        !!sortedFavourites?.find(
                          (savedBeer) => savedBeer.id === beer.id
                        )
                      }
                      onChange={() => handleOnCheckboxClick(beer)}
                    />
                    <Link component={RouterLink} to={`/beer/${beer.id}`}>
                      {beer.name}
                    </Link>
                  </li>
                ))}
                {!sortedFavourites.length && <p>No saved items</p>}
              </ul>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
