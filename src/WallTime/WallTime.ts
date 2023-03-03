import { assertIsoWallTime } from '@/util/time.util'
import { DateTime } from 'luxon'

export class WallTime {
  readonly #wallTimeAsUtc: DateTime
  readonly #wallTimeIanaZone: string

  /**
   * This helps you capture and manipulate a wall time
   *
   * Strongly recommended that you construct this from:
   *
   *    `WallTime.fromISO` or `WallTime.fromUtcEpochSeconds`
   *
   * @param wallTimeAsUtc provide the Wall as a Luxon DateTime, but in the UTC timezone.
   * @param wallTimeIanaZone the ianaZone you would like this WallTime to be in.
   */
  constructor(wallTimeAsUtc: DateTime, wallTimeIanaZone: string) {
    this.#wallTimeAsUtc = wallTimeAsUtc
    this.#wallTimeIanaZone = wallTimeIanaZone
  }

  static fromISO(wallTimeIso: string, wallTimeIanaZone: string) {
    assertIsoWallTime(wallTimeIso)

    const wallTimeAsUtc = DateTime.fromISO(wallTimeIso, { zone: 'utc' })
    return new WallTime(wallTimeAsUtc, wallTimeIanaZone)
  }

  /**
   * Creates a WallTime from an Epoch Timestamp representing the wall time if we were looking at it in UTC.
   *
   * ## Example: interpreting an epoch time stamp as the wall time in America/Chicago
   *
   * Epoch timestamp `1677672000` represented as ISO: `"2023-03-01T12:00:00.000Z"`
   *
   *     const wallTime = WallTime.fromUtcEpochSeconds(1677672000, 'America/Chicago')
   *
   *     wallTime.toString() // 'WallTime: 2023-03-01T12:00:00.000 America/Chicago (Past)'
   *     wallTime.applyZone().toISO(); // '2023-03-01T12:00:00.000-06:00"
   *
   *
   * @param utcEpochSeconds The epoch time that represents the Wall Time if we were looking at it in UTC.
   * @param wallTimeIanaZone The desired ianaZone the WallTime should be in.
   * @returns Constructed WallTime object
   */
  static fromUtcEpochSeconds(utcEpochSeconds: number, wallTimeIanaZone: string) {
    const wallTimeAsUtc = DateTime.fromSeconds(utcEpochSeconds, { zone: 'utc' })
    return new WallTime(wallTimeAsUtc, wallTimeIanaZone)
  }

  get isInFuture() {
    return this.#wallTimeAsUtc.diffNow().toMillis() > -1
  }

  /**
   * It is only safe to permanently apply zone to this value if it is in the past, as laws about time zones
   * will not change if they are in the past, but they could conceivably change if they are in the future.
   */
  get isSafeToPermanentlyApplyZone() {
    return !this.isInFuture
  }

  get year() {
    return this.#wallTimeAsUtc.year
  }

  get month() {
    return this.#wallTimeAsUtc.month
  }

  get day() {
    return this.#wallTimeAsUtc.day
  }

  get hour() {
    return this.#wallTimeAsUtc.hour
  }

  get minute() {
    return this.#wallTimeAsUtc.minute
  }

  get second() {
    return this.#wallTimeAsUtc.second
  }

  get zoneName() {
    return this.#wallTimeIanaZone
  }

  applyZone() {
    return this.#wallTimeAsUtc.setZone(this.#wallTimeIanaZone, { keepLocalTime: true })
  }

  toString() {
    const futureLabel = this.isInFuture ? 'Future' : 'Past'

    const isoDate = this.#wallTimeAsUtc.toISODate()
    const isoTime = this.#wallTimeAsUtc.toISOTime({ includeOffset: false })

    return `WallTime: ${isoDate}T${isoTime} ${this.#wallTimeIanaZone} (${futureLabel})`
  }
}
