import _ from 'lodash'


export default async function fetchRecordIds(items, base, table, field) {
  if (_.isString(items)) {
      const records = await base(table).select({
        filterByFormula: `{${field}} = "${items}"`})
        .all()
        .catch(err => console.log(err))
      return records[0].id
    }
  const ids = await Promise.all(items.map(async item => {
    const records = await base(table).select({
      filterByFormula: `{${field}} = "${item}"`})
      .all()
      .catch(err => console.log(err))
      if (records[0]?.id) {
        return records[0].id
      }
      return `no record found for ${item}`
  })).then(vals => {return vals})
  return ids
}
