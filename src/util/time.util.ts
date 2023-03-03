const _isoWallTimeRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?$/
/**
 * Returns true if the iso string is considered "local time" and does not have
 * any associated time zone offset information.
 * @param isoString a string to check
 * @returns boolean
 */
export const isIsoWallTime = (isoString: string) => {
  const matches = isoString.match(_isoWallTimeRegex)
  return matches !== null
}

export const assertIsoWallTime = (isoString: string) => {
  if (!isIsoWallTime(isoString)) {
    throw new Error(
      'You must provide an ISO date string **without** zone information, otherwise it is not considered a "Wall Time"'
    )
  }
}
