import { isSmallScreen } from '../constants'

import { encode } from "blurhash"

const loadImage = async src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = src;
  })

const getImageData = image => {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext("2d")
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
};

export const encodeImageToBlurhash = async imageUrl => {
  const image = await loadImage(imageUrl)
  const imageData = getImageData(image)
  //return encode(imageData.data, imageData.width, imageData.height, 4, 4)
  return encode(imageData.data, imageData.width, imageData.height, 1, 1)
}

export const getFileSizeInMb = (uri) => {
  return (uri.length * (3 / 4) - 2) / (1024 * 1024)
}

export const getDataType = (uri) => {
  const parts = uri.split(',')
  return parts[0].split('/')[0].split(':')[1]
}

export const normalize = (size, inverse = false) => {
  return isSmallScreen ? size - 5 * (inverse ? -1 : 1) : size
}

export const stripEmptyParams = (params) => {
  return Object.keys(params).reduce((out, param) => params[param] ? {...out, [param]: params[param]} : out, {})
  //return params.reduce((out, param) => param ? {...out, [param]: }, {})
}

export const stripDefaultFilters = (defaultFilters, filters) => {
  return Object.keys(filters).reduce((out, filter) => areValuesEqual(filters[filter], defaultFilters[filter]) ? out : {...out, [filter]: filters[filter]}, {})
}

export const getParam = (supportedValues, param, fallbackValue) => {
  if (!supportedValues) {
    return fallbackValue
  }

  const decodedParam = decodeURIComponent(param)

  if (!decodedParam) {
    return fallbackValue
  }

  const paramValid = supportedValues.some(value => value.toLowerCase() === decodedParam.toLocaleLowerCase())
  return paramValid ? decodedParam : fallbackValue
}

export const deepClone = (data) => JSON.parse(JSON.stringify(data))

//HELPER FUNCTIONS
const isArrayEqual = (array1, array2) => array1.length === array2.length && array1.every((value, index) => areValuesEqual(value,array2[index]))

const areDatesEqual = (date1, date2) => date1.getTime() === date2.getTime()

const areObjectsEqual = (object1, object2) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
      return false
  }
  for (let key of keys1) {
      if (object1[key] !== object2[key]) {
          return false
      }
  }
  return true
}

//if same -> return true
export const areValuesEqual = (val1, val2) => {
  return typeof val1 === 'object' ? 
    (
      val1 instanceof Date ? areDatesEqual(val1, val2) 
      : Array.isArray(val1) ? isArrayEqual(val1, val2) 
      : areObjectsEqual(val1, val2)
    ) : val1 === val2
}

export const generateThumbnailFromLocalURI = (uri, time) => {
  return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = uri;
      video.crossOrigin = "anonymous";
      video.addEventListener("loadeddata", () => {
          try {
              video.currentTime = time;
          } catch (e) {
              console.log(e)
              reject(e);
          }
      });

      video.addEventListener("seeked", () => {
          try {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const imageUrl = canvas.toDataURL();
                  resolve(imageUrl);
              } else {
                  reject(new Error("Failed to get canvas context"));
              }
          } catch (e) {
              reject(e);
              console.log(e)
          }
      });
      video.load();
  });
}

export const calculateAgeFromDate = (dateStr) => {
  const parsedPastDate = new Date(dateStr.slice(4, 8), dateStr.slice(2, 4) - 1, dateStr.slice(0, 2))
  const today = new Date()

  const timeDiff = today - parsedPastDate;

  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  const yearsDiff = timeDiff / millisecondsInYear;

  const roundedYears = Math.floor(yearsDiff);

  return roundedYears;
}