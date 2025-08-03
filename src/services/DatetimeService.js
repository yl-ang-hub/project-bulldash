export const getDate = (epochTime) => {
  const dateObject = new Date(epochTime);
  return dateObject.toLocaleDateString();
};
