import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
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
    setIsLoading,
  ] = useOutletContext();
  const [listInfo, setListInfo] = useState([]);
  const [listWPrices, setListWPrices] = useState([]);
  const [sortType, setSortType] = useState("dist-asc");
  const [sortedList, setSortedList] = useState([]);
  const [clicked, setClicked] = useState();
  const [searchedLoc, setSearchedLoc] = useState();

  const getPrices = async () => {
    const listCopy = DeepCopy(listInfo);
    for (let i = 0; i < listCopy.length; i++) {
      const data = await fetchPrices(listCopy[i].place_id);
      if (data.success && !data.no_prices) {
        listCopy[i].prices = data.message;
      } else {
        listCopy[i].prices = DeepCopy(GAS_TYPES);
      }
    }
    return listCopy;
  };

  const setPrices = async () => {
    setIsLoading(true);
    const updatedList = await getPrices();
    setListWPrices(updatedList);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (listInfo.length) setPrices();
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
    <div
      className="main map-container"
      style={{ maxHeight: window.innerHeight - 125 }}
    >
      <div className="map-search-div">
        <MapSearch
          setSearchedLoc={setSearchedLoc}
          setIsLoading={setIsLoading}
        />
        <Map
          clicked={clicked}
          setClicked={setClicked}
          setListInfo={setListInfo}
          searchedLoc={searchedLoc}
          setIsLoading={setIsLoading}
        />
      </div>
      <div id="list">
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="dist-asc">Distance ???</option>
          <option value="dist-desc">Distance ???</option>
          {/* <option value="price-asc">Price ???</option>
          <option value="price-desc">Price ???</option> */}
        </select>
        <div className="list-body">
          {sortedList.length > 0 &&
            sortedList.map((item) => {
              return (
                <List
                  item={item}
                  clicked={clicked}
                  setClicked={setClicked}
                  favorites={favorites}
                  addToFav={addToFav}
                  removeFav={removeFav}
                  updatePrice={updatePrice}
                  priceToUpdate={priceToUpdate}
                  setPriceToUpdate={setPriceToUpdate}
                  key={item.place_id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

const Map = ({
  clicked,
  setClicked,
  setListInfo,
  searchedLoc,
  setIsLoading,
}) => {
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
    setIsLoading(true);
    const marker = new window.google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.place_id,
    });
    setIsLoading(false);
    return marker;
  };

  const createInfoWindow = (place, marker, infowindow) => {
    const { place_id, name, vicinity, geometry } = place;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      vicinity
    )}&query_place_id=${place_id}`;

    const dist = distance(
      center.lat,
      center.lng,
      geometry.location.lat(),
      geometry.location.lng(),
      "M"
    );

    window.google.maps.event.addListener(marker, "click", () => {
      const contentString = `<div>${name}</div><div>${vicinity}</div><div><a href=${url} target="_blank">View in Google Maps</a></div>`;
      infowindow.setContent(contentString);
      infowindow.open({
        anchor: marker,
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
    setIsLoading(true);
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
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (ref.current && !map && center) {
      setIsLoading(true);
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
      setIsLoading(false);
    }
  }, [ref, map, center]);

  useEffect(() => {
    if (map) {
      window.google.maps.event.clearListeners(map, "idle");

      if (onIdle) map.addListener("idle", () => onIdle(map));
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const request = {
        type: "gas_station",
        // location: center,
        // radius: "10000",
        bounds: map.getBounds(),
      };
      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(request, async function (results, status) {
        setIsLoading(true);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          deleteMarkers();
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
        }
        setIsLoading(false);
      });
    }
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

const MapSearch = ({ setSearchedLoc, setIsLoading }) => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const initialLocation = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        setSearchedLoc(initialLocation);
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", async () => {
      const place = await autoCompleteRef.current.getPlace();
      setSearchedLoc(place.geometry.location);

      inputRef.current.value = "";
    });
    setIsLoading(false);
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
