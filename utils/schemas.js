import fetchRecordIds from './fetchRecordIds'

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

export async function formatResourceData(data, base) {
  return {
    Creator: await fetchRecordIds(data.who, base, 'LL_PEOPLE', 'LLPeopleName'),
    "Tool or Medium": await fetchRecordIds(data.tool, base, 'TOOLS_AND_MEDIA', 'TOOL or MEDIA'),
    Link: data.link,
    Type: data.type,
    Title: data.title
  }
}
export function formatResourceDataWithIds(data, base) {
  return {
    Creator: data.who,
    "Tool or Medium": data.tool,
    Link: data.link,
    Type: data.type,
    Title: data.title
  }
}

export function formatToolMed(data) {
  return {
    "TOOL or MEDIA": data.input,
    Type: data.type
  }
}
