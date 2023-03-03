import { WallTime } from '@/WallTime/WallTime'
import { DateTime } from 'luxon'
import { describe, expect } from 'vitest'

describe('WallTime', () => {
  describe('when constructing from an ISO string', () => {
    let newYorkWallTime: WallTime

    beforeEach(() => {
      newYorkWallTime = WallTime.fromISO('2012-10-10T12:30:21', 'America/New_York')
    })

    it('exposes the constituents of the wall time', () => {
      expect(newYorkWallTime.year).toEqual(2012)
      expect(newYorkWallTime.month).toEqual(10)
      expect(newYorkWallTime.day).toEqual(10)

      expect(newYorkWallTime.hour).toEqual(12)
      expect(newYorkWallTime.minute).toEqual(30)
      expect(newYorkWallTime.second).toEqual(21)

      expect(newYorkWallTime.zoneName).toEqual('America/New_York')
    })

    it('illustrates if it is safe to permanently apply zone', () => {
      expect(newYorkWallTime.isSafeToPermanentlyApplyZone).toEqual(true)
    })

    it('provides means of debugging the wall time it represents', () => {
      expect(newYorkWallTime.toString()).toEqual(
        'WallTime: 2012-10-10T12:30:21.000 America/New_York (Past)'
      )
    })

    describe('when applying the time zone into a Luxon DateTime', () => {
      let newYorkWallTimeAsLuxon: DateTime

      beforeEach(() => {
        newYorkWallTimeAsLuxon = newYorkWallTime.applyZone()
      })

      it('constructs the equivalent luxon DateTime with the ianaZone applied as its offset', () => {
        expect(newYorkWallTimeAsLuxon.toISO()).toEqual('2012-10-10T12:30:21.000-04:00')
        expect(newYorkWallTimeAsLuxon.zoneName).toEqual('America/New_York')
      })
    })
  })

  describe('when constructing from a wall time represented as utc epoch seconds', () => {
    let chicagoWallTime: WallTime

    beforeEach(() => {
      const utcEpochSecondsTestValue = 1677672000

      // Prove to the reader what this seconds value is.. 12PM UTC on March 1st 2023
      expect(DateTime.fromSeconds(utcEpochSecondsTestValue, { zone: 'UTC' }).toISO()).toEqual(
        '2023-03-01T12:00:00.000Z'
      )

      // Use the seconds value in our unit under test
      chicagoWallTime = WallTime.fromUtcEpochSeconds(utcEpochSecondsTestValue, 'America/Chicago')
    })

    it('exposes the constituents of the wall time', () => {
      expect(chicagoWallTime.year).toEqual(2023)
      expect(chicagoWallTime.month).toEqual(3)
      expect(chicagoWallTime.day).toEqual(1)

      expect(chicagoWallTime.hour).toEqual(12)
      expect(chicagoWallTime.minute).toEqual(0)
      expect(chicagoWallTime.second).toEqual(0)

      expect(chicagoWallTime.zoneName).toEqual('America/Chicago')
    })

    it('illustrates if it is safe to permanently apply zone', () => {
      expect(chicagoWallTime.isSafeToPermanentlyApplyZone).toEqual(true)
    })

    it('provides means of debugging the wall time it represents', () => {
      expect(chicagoWallTime.toString()).toMatchInlineSnapshot(
        '"WallTime: 2023-03-01T12:00:00.000 America/Chicago (Past)"'
      )
    })

    describe('when applying the time zone into a Luxon DateTime', () => {
      let chicagoWallTimeAsLuxon: DateTime

      beforeEach(() => {
        chicagoWallTimeAsLuxon = chicagoWallTime.applyZone()
      })

      it('constructs the equivalent luxon DateTime with the ianaZone applied as its offset', () => {
        expect(chicagoWallTimeAsLuxon.toISO()).toEqual('2023-03-01T12:00:00.000-06:00')
        expect(chicagoWallTimeAsLuxon.zoneName).toEqual('America/Chicago')
      })
    })
  })
})
