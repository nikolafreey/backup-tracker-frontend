import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridDay from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import "./styles.scss";
import useModal from "./useModal";

let scheduledEvents =
  localStorage.getItem("events") != null
    ? JSON.parse(decodeURI(localStorage.getItem("events")))
    : [
        {
          title: "event 1",
          start: "2021-10-11",
          end: "2021-10-13",
          allDay: false,
        },
        { title: "event 2", date: "2021-10-12" },
      ];

const DemoApp = () => {
  const { Modal, show, hide, isShow } = useModal();

  const [scheduledEventsArray, setScheduledEventsArray] =
    useState(scheduledEvents);
  const [currentEvent, setCurrentEvent] = useState({});

  const handleDateClick = (event) => {
    console.log(`dateClick`, event);
    let title = window.prompt("Unesite ime Event-a: ");
    console.log(`title: `, title);

    if (title && title.trim().length !== 0) {
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
      localStorage.setItem(
        "events",
        encodeURI(JSON.stringify(scheduledEventsArray))
      );
      console.log(scheduledEventsArray);
    }
  };

  const select = (event) => {
    console.log(`eventClick`, event);
    // scheduledEvents.push({
    //   title: "event 3",
    //   start: event.hasOwnProperty("dateStr")
    //     ? event.dateStr
    //     : event.hasOwnProperty("startStr")
    //     ? event.startStr
    //     : null,
    //   end: event.hasOwnProperty("endStr") ? event.endStr : null,
    //   allDay: event.hasOwnProperty("startStr") ? false : event.allDay,
    // });
    // setScheduledEventsArray(scheduledEvents);
    // localStorage.setItem(
    //   "events",
    //   encodeURI(JSON.stringify(scheduledEventsArray))
    // );
    console.log(scheduledEventsArray);
  };

  const editEvent = () => {};

  const deleteEvent = () => {
    let events = JSON.parse(decodeURI(localStorage.getItem("events")));
    if (!events) events = scheduledEventsArray;
    let eventTitles = events.map((e) => e.title);
    console.log(`currentEvent`, currentEvent);
    console.log("deleteEvent", eventTitles.indexOf(currentEvent));

    const index = events.map((event) => event.title).indexOf(currentEvent);
    if (index > -1) {
      events.splice(index, 1);
      setScheduledEventsArray(events);
      localStorage.setItem("events", encodeURI(JSON.stringify(events)));
      console.log(events);
    }
  };

  return (
    <>
      <div style={{ marginTop: "100px" }}>
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
            show();
            setCurrentEvent(info.event._def.title);
            document.documentElement.scrollTop = 0;

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
      </div>
      <Modal isShow={isShow}>
        <div
          className="modal-dialog"
          role="dialog"
          aria-labelledby="modal-label"
          aria-modal="true"
        >
          <div className="modal-header" onClick={hide}>
            <h5 id="modal-label" className="modal-title">
              <span role="img" aria-label="Hello">
                👋🏻
              </span>{" "}
              Da li zelite da izmjenite ili obrisete Event?
            </h5>
            <button
              className="modal-close"
              onClick={hide}
              type="button"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Mozete zatvoriti modal pritiskom na &quot;ESC&quot; dugme.</p>
            <button className="btn" onClick={editEvent} type="button">
              Izmjeni
            </button>
            <button className="btn" onClick={deleteEvent} type="button">
              Obrisi
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DemoApp;
