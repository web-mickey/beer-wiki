import SportsBar from "@mui/icons-material/SportsBar";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { SimplePagination } from "../../components/SimplePagination";
import { Beer } from "../../types";
import { fetchData } from "../../utils/api";
import { sortArray } from "../../utils/array";

const BeerList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: beerList, isLoading } = useQuery<Beer[]>(
    ["beerList", page],
    () => fetchData(`breweries?page=${page}&per_page=20`)
  );

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  const sortedBeerList = beerList?.length ? sortArray(beerList, "name") : [];

  return (
    <article>
      <section>
        <header>
          <h1>BeerList page</h1>
        </header>
        {isLoading ? (
          <Loader />
        ) : (
          <main>
            {sortedBeerList?.length ? (
              <>
                <List>
                  {sortedBeerList.map((beer) => (
                    <ListItemButton
                      key={beer.id}
                      onClick={onBeerClick.bind(this, beer.id)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <SportsBar />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${beer.name} (${beer.brewery_type})`}
                        secondary={`${beer.state_province} - ${beer.city}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
                <SimplePagination
                  page={page}
                  nextButtonDisabled={sortedBeerList?.length < 20}
                  setPage={setPage}
                />
              </>
            ) : (
              <h1>No data</h1>
            )}
          </main>
        )}
      </section>
    </article>
  );
};

export default BeerList;
