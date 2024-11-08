class RegexPatterns {
  public static readonly names = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
  public static readonly phone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
  public static readonly content = /^[a-zA-Z0-9À-ÿ\s.,?!\-()]{10,500}$/
  public static readonly url = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/
  public static readonly password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

export { RegexPatterns }
