import { JSONFromURL } from "@/lib/movie-data"
import { Event } from "./event-types"

// apollokino default json
// if need xml use XML2JSONFromURL()
const url = "https://www.apollokino.ee/xml/Events?includePictures=true"

export function getApolloEvents() {
    console.log(JSONFromURL<Event[]>(url))
  return JSONFromURL<Event[]>(url)
}