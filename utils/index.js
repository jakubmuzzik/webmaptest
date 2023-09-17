import { isSmallScreen } from '../constants'

export const normalize = (size) => {
  return isSmallScreen ? size - 5 : size
}