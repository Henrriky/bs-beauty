function normalizePath(p: string) {
  if (!p) return '/'
  return p.startsWith('/') ? p : `/${p}`
}

function isActivePath(currentPath: string, itemPath: string) {
  const curr = normalizePath(currentPath)
  const target = normalizePath(itemPath)
  return curr === target || curr.startsWith(`${target}/`)
}

export { isActivePath }