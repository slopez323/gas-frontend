import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "./Loading";
import List from "./List";

const MapPage = () => {
  const [
    userId,
    username,
    favorites,
    setUpdateUserData,
    addToFav,
    removeFav,
    updatePrice,
    priceReload,
    fetchPrices,
    priceToUpdate,
    setPriceToUpdate,
  ] = useOutletContext();
  const [listInfo, setListInfo] = useState([]);
  const [clicked, setClicked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const mainHeight = window.innerHeight - 100;

  return (
    <div className="main map-container">
      {isLoading && <Loading />}
      {/* <Map
        setListInfo={setListInfo}
        clicked={clicked}
        setClicked={setClicked}
        setIsLoading={setIsLoading}
      /> */}
      <div id="list" style={{ maxHeight: mainHeight }}>
        {listInfo.map((item) => {
          return (
            <List
              item={item}
              clicked={clicked}
              setClicked={setClicked}
              username={username}
              favorites={favorites}
              setUpdateUserData={setUpdateUserData}
              addToFav={addToFav}
              removeFav={removeFav}
              updatePrice={updatePrice}
              priceReload={priceReload}
              fetchPrices={fetchPrices}
              priceToUpdate={priceToUpdate}
              setPriceToUpdate={setPriceToUpdate}
              setIsLoading={setIsLoading}
              key={item.place_id}
            />
          );
        })}
      </div>
    </div>
  );
};

const Map = ({ setListInfo, clicked, setClicked, setIsLoading }) => {
  const ref = useRef();
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  //   const [listInfo, setListInfo] = useState([]);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState();

  const onIdle = (m) => {
    // console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  const createMarker = async (place) => {
    const marker = new window.google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.place_id,
    });
    return marker;
  };

  const createInfoWindow = (place, marker, infowindow) => {
    const { place_id, name, vicinity } = place;

    window.google.maps.event.addListener(marker, "click", () => {
      const contentString = `<div>${name}</div><div>${vicinity}</div>`;
      infowindow.setContent(contentString);
      infowindow.open({
        anchor: marker,
        // map,
        shouldFocus: false,
      });
      setClicked(place_id);
    });
    return { place_id, name, vicinity };
  };

  const deleteMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLocation = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setCenter(initialLocation);
        },
        () =>
          setCenter({
            lat: 40.8859,
            lng: -74.0435,
          })
      );
    } else
      setCenter({
        lat: 40.8859,
        lng: -74.0435,
      });
  }, []);

  useEffect(() => {
    if (ref.current && !map && center) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map, center]);

  useEffect(() => {
    if (map) {
      window.google.maps.event.clearListeners(map, "idle");

      if (onIdle) map.addListener("idle", () => onIdle(map));
    }
  }, [map]);

  useEffect(() => {
    deleteMarkers();

    const request = {
      type: "gas_station",
      location: center,
      radius: "10000",
    };
    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, async function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newMarkers = [];
        const newInfo = [];
        const infowindow = new window.google.maps.InfoWindow({
          disableAutoPan: true,
        });
        for (let i = 0; i < results.length; i++) {
          if (results[i].business_status === "OPERATIONAL") {
            const newMarker = await createMarker(results[i]);
            newMarkers.push(newMarker);

            const newInfoItem = createInfoWindow(
              results[i],
              newMarker,
              infowindow
            );
            newInfo.push(newInfoItem);
          }
        }
        setMarkers(newMarkers);
        setListInfo(newInfo);
        //   map.setCenter(results[0].geometry.location);
      }
    });
  }, [center]);

  useEffect(() => {
    const selected = markers.find((marker) => marker.title === clicked);
    if (selected) window.google.maps.event.trigger(selected, "click");
  }, [clicked]);

  return <div ref={ref} id="map" />;
};

export default MapPage;
