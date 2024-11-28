import { JSONFromURL } from "@/lib/movie-data"
import { EventsData } from "./event-types"

// apollokino default json
// if need xml use XML2JSONFromURL()
//const url = "https://www.forumcinemas.ee/xml/Events?includePictures=true"
const url = "https://www.apollokino.ee/xml/Events?includePictures=true"

export function getForumEvents() {
  return JSONFromURL<Event[]>(url)
}