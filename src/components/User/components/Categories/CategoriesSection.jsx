import React from 'react';
import './CategoriesSection.css';

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

export const CategoriesSection = () => {
  return (
    <main className="page">
      <section className="section">
        <h2>Categories</h2>
        <p className="section-subtitle">Events we specialise in across India.</p>
        <div className="cards-grid categories-grid">
          {categories.map((cat) => (
            <article key={cat.id} className="category-card">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <button className="outline">Explore past events</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
