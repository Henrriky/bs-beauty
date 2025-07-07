// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessageFromErrorsAttr = (obj: Record<any, any>, path: string) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result?.message?.toString()
}

export { getErrorMessageFromErrorsAttr }
