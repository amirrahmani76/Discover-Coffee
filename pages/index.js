/* eslint-disable react/jsx-key */
import Head from 'next/head';
import Banner from '../components/banner';
import styles from '../styles/Home.module.css';

import Image from 'next/image';
import Card from '../components/card';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      // coffeeStores: coffeeStores,
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setcoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (latLong) {
      try {
        const response = await fetch(
          `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
        );

        const coffeeStores = await response.json();

        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: { coffeeStores },
        });
        setcoffeeStoresError('');
      } catch (error) {
        console.log({ error });
        setcoffeeStoresError(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Somting went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Somting went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="Coffee"
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me </h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.place_id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://picsum.photos/200/300?random=1'
                    }
                    href={`/coffee-store/${coffeeStore.place_id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.place_id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://picsum.photos/200/300?random=1'
                    }
                    href={`/coffee-store/${coffeeStore.place_id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
