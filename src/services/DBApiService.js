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
