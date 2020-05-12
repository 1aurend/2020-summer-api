function loadFromAirTablePagedCursor(base, table, options) {
  const cursor = {};

  const doneCallback = error => {
    if (error) {
      cursor.reject(error);
    } else {
      cursor.resolve();
    }
  };

  const eachPageCallback = (records, fetchNextPage) => {
    cursor.nextPage = () => {
      return new Promise((res, rej) => {
        cursor.reject = rej;
        cursor.resolve = res;
        fetchNextPage();
      });
    };
    cursor.resolve(records);
  };

  cursor.nextPage = () => {
    return new Promise((res, rej) => {
      cursor.reject = rej;
      cursor.resolve = res;
      base(table)
        .select(options)
        .eachPage(eachPageCallback, doneCallback);
    });
  };

  return cursor;
}

const base = new Airtable({
  /*your appid + creds*/
});
const table = "Some Table";
// This is the AT options provided to the JS Client
const options = {
  sort: "",
  pageSize: "",
  maxRecords: "",
  filterByFormula: "",
  /*other stuff*/
};

// No network on next line - just an ability to paginate using promises
// encapsulated in a "cursor"
const atPageCursor = loadFromAirTablePagedCursor(base, table, options);
try {
  // nextPage return a promise that resolves to an array of Record objects.
  let atResultsPage = await atPageCursor.nextPage();
  while (atResultsPage && atResultsPage.length) {
    // Process this page.
    const records = atResultsPage;
    records[0].get('Some Field'); // For example

    atResultsPage = await atPageCursor.nextPage();
  }
} catch (err) {
  // Errors thrown from the nextPage call would be caught here.
}
