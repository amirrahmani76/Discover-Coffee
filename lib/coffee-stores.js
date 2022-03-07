// initialize unsplash api
import { createApi } from 'unsplash-js';

// // on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (categories, latlong, limit) => {
  return `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${latlong},5000&bias=proximity:${latlong}&limit=${limit}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_APIKEY}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async (
  latLong = '-79.3920971,43.6490449',
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores('catering.cafe', latLong, limit)
  );
  const data = await response.json();
  return data.features
    .map((feature) => feature.properties)
    .map((feature, idx) => {
      return {
        ...feature,
        imgUrl: photos[idx],
      };
    });
};
