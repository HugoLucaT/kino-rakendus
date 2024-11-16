import { JSONFromURL } from ".."
import { ApolloJSON } from "../cinemas/apollo-types"

// apollokino default json
// if need xml use XML2JSONFromURL()
const url = "https://www.apollokino.ee/xml/Schedule?area=1008&nrOfDays=14"

export function getNarvaSchedule() {
  return JSONFromURL<ApolloJSON>(url)
}