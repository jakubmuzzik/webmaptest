import { isSmallScreen } from '../constants'

export const normalize = (size) => {
  return isSmallScreen ? size - 5 : size
}

export const stripEmptyParams = (params) => {
  return Object.keys(params).reduce((out, param) => params[param] ? {...out, [param]: params[param]} : out, {})
  //return params.reduce((out, param) => param ? {...out, [param]: }, {})
}