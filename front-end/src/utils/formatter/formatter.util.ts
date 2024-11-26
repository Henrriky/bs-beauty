import { RegexPatterns } from '../validation/regex.validation.util'

class Formatter {
  public static formatBirthdayWithSlashes(value: string) {
    if (value.length > 10) return value.slice(0, 10)

    value = value.replace(RegexPatterns.formatOnlyNumericChar, '')
    value = value.replace(RegexPatterns.formatDayWithMonth, '$1/$2')
    value = value.replace(RegexPatterns.formatDayWithMonthAndYear, '$1/$2/$3')

    return value
  }

  public static formatPhoneNumber(value: string) {
    if (value.length > 15) return value.slice(0, 15)
    value = value.replace(RegexPatterns.formatOnlyNumericChar, '')
    value = value.replace(RegexPatterns.formatDDD, '($1) $2')
    value = value.replace(RegexPatterns.formatNumberWithDash, '$1-$2')
    return value
  }
}

export { Formatter }
