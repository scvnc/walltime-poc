import type { DateTime } from 'luxon'
import { createWallTimeLuxonValue as createServerWallTimeLuxonValue } from './time.test-util'

describe('createWallTimeLuxonValue', () => {
  let wallTimeLuxonValue: DateTime

  describe('when the server is considered to be configured in the America/Chicago timezone', () => {
    const serverConfiguredIanaZone = 'America/Chicago'

    describe('when creating a wall time value that represents 10am in phoenix', () => {
      beforeEach(() => {
        wallTimeLuxonValue = createServerWallTimeLuxonValue(
          '2023-03-04T10:00:00',
          'America/Phoenix',
          { serverConfiguredIanaZone }
        )
      })

      it('should return a utc time', () => {
        expect(wallTimeLuxonValue.zoneName).toEqual('UTC')
      })
      it('has the hour in the UTC zone equivalent to the wall time at the server', () => {
        // 11am America/Chicago is 10am Phoenix because they are one hour difference
        expect(wallTimeLuxonValue.hour).toEqual(11)
      })

      it('has the correct equivalent time', () => {
        expect(wallTimeLuxonValue.toISO()).toEqual('2023-03-04T11:00:00.000Z')
      })
    })

    describe.each([
      {
        wallTime: '2023-03-01T10:00:00', // 10am
        wallTimeIanaZone: 'America/Phoenix', // in Phoenix
        expectedValue: '2023-03-01T11:00:00.000Z' // is 11am in at the server's ianaZone, represented in UTC
        // This is because 11am America/Chicago (server) is 10pm America/Phoenix
      },
      {
        wallTime: '2023-03-01T16:00:00', // 4pm
        wallTimeIanaZone: 'America/New_York', // in New York
        expectedValue: '2023-03-01T15:00:00.000Z' // is 3pm wall time in at the server's ianaZone, represented in UTC
        // This is because 3pm America/Chicago (server) is 4pm America/New_York
      },
      {
        wallTime: '2023-03-01T18:15:00', // 6:15pm
        wallTimeIanaZone: 'America/Chicago', // in Chicago
        expectedValue: '2023-03-01T18:15:00.000Z' // is 6:15pm wall time in the server's ianaZone, represented in UTC
        // This is because 6:15pm America/Chicago (server) is 6:15pm America/Chicago
      }
    ])(
      'when creating a wall time value that represents $wallTime in $wallTimeIanaZone',
      ({ wallTime, wallTimeIanaZone, expectedValue }) => {
        const wallTimeTimestamp = createServerWallTimeLuxonValue(wallTime, wallTimeIanaZone, {
          serverConfiguredIanaZone
        })

        it(`should return ${expectedValue}`, () => {
          expect(wallTimeTimestamp.toISO()).toEqual(expectedValue)
        })
      }
    )
  })

  describe('when there is no configured server timezone', () => {
    it('should default to representing as UTC', () => {
      const wallTimeLuxonValue = createServerWallTimeLuxonValue(
        '2023-03-04T10:00:00',
        'America/Phoenix'
      )

      // Phoenix is UTC minus 7
      // so 10:00 America/Phoenix is 17:00 UTC
      // because 10+7=17
      expect(wallTimeLuxonValue.toISO()).toEqual('2023-03-04T17:00:00.000Z')
    })
  })
})
