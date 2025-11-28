import React, { useState } from 'react';
import { PastEventsCarousel } from '../PastEventsCarousel/PastEventsCarousel';
import './PastEventsSection.css';

const pastEvents = [
  {
    id: 1,
    title: 'Luxe Beachfront Wedding',
    category: 'Wedding',
    location: 'Goa',
    vendor: 'Seaside Planners',
    coverImage: 'https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Corporate Annual Gala',
    category: 'Corporate Party',
    location: 'Mumbai',
    vendor: 'Elite Corporate Events',
    coverImage: 'https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'City Food Festival',
    category: 'Food Festival',
    location: 'Pune',
    vendor: 'Taste Street Collective',
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    title: 'Kids Carnival Birthday',
    category: 'Birthday Party',
    location: 'Ahmedabad',
    vendor: 'Happy Days Studio',
    coverImage: 'https://images.pexels.com/photos/36029/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const PastEventsSection = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [location, setLocation] = useState('');

  const uniqueCategories = [...new Set(pastEvents.map((ev) => ev.category))];
  const uniqueVendors = [...new Set(pastEvents.map((ev) => ev.vendor))];
  const uniqueLocations = [...new Set(pastEvents.map((ev) => ev.location))];

  const filtered = pastEvents.filter((ev) => {
    const matchesName = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? ev.category === category : true;
    const matchesVendor = vendor ? ev.vendor === vendor : true;
    const matchesLocation = location ? ev.location === location : true;
    return matchesName && matchesCategory && matchesVendor && matchesLocation;
  });

  return (
    <main className="page">
      <section className="section">
        <h2>Past events</h2>
        <p className="section-subtitle">Browse all events Evenza has already created and open their galleries.</p>

        <div className="filters">
          <input
            className="filter-input"
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          <select
            className="filter-input"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          >
            <option value="">All vendors</option>
            {uniqueVendors.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
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
        </div>

        <PastEventsCarousel events={filtered} />
      </section>
    </main>
  );
};
