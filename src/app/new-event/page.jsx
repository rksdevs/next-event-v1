"use client";
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { addNewEvent } from "../../Features/eventSlice";
import DatePickerComponent from "@/components/DatePickerComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import Preview from "@/components/Preview";
import { useToast } from "@/hooks/use-toast";

const NewEvent = () => {
  //   const { events } = useSelector((state) => state.eventsState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminders, setReminders] = useState([]);
  const [customFrequency, setCustomFrequency] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [nthDayOfMonth, setNthDayOfMonth] = useState("");
  const [nthDayOfMonthPayload, setNthDayOfMonthPayload] = useState({
    day: null,
    weekWiseDay: null,
  });
  const [customRecurrenceInterval, setCustomRecurrenceInterval] = useState(0);
  const [customRecurrenceIntervalType, setCustomRecurrenceIntervalType] =
    useState("");

  const [openDialogOne, setOpenDialogOne] = useState(false);
  const [openDialogTwo, setOpenDialogTwo] = useState(false);
  const [openDialogThree, setOpenDialogThree] = useState(false);

  const weekDays = [
    {
      id: "1",
      label: "Monday",
      value: "monday",
    },
    {
      id: "2",
      label: "Tuesday",
      value: "tuesday",
    },
    {
      id: "3",
      label: "Wednesday",
      value: "wednesday",
    },
    {
      id: "4",
      label: "Thursday",
      value: "thursday",
    },
    {
      id: "5",
      label: "Friday",
      value: "friday",
    },
    {
      id: "6",
      label: "Saturday",
      value: "saturday",
    },
    {
      id: "0",
      label: "Sunday",
      value: "sunday",
    },
  ];

  const randomIdCreator = (name) => {
    let randomNumber = Math.floor(Math.random() * 100000000000);
    let id = String(
      name.charAt(0) + randomNumber + name.charAt(name.length - 1)
    );
    return id.toLowerCase();
  };

  const handleEventCreation = async (e) => {
    e.preventDefault();
    if (eventType === "recurring" && !date?.to) {
      toast({
        title: "Missing End Date",
        description: "Need to add end date for recurring events",
        variant: "destructive",
      });
      return;
    }
    randomIdCreator(eventName);
    const payload = {
      //if eventType === "recurring" then send frequency otherwise remove frequency
      eventId: randomIdCreator(eventName),
      eventName,
      eventType,
      eventDate: date,
      frequency: eventType === "recurring" ? frequency : null,
      reminders,
    };
    console.log(payload);
    dispatch(addNewEvent(payload));
    const storedEvents = localStorage.getItem("eventsState")
      ? JSON.parse(localStorage.getItem("eventsState"))
      : [];
    localStorage.setItem(
      "eventsState",
      JSON.stringify([...storedEvents, payload])
    );
    setEventName("");
    setEventType("");
    setFrequency("");
    setReminders([]);
    setCustomFrequency("");
    setDaysOfWeek([]);
    setDate({
      from: null,
      to: null,
    });
    setCustomRecurrenceInterval(0);
    setCustomRecurrenceIntervalType("");
  };

  const getWeekOfMonth = (dateInput) => {
    const dayOfMonth = dateInput.getDate(); // Get the day of the month
    const dayOfWeek = dateInput.getDay(); // Get the day of the week (0 is Sunday, 1 is Monday, etc.)

    // Create a new date at the start of the month
    // const startOfMonth = new Date(
    //   dateInput.getFullYear(),
    //   dateInput.getMonth(),
    //   1
    // );

    let count = 0;

    for (let day = 1; day <= dayOfMonth; day++) {
      let currentDay = new Date(
        dateInput.getFullYear(),
        dateInput.getMonth(),
        day
      ).getDay();

      //eg if thursday (4) === (4) than increament
      if (currentDay === dayOfWeek) {
        count++;
      }

      if (day > dayOfMonth) {
        break;
      }
    }

    return count;
  };

  const handleWeekdayCheckboxChange = (dayToCheck) => {
    let result = [];
    if (daysOfWeek?.includes(dayToCheck)) {
      result = daysOfWeek.filter((element) => element !== dayToCheck);
    } else {
      result = [...daysOfWeek, dayToCheck];
    }

    setDaysOfWeek(result);
  };

  useEffect(() => {
    const weekDayArray = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    if (daysOfWeek.length) {
      console.log(daysOfWeek);
    }

    if (nthDayOfMonth) {
      setNthDayOfMonthPayload({
        day: weekDayArray[new Date(nthDayOfMonth).getDay()],
        weekWiseDay: getWeekOfMonth(nthDayOfMonth),
      });
      //   console.log(getWeekOfMonth(nthDayOfMonth));
    }
  }, [daysOfWeek, nthDayOfMonth]);

  return (
    <div className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Create a new event</CardDescription>
        </CardHeader>
        <CardContent className="gap-4 p-2 md:p-6">
          <fieldset className="flex flex-col gap-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Setup Event
            </legend>
            <CardContent className="p-0 md:p-6">
              <div className="flex p-4 gap-3">
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={handleEventCreation}
                >
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Label
                      htmlFor="eventName"
                      className="w-full md:w-2/5 text-center md:text-left"
                    >
                      Event Name
                    </Label>
                    <Input
                      id="eventName"
                      type="text"
                      placeholder="Enter name of the event"
                      className="w-full"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Label
                      htmlFor="eventType"
                      className="w-full md:w-2/5 text-center md:text-left"
                    >
                      Event Type
                    </Label>
                    <Select
                      className="w-full md:w-3/5"
                      value={eventType}
                      onValueChange={(e) => setEventType(e)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">One Time Event</SelectItem>
                        <SelectItem value="recurring">
                          Recurring Event
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {eventType === "recurring" ? (
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <Label
                        htmlFor="frequency"
                        className="w-full md:w-2/5 text-center md:text-left"
                      >
                        Recurrance Frequency
                      </Label>
                      <Select
                        className="w-full md:w-3/5"
                        value={frequency}
                        onValueChange={(e) => setFrequency(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="custom">
                            Custom Frequency
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    ""
                  )}
                  {frequency === "custom" ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Frequency</CardTitle>
                        <CardDescription>
                          Setup custom frequency
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex gap-3 flex-col">
                        <Dialog
                          open={openDialogOne}
                          onOpenChange={setOpenDialogOne}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Day Wise Recurrence
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Specific Days of the Week
                              </DialogTitle>
                              <DialogDescription>
                                Select the days on which you would like to set
                                reminder for every week.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                {weekDays?.map((day) => (
                                  <div
                                    className="flex items-center space-x-2"
                                    key={day?.id}
                                  >
                                    <Checkbox
                                      checked={daysOfWeek.includes(day?.id)}
                                      onCheckedChange={() =>
                                        handleWeekdayCheckboxChange(day?.id)
                                      }
                                    />
                                    <label
                                      htmlFor={day?.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {day?.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => {
                                  setCustomFrequency("daywise");
                                  setOpenDialogOne(false);
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={openDialogTwo}
                          onOpenChange={setOpenDialogTwo}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Nth Day of the Month
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Select a specific day of the month
                              </DialogTitle>
                              <DialogDescription>
                                Choose the specific day of the month from the
                                calendar below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Calendar
                                className="rounded-md  border shadow"
                                mode="single"
                                selected={nthDayOfMonth}
                                onSelect={setNthDayOfMonth}
                              />
                              <div className="grid grid-cols-4 items-center gap-4">
                                {nthDayOfMonthPayload?.weekWiseDay} --{" "}
                                {nthDayOfMonthPayload?.day}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => {
                                  setCustomFrequency("nthDayOfMonth");
                                  setOpenDialogTwo(false);
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={openDialogThree}
                          onOpenChange={setOpenDialogThree}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Based on N days/week/month/year
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Select an interval</DialogTitle>
                              <DialogDescription>
                                Choose an interval - every X
                                days/weeks/months/years
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Label
                                htmlFor="intervalType"
                                className="w-full md:w-2/5 text-center md:text-left"
                              >
                                Interval Type
                              </Label>
                              <Select
                                className="w-full md:w-3/5"
                                value={customRecurrenceIntervalType}
                                onValueChange={(e) =>
                                  setCustomRecurrenceIntervalType(e)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="weeks">Weeks</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                  <SelectItem value="years">Years</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-4 py-4">
                              <Label
                                htmlFor="intervalCount"
                                className="w-full md:w-2/5 text-center md:text-left"
                              >
                                Every N {customRecurrenceIntervalType}
                              </Label>
                              <Select
                                className="w-full md:w-3/5"
                                value={customRecurrenceInterval}
                                onValueChange={(e) =>
                                  setCustomRecurrenceInterval(e)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select N" />
                                </SelectTrigger>
                                <SelectContent>
                                  {customRecurrenceIntervalType === "days"
                                    ? Array.from(
                                        { length: 7 },
                                        (_, i) => i + 1
                                      ).map((day) => (
                                        <SelectItem key={day} value={day}>
                                          {day}
                                        </SelectItem>
                                      ))
                                    : customRecurrenceIntervalType === "months"
                                    ? Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                      ).map((month) => (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      ))
                                    : customRecurrenceIntervalType === "weeks"
                                    ? Array.from(
                                        { length: 4 },
                                        (_, i) => i + 1
                                      ).map((week) => (
                                        <SelectItem key={week} value={week}>
                                          {week}
                                        </SelectItem>
                                      ))
                                    : Array.from(
                                        { length: 100 },
                                        (_, i) => i + 1
                                      ).map((year) => (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => {
                                  setCustomFrequency("intervalBased");
                                  setOpenDialogThree(false);
                                }}
                              >
                                Save changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Label
                      htmlFor="eventType"
                      className="w-full md:w-2/5 text-center md:text-left"
                    >
                      {eventType === "recurring"
                        ? "Select Start & End Date"
                        : "Select Date"}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DatePickerComponent
                          date={date}
                          setDate={setDate}
                          eventType={eventType}
                          frequency={eventType === "regular" ? 1 : frequency}
                          setReminders={setReminders}
                          customFrequency={customFrequency}
                          daysOfWeek={daysOfWeek}
                          nthDayOfMonthPayload={nthDayOfMonthPayload}
                          intervalType={customRecurrenceIntervalType}
                          intervalValue={customRecurrenceInterval}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button type="submit">Create Event</Button>
                </form>
              </div>
            </CardContent>
          </fieldset>
          <Preview />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEvent;
