export function formatPersonInfo(data, atID) {
  if (atID) {
    return {
      LLPeopleName: `${data.firstName} ${data.lastName}`,
      "!FirstName": data.firstName,
      "!LastName": data.lastName,
      "!Email": data.email,
      "!Role": data.role,
      recordid: atID
    }
  }
  return {
    LLPeopleName: `${data.firstName} ${data.lastName}`,
    "!FirstName": data.firstName,
    "!LastName": data.lastName,
    "!Email": data.email,
    "!Role": data.role
  }
}
