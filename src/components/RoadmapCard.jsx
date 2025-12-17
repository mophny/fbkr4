import React from 'react';
import { Link } from 'react-router-dom';

const statusLabelMap = {
  not_started: 'Не начат',
  in_progress: 'В работе',
  done: 'Выполнено',
};

const statusClassMap = {
  not_started: 'card--status-not-started',
  in_progress: 'card--status-in-progress',
  done: 'card--status-done',
};

const RoadmapCard = ({ item }) => {
  const statusLabel = statusLabelMap[item.status] || statusLabelMap.not_started;
  const statusClass =
    statusClassMap[item.status] || statusClassMap.not_started;

  const shortDescription =
    item.description && item.description.length > 120
      ? item.description.slice(0, 117) + '...'
      : item.description;

  return (
    <article className={`card ${statusClass}`}>
      <header className="card__header">
        <h3 className="card__title">{item.title}</h3>
        <span className="card__status-badge">{statusLabel}</span>
      </header>

      {shortDescription && (
        <p className="card__description">{shortDescription}</p>
      )}

      <footer className="card__footer">
        {item.dueDate && (
          <span className="card__due-date">
            Дедлайн: {item.dueDate}
          </span>
        )}

        <Link
          className="card__link"
          to={`/item/${encodeURIComponent(item.id)}`}
        >
          Открыть
        </Link>
      </footer>
    </article>
  );
};

export default RoadmapCard;
