import React, { useEffect } from "react";
import { Calendar } from "./ui/calendar";

const DatePickerComponent = ({
  date,
  setDate,
  eventType,
  frequency,
  setReminders,
  customFrequency,
  daysOfWeek,
  nthDayOfMonthPayload,
  intervalType,
  intervalValue,
}) => {
  useEffect(() => {
    let optionsToPass = {
      daysArray: daysOfWeek,
      week: nthDayOfMonthPayload?.weekWiseDay,
      day: nthDayOfMonthPayload?.day,
      intervalType: intervalType,
      intervalValue: intervalValue,
    };
    const generateReminders = (
      dateInput,
      frequency,
      customFrequency,
      options = {}
    ) => {
      const reminders = [];
      const weekDaysList = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      //  for non recurring events
      if (frequency === 1) {
        reminders.push(new Date(dateInput));
        return reminders;
      }

      if (frequency === "daily" && dateInput?.to) {
        let currentDate = new Date(dateInput?.from);
        let endDate = new Date(dateInput?.to);
        while (currentDate <= endDate) {
          reminders.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (frequency === "weekly" && dateInput?.to) {
        let currentDate = new Date(dateInput?.from);
        let endDate = new Date(dateInput?.to);
        while (currentDate <= endDate) {
          reminders.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else if (frequency === "monthly" && dateInput?.to) {
        let currentDate = new Date(dateInput?.from);
        let endDate = new Date(dateInput?.to);
        while (currentDate <= endDate) {
          reminders.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      } else if (frequency === "yearly" && dateInput?.to) {
        let currentDate = new Date(dateInput?.from);
        let endDate = new Date(dateInput?.to);
        while (currentDate <= endDate) {
          reminders.push(new Date(currentDate));
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
      } else if (frequency === "custom" && dateInput?.to) {
        if (customFrequency === "daywise") {
          let currentDate = new Date(dateInput?.from);
          let endDate = new Date(dateInput?.to);
          const { daysArray } = options;
          //within the date range, need to check if the current date's day is included in the daysArray --> if thats the case then add it in the reminder
          while (currentDate <= endDate) {
            let currentDay = currentDate?.getDay();

            if (daysArray.includes(String(currentDay))) {
              reminders.push(new Date(currentDate));
            }
            //increament the day for next iteration
            currentDate.setDate(currentDate.getDate() + 1);
          }
        } else if (customFrequency === "nthDayOfMonth") {
          let currentDate = new Date(dateInput?.from);
          let endDate = new Date(dateInput?.to);
          const { week, day } = options;
          //set a reminder on Nth day of Nth week - where I have the week and day
          //within the date range, need to check if the currentDay is same as day in option and if it falls in the same week as in option

          while (currentDate <= endDate) {
            const currentMonth = currentDate.getMonth();
            // let firstDayOfMonth = new Date(
            //   currentDate.getFullYear(),
            //   currentDate.getMonth(),
            //   1
            // ); // 1st day of the month -> for example friday (5)

            // let offset = ((7 + weekDaysList[day] - firstDayOfMonth) % 7) + 1; //this gives the first time our day (friday in this case) occurs in the month - 5th ---> this will be week 1
            let currentWeek = 1;
            for (let d = 1; d <= 31; d++) {
              let tempDate = new Date(
                currentDate.getFullYear(),
                currentMonth,
                d
              );

              // Check if tempDate falls within the same month
              if (tempDate.getMonth() !== currentMonth) {
                break; // Break the loop if the day goes beyond the current month
              }

              //if the day of the current iteration matches the day in option -> then check week
              if (tempDate.getDay() === weekDaysList[day]) {
                if (week === currentWeek) {
                  reminders.push(new Date(tempDate));
                  break;
                }
                currentWeek++;
              }
            }
            // Move to the next month
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(1); // Reset the day to the 1st of the new month
          }
        } else if (customFrequency === "intervalBased") {
          //every X days or X weeks or X months or X years
          // X days --> start reminder current day and then push reminder after X days
          let currentDate = new Date(dateInput?.from);
          let endDate = new Date(dateInput?.to);
          if (intervalType === "days") {
            while (currentDate <= endDate) {
              reminders.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + intervalValue); //increament the loop by day
            }
          } else if (intervalType === "weeks") {
            while (currentDate <= endDate) {
              reminders.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + intervalValue * 7);
            }
          } else if (intervalType === "months") {
            while (currentDate <= endDate) {
              reminders.push(new Date(currentDate));
              currentDate.setMonth(currentDate.getMonth() + intervalValue);
            }
          } else if (intervalType === "years") {
            while (currentDate <= endDate) {
              reminders.push(new Date(currentDate));
              currentDate.setFullYear(
                currentDate.getFullYear() + intervalValue
              );
            }
          }
        }
      }

      console.log(reminders, "final reminders");
      return reminders;
    };
    frequency &&
      setReminders(
        generateReminders(date, frequency, customFrequency, optionsToPass)
      );
  }, [
    frequency,
    date,
    setReminders,
    customFrequency,
    daysOfWeek,
    intervalType,
    intervalValue,
    nthDayOfMonthPayload,
  ]);

  useEffect(() => {
    let optionsToPass = {
      daysArray: daysOfWeek,
      week: nthDayOfMonthPayload?.weekWiseDay,
      day: nthDayOfMonthPayload?.day,
      intervalType: intervalType,
      intervalValue: intervalValue,
    };
    if (customFrequency) {
      console.log(
        date,
        frequency,
        customFrequency,
        optionsToPass,
        "sample payload"
      );
    }
  }, [
    frequency,
    date,
    setReminders,
    customFrequency,
    daysOfWeek,
    intervalType,
    intervalValue,
    nthDayOfMonthPayload,
  ]);
  return (
    <Calendar
      initialFocus
      mode={eventType === "recurring" ? "range" : "single"}
      defaultMonth={date?.from}
      selected={date}
      onSelect={setDate}
      numberOfMonths={eventType === "recurring" ? 2 : 1}
    />
  );
};

export default DatePickerComponent;
