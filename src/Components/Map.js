import { useRef, useState, useEffect } from "react";

const emptyPrices = {
  regular: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  midgrade: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  premium: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
  diesel: {
    cash: { price: "--" },
    credit: { price: "--" },
  },
};

const MapPage = () => {
  const [listInfo, setListInfo] = useState([]);
  const [clicked, setClicked] = useState();
  const mainHeight = window.innerHeight - 100;

  return (
    <div className="main map-container">
      {/* <Map
        setListInfo={setListInfo}
        clicked={clicked}
        setClicked={setClicked}
      /> */}
      <div id="list" style={{ maxHeight: mainHeight }}>
        {listInfo.map((item) => {
          return (
            <List
              item={item}
              clicked={clicked}
              setClicked={setClicked}
              key={item.place_id}
            />
          );
        })}
      </div>
    </div>
  );
};

const Map = ({ setListInfo, clicked, setClicked }) => {
  const ref = useRef();
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  //   const [listInfo, setListInfo] = useState([]);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState();

  const onIdle = (m) => {
    console.log("onIdle");
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

const List = ({ item, clicked, setClicked }) => {
  const { place_id, name, vicinity } = item;
  const [prices, setPrices] = useState(JSON.parse(JSON.stringify(emptyPrices)));

  useEffect(() => {
    const fetchPrices = async (placeId) => {
      const url = `${process.env.REACT_APP_URL_ENDPOINT}/stations/station/${placeId}`;
      const response = await fetch(url);
      const responseJSON = await response.json();
      if (!responseJSON.no_prices) setPrices(responseJSON.message);
    };
    fetchPrices();
  }, []);

  const selected = place_id === clicked ? "selected" : "";

  const divRef = useRef(place_id);

  useEffect(() => {
    if (divRef.current.classList.contains("selected"))
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [clicked]);

  return (
    <div
      data-id={place_id}
      className={`list-item ${selected}`}
      ref={divRef}
      onClick={() => setClicked(place_id)}
    >
      <p className="list-name">{name}</p>
      <p className="list-address">{vicinity}</p>
      <div className="list-prices">
        <table>
          <tr>
            <th></th>
            <th>Regular</th>
            <th>Midgrade</th>
            <th>Premium</th>
            <th>Diesel</th>
          </tr>
          <tr>
            <th>Cash</th>
            {/* <td>
              <div>$4.50</div>

              <p>Updated by someone</p>
              <p>2 hours ago</p>
            </td> */}
            <td>
              <div>
                ${prices.regular.cash.price ? prices.regular.cash.price : "--"}
              </div>
              {prices.regular.cash.updatedBy && (
                <>
                  <p>Updated by {prices.regular.cash.updatedBy}</p>
                  <p>{prices.regular.cash.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                $
                {prices.midgrade.cash.price ? prices.midgrade.cash.price : "--"}
              </div>
              {prices.midgrade.cash.updatedBy && (
                <>
                  <p>Updated by {prices.midgrade.cash.updatedBy}</p>
                  <p>{prices.midgrade.cash.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                ${prices.premium.cash.price ? prices.premium.cash.price : "--"}
              </div>
              {prices.premium.cash.updatedBy && (
                <>
                  <p>Updated by {prices.premium.cash.updatedBy}</p>
                  <p>{prices.premium.cash.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                ${prices.diesel.cash.price ? prices.diesel.cash.price : "--"}
              </div>
              {prices.diesel.cash.updatedBy && (
                <>
                  <p>Updated by {prices.diesel.cash.updatedBy}</p>
                  <p>{prices.diesel.cash.updateTime}</p>
                </>
              )}
            </td>
          </tr>
          <tr>
            <th>Credit</th>
            <td>
              <div>
                $
                {prices.regular.credit.price
                  ? prices.regular.credit.price
                  : "--"}
              </div>
              {prices.regular.credit.updatedBy && (
                <>
                  <p>Updated by {prices.regular.credit.updatedBy}</p>
                  <p>{prices.regular.credit.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                $
                {prices.midgrade.credit.price
                  ? prices.midgrade.credit.price
                  : "--"}
              </div>
              {prices.midgrade.credit.updatedBy && (
                <>
                  <p>Updated by {prices.midgrade.credit.updatedBy}</p>
                  <p>{prices.midgrade.credit.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                $
                {prices.premium.credit.price
                  ? prices.premium.credit.price
                  : "--"}
              </div>
              {prices.premium.credit.updatedBy && (
                <>
                  <p>Updated by {prices.premium.credit.updatedBy}</p>
                  <p>{prices.premium.credit.updateTime}</p>
                </>
              )}
            </td>
            <td>
              <div>
                $
                {prices.diesel.credit.price ? prices.diesel.credit.price : "--"}
              </div>
              {prices.diesel.credit.updatedBy && (
                <>
                  <p>Updated by {prices.diesel.credit.updatedBy}</p>
                  <p>{prices.diesel.credit.updateTime}</p>
                </>
              )}
            </td>
          </tr>
        </table>
      </div>
      <hr />
    </div>
  );
};

export default MapPage;
