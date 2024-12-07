"use client";

import { getApolloEvents } from "@/lib/event-data/cinemas/apollo-events";
import { getArtisEvents } from "@/lib/event-data/cinemas/artis-events";
import { getThuleEvents } from "@/lib/event-data/cinemas/thule-events";
import { getViimsiEvents } from "@/lib/event-data/cinemas/viimsi-events";
import { getJohviSchedule } from "@/lib/movie-data/cities/johvi";
import { getNarvaSchedule } from "@/lib/movie-data/cities/narva";
import { getParnuSchedule } from "@/lib/movie-data/cities/parnu";
import { getSaaremaaSchedule } from "@/lib/movie-data/cities/saaremaa";
import { getTallinnSchedule } from "@/lib/movie-data/cities/tallinn";
import { getTartuSchedule } from "@/lib/movie-data/cities/tartu";
import { getViljandiSchedule } from "@/lib/movie-data/cities/viljandi";
import { getEstoniaSchedule } from "@/lib/movie-data/eesti";
import apolloPriceCalculation from "@/lib/price/apollo-price";
import artisPriceCalculation from "@/lib/price/artis-price";
import thulePriceCalculation from "@/lib/price/thule-price";
import viimsiPriceCalculation from "@/lib/price/viimsi-price";
import { removeSpecialCharacters } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Data {
  dttmShowStart: string; // Date;
  Title: string;
  OriginalTitle: string;
  ShowURL: string;
  Theatre: string;
  TheatreAuditorium: string;
  Price: string;
}

export default function OthersMovie(info: any) {
  const [firstShow, setFirstShow] = useState<any>(null);
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preloadFirstShow = async () => {
      try {
        const decodedMovie = decodeURIComponent(info.movie);
        let eventData = await getApolloEvents();
        let filteredEvents = eventData.filter(
          (event) =>
            removeSpecialCharacters(event.OriginalTitle) === decodedMovie
        );
        if (!filteredEvents[0]) {
          eventData = await getArtisEvents();
          filteredEvents = eventData.filter(
            (event) =>
              removeSpecialCharacters(event.OriginalTitle) === decodedMovie
          );
        }
        if (!filteredEvents[0]) {
          eventData = (await getViimsiEvents()).Events.Event;
          filteredEvents = eventData.filter(
            (event) =>
              removeSpecialCharacters(event.OriginalTitle) === decodedMovie
          );
        }
        if (!filteredEvents[0]) {
          eventData = (await getThuleEvents()).Events.Event;
          filteredEvents = eventData.filter(
            (event) =>
              removeSpecialCharacters(event.OriginalTitle) === decodedMovie
          );
        }

        setFirstShow(filteredEvents[0] || null);
      } catch (err) {
        console.error("Error preloading first show data:", err);
        setError("Failed to preload first show data.");
      }
    };

    preloadFirstShow();
  }, [info.movie]);

  const fetchFilteredShows = async () => {
    setIsLoading(true);
    setError(null);
    setHasFetched(false);

    try {
      const decodedMovie = decodeURIComponent(info.movie);
      let fetchedData: Data[] = [];
      const supabase = createClient();
      //console.log(supabaseData);
      //let holidayDates = await getHolidays();
      const userData = await supabase.auth.getUser();
      console.log(userData);
      let supabaseData = await supabase.from("user_membership").select("*");
      if (info.city === "tallinn") {
        const [dataApollo, dataArtis, dataViimsi] =
          await Promise.all(getTallinnSchedule());
        dataApollo.Shows.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: apolloPriceCalculation(element),
          });
        });
        dataArtis.Shows.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: artisPriceCalculation(element),
          });
        });
        dataViimsi.Schedule.Shows.Show.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: viimsiPriceCalculation(element),
          });
        });
      }

      const cityScheduleFetchers = {
        narva: getNarvaSchedule,
        tartu: getTartuSchedule,
        johvi: getJohviSchedule,
        parnu: getParnuSchedule,
        viljandi: getViljandiSchedule,
      };

      if (cityScheduleFetchers[info.city]) {
        const citySchedule = await cityScheduleFetchers[info.city]();
        citySchedule.Shows.forEach((element: any) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: apolloPriceCalculation(element),
          });
        });
      }

      if (info.city === "saaremaa") {
        const [dataThule, dataApollo] = await Promise.all(
          getSaaremaaSchedule()
        );
        dataApollo.Shows.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: apolloPriceCalculation(element),
          });
        });
        dataThule.Schedule.Shows.Show.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: thulePriceCalculation(element),
          });
        });
      }

      if (!info.city || info.city === "eesti") {
        const [apolloData, artisData, viimsiData, thuleData] =
          await Promise.all(getEstoniaSchedule());
        console.time("AAAA");
        apolloData.Shows.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: apolloPriceCalculation(element),
          });
        });
        artisData.Shows.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: artisPriceCalculation(element),
          });
        });
        viimsiData.Schedule.Shows.Show.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: viimsiPriceCalculation(element),
          });
        });
        thuleData.Schedule.Shows.Show.forEach((element) => {
          fetchedData.push({
            dttmShowStart: element.dttmShowStart,
            Title: element.Title,
            OriginalTitle: element.OriginalTitle,
            ShowURL: element.ShowURL,
            Theatre: element.Theatre,
            TheatreAuditorium: element.TheatreAuditorium,
            Price: thulePriceCalculation(element),
          });
        });
        console.timeEnd("AAAA");
      }

      const filteredShows = fetchedData.filter(
        (show) => removeSpecialCharacters(show.OriginalTitle) === decodedMovie
      );

      setData(filteredShows);
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError("Failed to load schedule data. Please try again later.");
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  return (
    <div>
      {firstShow && (
        <div>
          <p>
            <strong>Tiitel:</strong> {firstShow.Title}
          </p>
          <p>
            <strong>Originaalne tiitel:</strong> {firstShow.OriginalTitle}
          </p>
          <p>
            <strong>Vanusepiirang:</strong> {firstShow.Rating}
          </p>
          <p>
            <strong>Zanrid:</strong> {firstShow.Genres}
          </p>
          <p>
            <strong>Kirjeldus:</strong> {firstShow.Synopsis}
          </p>
          {firstShow.Images?.EventMediumImagePortrait && (
            <img
              src={firstShow.Images.EventMediumImagePortrait}
              alt={firstShow.Title}
              width="200"
            />
          )}
        </div>
      )}
      <br />
      <hr />
      <h1>Linastuse ajad</h1>

      {!data.length && !isLoading && !error && (
        <button onClick={fetchFilteredShows}>Lae kava</button>
      )}

      {isLoading && <p>Kava laadimine...</p>}

      {error && <p>{error}</p>}

      {hasFetched && data.length === 0 && !isLoading && !error && (
        <p>Lähima 30 päeva jooksul linastused puuduvad</p>
      )}

      {data.map((show, index) => (
        <div key={index}>
          <p>
            <strong>Linastuse algus:</strong> {show.dttmShowStart}
          </p>
          <p>
            <strong>Saal:</strong> {show.TheatreAuditorium}
          </p>
          <p>
            <strong>Asukoht: </strong> {show.Theatre}
          </p>
          <p>
            <strong>Eeldatav tavatooli hind: </strong> {show.Price}
          </p>
          <Link href={show.ShowURL}>{show.ShowURL}</Link>
          <hr />
        </div>
      ))}
    </div>
  );
}
