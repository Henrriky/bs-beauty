class RegexPatterns {
  public static readonly names = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
  public static readonly phone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
  public static readonly content = /^[a-zA-Z0-9À-ÿ\s.,?!\-()]{10,500}$/
  public static readonly password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  public static readonly time = /^([01]\d|2[0-3]):([0-5]\d)$/
}

export { RegexPatterns }
