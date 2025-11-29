import React, { useState } from 'react';
import './UpcomingEventsSection.css';

const upcomingEvents = [
  {
    id: 101,
    title: 'Monsoon Wedding Special',
    category: 'Wedding',
    location: 'Mumbai',
    date: '2025-07-15',
    time: '18:30',
  },
  {
    id: 102,
    title: 'Startup Founders Summit',
    category: 'Corporate Party',
    location: 'Bengaluru',
    date: '2025-08-02',
    time: '10:00',
  },
  {
    id: 103,
    title: 'Street Food Fiesta',
    category: 'Food Festival',
    location: 'Delhi',
    date: '2025-09-11',
    time: '16:00',
  },
  {
    id: 104,
    title: 'Open-Air Birthday Carnival',
    category: 'Birthday Party',
    location: 'Pune',
    date: '2025-06-01',
    time: '15:30',
  },
  {
    id: 105,
    title: 'Sufi Night Concert',
    category: 'Singing Concert',
    location: 'Jaipur',
    date: '2025-10-05',
    time: '20:00',
  },
];

export const UpcomingEventsSection = ({ onBookNow }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = upcomingEvents.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesLocationSelect = location ? ev.location === location : true;
    const matchesLocationText = locationSearch
      ? ev.location.toLowerCase().includes(locationSearch.toLowerCase())
      : true;
    const matchesCategory = category ? ev.category === category : true;
    return matchesSearch && matchesLocationSelect && matchesLocationText && matchesCategory;
  });

  const uniqueLocations = [...new Set(upcomingEvents.map((ev) => ev.location))];
  const uniqueCategories = [...new Set(upcomingEvents.map((ev) => ev.category))];

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Upcoming events</h2>
            <p className="section-subtitle">Discover what is happening next and reserve your spot.</p>
          </div>
        </div>

        <div className="filters">
          <input
            className="filter-input"
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="filter-input"
            placeholder="Search by location"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
          <select
            className="filter-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            className="filter-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="cards-grid">
          {filtered.map((event) => (
            <article key={event.id} className="event-card upcoming">
              <div className="event-tag">{event.category}</div>
              <h3>{event.title}</h3>
              <p className="meta">{event.location} · {event.date} · {event.time}</p>
              <button className="small" onClick={() => onBookNow(event)}>Book now</button>
            </article>
          ))}
          {filtered.length === 0 && <p>No events match your filters yet.</p>}
        </div>
      </section>
    </main>
  );
};
