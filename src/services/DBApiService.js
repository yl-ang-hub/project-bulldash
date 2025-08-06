import { queryOptions } from "@tanstack/react-query";
import { fullCoinList } from "../data/fullCoinListing";

// FETCH FUNCTIONS

export const readDB = async (endpoint, args) => {
  console.log("readDB is running");
  const defaultArgs = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
    },
  };
  const finalArgs = args || defaultArgs;
  try {
    const res = await fetch(
      import.meta.env.VITE_AIRTABLE_API + endpoint,
      finalArgs
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createDB = async (records) => {
  try {
    const res = await fetch(import.meta.env.VITE_AIRTABLE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
      },
      body: JSON.stringify(records),
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

/// QUERYOPTIONS - DATABASE

const readCoinsFromPortfolioDBQueryOptions = () => {
  const endpoint = "CoinsPortfolioDB" + "?maxRecords=100&view=Grid%20view";
  return queryOptions({
    queryKey: ["readCoinsFromPortfolioDB"],
    queryFn: () => readDB(endpoint),
    retry: 1,
  });
};

// export const readStocksFromPortfolioDBQueryOptions = () => {
//   const endpoint = "StocksPortfolioDB" + "?maxRecords=100&view=Grid%20view";
//   return queryOptions({
//     queryKey: ["readStocksFromPortfolioDB"],
//     queryFn: () => readDB(endpoint),
//     retry: 1,
//   });
// };

// TEMPORARY DEV FUNCTIONS TO PULL FROM STORED VARIABLES
// REDUCE API CALLS

export const buildRecordsFromJS = () => {
  const coinList = fullCoinList.map((record) => {
    delete record.platforms;
    return { fields: record };
  });
  const records = { records: coinList, typecast: true };
  console.log(records);
  return records;
};
