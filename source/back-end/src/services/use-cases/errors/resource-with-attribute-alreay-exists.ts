class ResourceWithAttributAlreadyExists extends Error {
  constructor (resourceName: string, attributeName: string, attributeValue: string) {
    super(`Resource with ${attributeName} '${attributeValue}' already exists in ${resourceName}.`)
  }
}

export { ResourceWithAttributAlreadyExists }
