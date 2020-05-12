export function formatPersonInfo(data) {
  return {
    LLPeopleName: `${data.firstName} ${data.lastName}`,
    "!FirstName": data.firstName,
    "!LastName": data.lastName,
    "!Email": data.email,
    "!Role": data.role
  }
}
