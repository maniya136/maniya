import React from 'react';
import { PastEventsCarousel } from '../PastEventsCarousel/PastEventsCarousel';
import './HomeSection.css';

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

const categories = [
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'From intimate ceremonies to grand destination weddings.',
  },
  {
    id: 'corporate',
    name: 'Corporate Parties',
    description: 'Offsites, launches and gala nights tailored for teams.',
  },
  {
    id: 'birthday',
    name: 'Birthday Parties',
    description: 'Stylish birthdays for kids, teens and adults.',
  },
  {
    id: 'food-festival',
    name: 'Food Festivals',
    description: 'Curated food experiences and pop-ups for all cuisines.',
  },
  {
    id: 'concert',
    name: 'Singing Concerts',
    description: 'Live music nights, concerts and intimate gigs.',
  },
];

export const HomeSection = ({ onBookNow, onExplorePast }) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  start.setDate(start.getDate() - 1);
  const end = new Date(today);
  end.setDate(end.getDate() + 2);

  const ongoingEvents = upcomingEvents.filter((ev) => {
    if (!ev.date) return false;
    const eventDate = new Date(ev.date);
    return eventDate >= start && eventDate <= end;
  });

  const listForHome = ongoingEvents.length > 0 ? ongoingEvents : upcomingEvents.slice(0, 3);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">EVENTS · WEDDINGS · FESTIVALS</p>
          <h1>Plan every celebration with Evenza.</h1>
          <p className="hero-subtitle">
            One modern workspace to discover events, book experiences and manage your entire guest journey.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onBookNow}>Book an upcoming event</button>
            <button className="ghost" onClick={onExplorePast}>Explore past events</button>
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-card wedding">Weddings</div>
          <div className="hero-card corporate">Corporate</div>
          <div className="hero-card birthday">Birthdays</div>
          <div className="hero-card food">Food festivals</div>
        </div>
      </section>

      <section className="section">
        <h2>Ongoing events</h2>
        <p className="section-subtitle">Events running now or in the next couple of days.</p>

        <div className="cards-grid">
          {listForHome.map((event) => (
            <article key={event.id} className="event-card ongoing">
              <div className="event-tag">{event.category}</div>
              <h3>{event.title}</h3>
              <p className="meta">
                {event.location} · {event.date} · {event.time}
              </p>
              <button className="small" onClick={() => onBookNow(event)}>
                View & book
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Upcoming events</h2>
        <p className="section-subtitle">Discover what's coming next and reserve your spot.</p>

        <div className="cards-grid">
          {upcomingEvents.slice(0, 6).map((event) => (
            <article key={event.id} className="event-card upcoming">
              <div className="event-tag">{event.category}</div>
              <h3>{event.title}</h3>
              <p className="meta">
                {event.location} · {event.date} · {event.time}
              </p>
              <button className="small" onClick={() => onBookNow(event)}>
                Book now
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Our past events</h2>
        <p className="section-subtitle">A glimpse into some of the celebrations we have already designed.</p>
        <PastEventsCarousel events={pastEvents} />
      </section>

      <section className="section">
        <h2>Categories of services</h2>
        <p className="section-subtitle">Choose how you want to celebrate. We handle the rest.</p>
        <div className="cards-grid categories-grid">
          {categories.map((cat) => (
            <article key={cat.id} className="category-card">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <button onClick={onExplorePast}>Explore past events</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
