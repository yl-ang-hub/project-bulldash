import { fullCoinList } from "../../data/fullCoinListing";

// export const readDB = async () => {};

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

export const buildRecords = () => {
  const coinList = fullCoinList.map((record) => {
    delete record.platforms;
    return { fields: record };
  });
  const records = { records: coinList, typecast: true };
  console.log(records);
  return records;
};
