export function findRecord(base, table, id) {
  const doneCallback = (error, record) => {
    if (error) {
      finder.reject(error)
    } else {
      finder.resolve(record)
    }
  }
  const finder = () => {
    return new Promise((res, rej) => {
      finder.reject = rej
      finder.resolve = res
      base(table)
        .find(id, doneCallback)
    })
  }
  return finder
}
