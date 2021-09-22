// local storage for the addresses

/* ---------------- ADDRESSES ------------------*/
// return the addresses data from the local storage
export const getAddresses = () => {
  const addresses = localStorage.getItem('addresses');
  if (addresses) return JSON.parse(addresses);
  return null;
};
// remove the token and addresses from the local storage
export const removeAddresses = () => {
  localStorage.removeItem('addresses');
};

// set the token and addresses from the local storage
export const setAddresses = (addresses) => {
  localStorage.setItem('addresses', JSON.stringify(addresses));
};