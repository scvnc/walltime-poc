import { assertIsoWallTime } from '@/util/time.util'
import { DateTime } from 'luxon'

interface CreateWallTimeLuxonValueOptions {
  serverConfiguredIanaZone?: string
}

/**
 * This is a test utility not designed to be used in production.
 * It will help simulate timestamps that are represented as the Wall Time where the server is at.
 *
 * @param wallTimeIso This is your desired wall time as an iso string. Example: `'2012-01-01T12:00:00'`
 * @param wallTimeIanaZone The desired IanaZone of your wall time.  Example: `'America/Phoenix'`
 * @param options.serverConfiguredIanaZone If your server is configured to save wall times in it's own zone you can provide it here. Defaults to UTC.
 *
 * @returns A Luxon DateTime in UTC, adjusted for the server time zone, that corresponds to your desired Wall Time.
 */
export const createWallTimeLuxonValue = (
  wallTimeIso: string,
  wallTimeIanaZone: string,
  options: CreateWallTimeLuxonValueOptions = {}
): DateTime => {
  assertIsoWallTime(wallTimeIso)

  const serverConfiguredIanaZone = options.serverConfiguredIanaZone || 'UTC'

  const wallTime = DateTime.fromISO(wallTimeIso, { zone: wallTimeIanaZone })

  const wallTimeOfServer = wallTime.setZone(serverConfiguredIanaZone)

  const wallTimeIsoWithoutOffset = wallTimeOfServer.toISO({
    includeOffset: false
  })

  return DateTime.fromISO(wallTimeIsoWithoutOffset, { zone: 'utc' })
}
