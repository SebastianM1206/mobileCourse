const API_KEY = "a794fed86afb4024b94c4a5ebb101177";

export const getAddress = async (lat: number, lng: number) => {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`);
  const data = await response.json();
  return data;
};