import { Grid } from "@mui/material";
import Link from "@mui/material/Link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Loader } from "../../components/Loader";
import { Beer as IBeer } from "../../types";
import { fetchData } from "../../utils/api";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/north-america.json";

const Beer = () => {
  const { id } = useParams();

  const {
    data: beer,
    isLoading,
    isRefetching,
  } = useQuery<IBeer>(["beer", id], () => fetchData(`breweries/${id}`));

  return (
    <article>
      <section>
        {isLoading || isRefetching ? (
          <Loader />
        ) : (
          <>
            {beer ? (
              <>
                <header>
                  <h1>{beer?.name}</h1>
                </header>
                <main>
                  <Grid container direction="column">
                    <Grid item>
                      <b>Type: </b> {beer?.brewery_type}
                    </Grid>
                    <Grid item>
                      <b>Phone: </b>{" "}
                      {beer?.phone ? (
                        <Link
                          type="number"
                          href={`tel:${beer.phone}`}
                          target="_blank"
                        >
                          {beer.phone}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </Grid>{" "}
                    <Grid item>
                      <b>Website: </b>{" "}
                      {beer?.website_url ? (
                        <Link href={beer.website_url} target="_blank">
                          {beer.website_url}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </Grid>
                    <Grid item>
                      <b>Country: </b> {beer?.country}
                    </Grid>
                    <Grid item>
                      <b>State: </b> {beer?.state_province}
                    </Grid>
                    <Grid item>
                      <b>City: </b> {beer?.city}
                    </Grid>
                    <Grid item>
                      <b>Street: </b> {beer?.street}
                    </Grid>
                  </Grid>

                  {beer?.longitude && beer?.latitude && (
                    <Grid maxWidth="1000px" maxHeight="500px">
                      <ComposableMap
                        projection="geoAzimuthalEqualArea"
                        projectionConfig={{
                          scale: 150,
                        }}
                        style={{
                          maxWidth: "80%",
                          maxHeight: "80%",
                        }}
                      >
                        <Geographies geography={geoUrl}>
                          {({ geographies }) =>
                            geographies.map((geo) => (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#EAEAEC"
                                stroke="#D6D6DA"
                              />
                            ))
                          }
                        </Geographies>
                        <Marker
                          coordinates={[
                            Number(beer?.longitude),
                            Number(beer?.latitude),
                          ]}
                        >
                          <circle
                            r={10}
                            fill="#F00"
                            stroke="#fff"
                            strokeWidth={2}
                          />
                          <text textAnchor="middle">{beer.city}</text>
                        </Marker>
                      </ComposableMap>
                    </Grid>
                  )}
                </main>
              </>
            ) : (
              "No data"
            )}
          </>
        )}
      </section>
    </article>
  );
};

export default Beer;
