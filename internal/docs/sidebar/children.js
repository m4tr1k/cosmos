/*
  filepath format:
    1. src/components/atoms/component/component.js
    2. src/components/molecules/component/component.js
    3. src/components/molecules/component/child/child.js
*/

const attachChildren = components => {
  /* Attach children to their parents and remove from list */

  const parents = components.filter(component => isParent(component)).map(parent => {
    parent.children = []
    return parent
  })

  const children = components.filter(component => !isParent(component))

  children.forEach(child => {
    const parent = getParent(parents, child)
    if (parent) {
      /* Nest child inside parent */
      parent.children.push(child)
    } else {
      /*
        if parent is not in the list, treat the child as a parent
        usually happens when you filter components using search
      */
      parents.push(child)
    }
  })

  return parents
}

/* Definitions that only works for the current file structure, might change */
const isParent = component => {
  const directoryName = component.filepath.split('/')[3]

  if (component.filepath.includes(`${directoryName}.js`)) return true
  else return false
}

const getParent = (components, child) => {
  /*
    convert child path to parent path

    src/components/molecules/component/child/child.js
    to
    src/components/molecules/component/component.js
  */

  const directoryName = child.filepath.split('/')[3]
  const parentFilePath =
    child.filepath
      .split('/')
      .splice(0, 4)
      .join('/') +
    '/' +
    directoryName +
    '.js'

  return components.find(component => component.filepath === parentFilePath)
}

export default attachChildren
