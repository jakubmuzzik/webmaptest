import { isSmallScreen } from '../constants'

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