import axios from "axios";
import { API } from "../api/config";
import { ApiParams } from "../types";

const fetchData = (url: string, params?: ApiParams) =>
  axios.get(`${API}${url}/`, { params }).then((response) => response.data);

export { fetchData };
