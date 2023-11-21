export const addTimeAndConvertToEpoch = (dateIn: Date, additionalTime: string) => {
    const midnightDate = new Date(dateIn)
    midnightDate.setUTCHours(0, 0, 0, 0)
    midnightDate.setHours(0, 0, 0, 0)
    const [hour, minute, seconds] = additionalTime.split(":")
    midnightDate.setHours(midnightDate.getHours() + parseInt(hour, 10))
    midnightDate.setMinutes(midnightDate.getMinutes() + parseInt(minute, 10))
    midnightDate.setSeconds(midnightDate.getSeconds() + parseInt(seconds, 10))

    const epochSeconds = midnightDate.getTime() / 1000
    return Math.floor(epochSeconds)
}