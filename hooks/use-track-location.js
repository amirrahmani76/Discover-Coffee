import { useContext, useState } from 'react';

import { ACTION_TYPES, StoreContext } from '../store/store-context';

const useTracklocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  // const [latLong, setLatLong] = useState('');
  const [isFindingLocation, setIsFindingLocaton] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${longitude},${latitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${longitude},${latitude}` },
    });
    setLocationErrorMsg('');
    setIsFindingLocaton(false);
  };

  const error = () => {
    setIsFindingLocaton(false);
    setLocationErrorMsg('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsFindingLocaton(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
      setIsFindingLocaton(false);
    } else {
      //   status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTracklocation;
