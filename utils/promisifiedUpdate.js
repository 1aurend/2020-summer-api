export function updateRecord(base, table, data, id) {
  const doneCallback = (error, record) => {
    if (error) {
      updater.reject(error)
    } else {
      updater.resolve(record)
    }
  }
  const updater = () => {
    return new Promise((res, rej) => {
      updater.reject = rej
      updater.resolve = res
      base(table)
        .update(id, data, doneCallback)
    })
  }
  return updater
}
