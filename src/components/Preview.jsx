"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar } from "./ui/calendar";
import noEventsImg from "./assets/images/no-events-2.png";
import { setEvents } from "@/Features/eventSlice";

const Preview = () => {
  const { events } = useSelector((state) => state.eventsState);
  const [currentEvent, setCurrentEvent] = useState();
  const [carouselApi, setCarouselApi] = useState("");
  const dispatch = useDispatch();

  const capitalizeFirstLetter = (str) => {
    let newStr = String(str.charAt(0).toUpperCase()) + String(str.slice(1));
    return newStr;
  };

  useEffect(() => {
    // Load events from localStorage on the client side
    const eventsFromStorage =
      JSON.parse(localStorage.getItem("eventsState")) || [];
    dispatch(setEvents(eventsFromStorage));
  }, [dispatch]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setCurrentEvent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", () => {
      setCurrentEvent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);
  return (
    <fieldset className="col-span-3 flex flex-col gap-4 rounded-lg border p-4 justify-center items-center">
      <legend className="-ml-1 px-1 text-sm font-medium">Preview Event</legend>
      <Carousel className="w-full max-w-xs" setApi={setCarouselApi}>
        <CarouselContent>
          {events?.length ? (
            events?.map((event) => (
              <CarouselItem
                key={event?.eventId}
                className="flex items-center justify-center"
              >
                <Card className="max-w-[400px]">
                  <CardHeader>
                    <CardTitle>{event?.eventName}</CardTitle>
                    <CardDescription>
                      {`${capitalizeFirstLetter(event?.eventType)} ${
                        event?.frequency
                          ? capitalizeFirstLetter(event?.frequency)
                          : ""
                      }`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event?.eventType === "regular" ? (
                      <Calendar
                        className="rounded-md border shadow"
                        mode="single"
                        selected={new Date(event?.reminders)}
                      />
                    ) : (
                      <Calendar
                        className="rounded-md border shadow"
                        mode="multiple"
                        selected={event?.reminders?.map(
                          (reminder) => new Date(reminder)
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <Card className="h-[300px] w-[300px] m-4">
              <CardHeader className="flex justify-center items-center">
                <CardTitle>No Events Available</CardTitle>
              </CardHeader>
              <CardContent className="flex h-[80%] justify-center items-center">
                <Image
                  src={noEventsImg}
                  alt="No events"
                  className="h-[200px] w-[200px]"
                />
              </CardContent>
            </Card>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {currentEvent} of {events?.length}
      </div>
    </fieldset>
  );
};

export default Preview;
