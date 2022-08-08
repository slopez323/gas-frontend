const GAS_PAYMENT = {
  cash: [{ price: "--", updatedBy: "", updateTime: "" }],
  credit: [{ price: "--", updatedBy: "", updateTime: "" }],
};

export const GAS_TYPES = {
  regular: GAS_PAYMENT,
  midgrade: GAS_PAYMENT,
  premium: GAS_PAYMENT,
  diesel: GAS_PAYMENT,
};

export const blankPrice = ["", "", ".", "", ""];

export const numKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "",
  "0",
  "←",
];

export const DeepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const distance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    // if (unit === "N") {
    //   dist = dist * 0.8684;
    // }
    return dist.toFixed(2);
  }
};
