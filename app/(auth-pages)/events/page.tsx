"use client";
import React, { useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./events.css";
import Link from "next/link";
import { motion } from "framer-motion";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const dummyEvents = [
  {
    title: "Mock Test: Foundation Accounts",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
  },
  {
    title: "Live Session: CA Inter Taxation",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    title: "Webinar: Articleship Guidance",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
  },
  {
    title: "Group Study: CA Final SFM",
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];

const EventsPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      <main className="container py-12 md:py-20 flex-shrink-0">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">
              Upcoming <span className="text-gradient-blue">Events</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-primary-foreground/70">
              Stay updated with the latest mock tests, live sessions, and webinars.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-card p-4 md:p-8 h-[700px] max-h-[80vh] overflow-hidden mt-12"
        >
          <Calendar
            localizer={localizer}
            events={dummyEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            className="font-sans text-foreground custom-calendar"
            views={['month', 'week', 'day', 'agenda']}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default EventsPage;
