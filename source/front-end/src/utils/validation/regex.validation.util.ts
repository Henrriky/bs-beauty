class RegexPatterns {
  public static readonly onlyNumberGlobal = /D/g

  public static readonly dayMonthYearFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/
  public static readonly formatDayWithMonth = /^(\d{2})(\d{0,2})$/
  public static readonly formatDayWithMonthAndYear =
    /^(\d{2})(\d{0,2})(\d{0,4})$/

  public static readonly formatOnlyNumericChar = /\D/g
  public static readonly formatDDD = /(\d{2})(\d)/
  public static readonly formatNumberWithDash = /(\d)(\d{4})$/

  public static readonly names = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
  public static readonly phone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
  public static readonly content = /^[a-zA-Z0-9À-ÿ\s.,?!\-()]{2,500}$/
  public static readonly observation = /^[a-zA-Z0-9À-ÿ\s.,?!\-()]{0,500}$/
  public static readonly password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  public static readonly time = /^([01]\d|2[0-3]):([0-5]\d)$/
}

export { RegexPatterns }
