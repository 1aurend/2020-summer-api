export function createRecord(base, table, data) {
  const doneCallback = (error, record) => {
    if (error) {
      creator.reject(error)
    } else {
      creator.resolve(record)
    }
  }
  const creator = () => {
    return new Promise((res, rej) => {
      creator.reject = rej
      creator.resolve = res
      base(table)
        .create(data, doneCallback)
    })
  }
  return creator
}
