import { isIsoWallTime } from '../time.util'

describe('isIsoLocalTime', () => {
  it.each([
    { isoString: '2022-03-01T10:00:00', expectedIsLocalTime: true },
    { isoString: '2022-03-01T10:00:00.012', expectedIsLocalTime: true },
    //
    { isoString: '2022-03-01T10:00:00-06:00', expectedIsLocalTime: false },
    { isoString: '2022-03-01T10:00:00Z', expectedIsLocalTime: false },
    { isoString: '2022-03-01T10:00:00Z', expectedIsLocalTime: false }
  ])(
    'returns $expectedIsLocalTime for $isoString',
    ({ isoString, expectedIsLocalTime: expected }) => {
      expect(isIsoWallTime(isoString)).toEqual(expected)
    }
  )
})
