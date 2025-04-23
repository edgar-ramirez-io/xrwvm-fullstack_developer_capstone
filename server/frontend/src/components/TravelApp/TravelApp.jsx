import { sortPlacesByDistance } from "./loc.js";
import { AVAILABLE_PLACES } from "./data.js";
import { useCallback, useEffect, useRef, useState } from "react";
import Places from "./Places.jsx";
import "./travel.css";
import logoImg from "./assets/logo.png";
import Modal from "./Modal.jsx";
import DeleteConfirmation from "./DeleteConfirmation.jsx";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) => {
  const place = AVAILABLE_PLACES.find((place) => place.id === id) || [];
  return place;
});

function TravelApp() {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();

  useEffect(() => {
    setTimeout(
      // FIXME: navigator.geolocation.getCurrentPosition doesn't work in Chrome
      () => {
        const sortedPlaces = sortPlacesByDistance(
          AVAILABLE_PLACES,
          41.881832, // position.coords.latitude,
          -87.623177 // position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
        console.log({ sortedPlaces }, "useEffect - getCurrentPosition");
      },
      500
    );
  }, []);

  console.log({ availablePlaces }, "rendered");

  const onClickHandler = (id) => {
    setPickedPlaces((oldValue) => {
      if (oldValue.some((place) => place.id === id)) {
        return oldValue;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...oldValue];
    });
    const selectedPlace = AVAILABLE_PLACES.find((place) => place.id === id);

    const placeId = selectedPlace?.id;

    if (placeId === undefined) {
      return;
    }

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(placeId) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([placeId, ...storedIds])
      );
    }
  };

  const confirmDeletePlaceClickHandler = (id) => {
    setModalIsOpen(true);
    selectedPlace.current = id;
  };

  const deletePlaceClickHandler = useCallback(() => {
    setPickedPlaces((old) => {
      return old.filter((place) => place.id !== selectedPlace.current);
    });

    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    const updatedStoreIds = storedIds.filter(
      (place) => place !== selectedPlace.current
    );
    localStorage.setItem("selectedPlaces", JSON.stringify(updatedStoreIds));
  }, []);

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={() => {
            setModalIsOpen(false);
          }}
          onConfirm={() => {
            deletePlaceClickHandler();
          }}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          places={pickedPlaces}
          fallbackText="Pick places where you'd like to go!"
          onSelectPlace={confirmDeletePlaceClickHandler}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Fetching nearby places..."
          onSelectPlace={onClickHandler}
        />
      </main>
    </>
  );
}

export default TravelApp;
