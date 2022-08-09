import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "./Loading";
import List from "./List";
import { DeepCopy, distance, GAS_TYPES } from "../Helpers/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

const MapPage = () => {
  const [
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
  const [listWPrices, setListWPrices] = useState([]);
  const [sortType, setSortType] = useState("dist-asc");
  const [sortedList, setSortedList] = useState([]);
  const [clicked, setClicked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchedLoc, setSearchedLoc] = useState();
  const mainHeight = window.innerHeight - 140;

  useEffect(() => {
    const listCopy = DeepCopy(listInfo);
    const getPrices = async () => {
      for (let i = 0; i < listCopy.length; i++) {
        const data = await fetchPrices(listCopy[i].place_id);
        if (data.success && !data.no_prices) {
          listCopy[i].prices = data.message;
        } else {
          listCopy[i].prices = DeepCopy(GAS_TYPES);
        }
      }
      return;
    };
    const setPrices = async () => {
      await getPrices();
      setListWPrices(listCopy);
    };
    setPrices();
  }, [listInfo, priceReload]);

  useEffect(() => {
    const sortCopy = DeepCopy(listWPrices);
    if (sortType === "dist-desc") {
      setSortedList(sortCopy.sort((a, b) => b.dist - a.dist));
      // } else if(sortType === 'price-asc'){
      //     setSortedList(sortCopy.sort((a, b) => b.dist - a.dist));
      // } else if (sortType === 'price-desc'){
    } else setSortedList(sortCopy.sort((a, b) => a.dist - b.dist));
  }, [listWPrices, sortType]);

  return (
    <div className="main map-container">
      {isLoading && <Loading />}
      <div className="map-search-div">
        {!isLoading && <MapSearch setSearchedLoc={setSearchedLoc} />}
        <Map
          clicked={clicked}
          setClicked={setClicked}
          setListInfo={setListInfo}
          searchedLoc={searchedLoc}
        />
      </div>
      <div id="list" style={{ maxHeight: mainHeight }}>
        {!isLoading && (
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="dist-asc">Distance ↑</option>
            <option value="dist-desc">Distance ↓</option>
            {/* <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option> */}
          </select>
        )}
        {sortedList.length > 0 &&
          sortedList.map((item) => {
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

const Map = ({ clicked, setClicked, setListInfo, searchedLoc }) => {
  const ref = useRef();
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
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
    const { place_id, name, vicinity, geometry } = place;

    const dist = distance(
      center.lat,
      center.lng,
      geometry.location.lat(),
      geometry.location.lng(),
      "M"
    );

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
    return { place_id, name, vicinity, dist };
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
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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
  }, [map, center]);

  useEffect(() => {
    const selected = markers.find((marker) => marker.title === clicked);
    if (selected) window.google.maps.event.trigger(selected, "click");
  }, [clicked]);

  useEffect(() => {
    if (map && searchedLoc) {
      setCenter(searchedLoc);
      map.setCenter(searchedLoc);
    }
  }, [searchedLoc]);

  return <div ref={ref} id="map" />;
};

const MapSearch = ({ setSearchedLoc }) => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLocation = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setSearchedLoc(initialLocation);
        }
        // () =>
        //   setCenter({
        //     lat: 40.8859,
        //     lng: -74.0435,
        //   })
      );
    }
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", async () => {
      const place = await autoCompleteRef.current.getPlace();
      console.log(place.geometry.location);
      setSearchedLoc(place.geometry.location);
    });
  }, []);

  return (
    <div className="search">
      <input ref={inputRef} />
      <div className="loc-btn" title="Current Location">
        <FontAwesomeIcon
          onClick={() => getCurrentLocation()}
          icon={faLocationArrow}
        />
      </div>
    </div>
  );
};

export default MapPage;
