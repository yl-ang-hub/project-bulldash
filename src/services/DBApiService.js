import { queryOptions } from "@tanstack/react-query";
import { fullCoinList } from "../data/fullCoinListing";

// FETCH FUNCTIONS

export const readDB = async (endpoint, args) => {
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
    console.log(res);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createDB = async (records) => {
  try {
    const res = await fetch(
      import.meta.env.VITE_AIRTABLE_API + "GeckoFullCoinList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
        },
        body: records,
      }
    );
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

/// QUERYOPTIONS

export const readCoinsFromDBQueryOptions = () => {
  const endpoint = "CoinsPortfolioDB" + "?maxRecords=100&view=Grid%20view";
  return queryOptions({
    queryKey: ["readCoinsFromDB"],
    queryFn: () => readDB(endpoint),
    retry: 1,
  });
};

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
