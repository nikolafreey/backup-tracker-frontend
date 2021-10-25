import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridDay from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import usePortal from "react-cool-portal";

let scheduledEvents = JSON.parse(localStorage.getItem("events")) || [
  {
    title: "event 1",
    start: "2021-10-11",
    end: "2021-10-13",
    allDay: false,
  },
  { title: "event 2", date: "2021-10-12" },
];

const DemoApp = () => {
  const { Portal } = usePortal();
  const [scheduledEventsArray, setScheduledEventsArray] =
    useState(scheduledEvents);

  const handleDateClick = (event) => {
    console.log(`dateClick`, event);
    let title = window.prompt("Unesite ime Event-a: ");

    scheduledEvents.push(
      event.hasOwnProperty("dateStr")
        ? {
            title,
            date: event.dateStr,
            allDay: event.allDay,
          }
        : {
            title,
            date: event.hasOwnProperty("dateStr")
              ? event.dateStr
              : event.hasOwnProperty("startStr")
              ? event.startStr
              : null,
            end: event.hasOwnProperty("endStr") ? event.endStr : null,
            allDay: event.hasOwnProperty("startStr") ? false : event.allDay,
          }
    );
    setScheduledEventsArray(scheduledEvents);
    localStorage.setItem("events", JSON.stringify(scheduledEventsArray));
    console.log(scheduledEventsArray);
  };

  const select = (event) => {
    console.log(`eventClick`, event);
    scheduledEvents.push({
      title: "event 3",
      start: event.hasOwnProperty("dateStr")
        ? event.dateStr
        : event.hasOwnProperty("startStr")
        ? event.startStr
        : null,
      end: event.hasOwnProperty("endStr") ? event.endStr : null,
      allDay: event.hasOwnProperty("startStr") ? false : event.allDay,
    });
    setScheduledEventsArray(scheduledEvents);
    localStorage.setItem("events", JSON.stringify(scheduledEventsArray));
    console.log(scheduledEventsArray);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridDay]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        initialView="dayGridMonth"
        weekends
        events={scheduledEventsArray}
        eventClick={(info) => {
          info.jsEvent.preventDefault(); // don't let the browser navigate
          console.log(`info`, info);

          if (info.event.url) {
            window.open(info.event.url);
          }
        }}
        eventMouseEnter={(Info) => console.log("Info ", Info)}
        selectable
        selectMirror
        unselectAuto
        selectOverlap
        select={select}
        dateClick={handleDateClick}
      />
      <Portal>
        <p>
          Wow! I am rendered outside the DOM hierarchy of my parent component.
        </p>
      </Portal>
    </>
  );
};

export default DemoApp;
