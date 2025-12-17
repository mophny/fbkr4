import React from 'react';
import RoadmapCard from './RoadmapCard';

const RoadmapGrid = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="hint">В этой дорожной карте пока нет пунктов.</p>;
  }

  return (
    <section className="grid">
      {items.map((item) => (
        <RoadmapCard key={item.id} item={item} />
      ))}
    </section>
  );
};

export default RoadmapGrid;
