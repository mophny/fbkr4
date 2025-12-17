import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: 'not_started', label: 'Не начат' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполнено' },
];

const ItemDetail = ({ roadmap, onUpdateItem }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const item = useMemo(() => {
    if (!roadmap || !roadmap.items) return null;
    const decodedId = decodeURIComponent(itemId);
    return roadmap.items.find((i) => String(i.id) === decodedId);
  }, [roadmap, itemId]);

  const [localStatus, setLocalStatus] = useState('not_started');
  const [localDueDate, setLocalDueDate] = useState('');
  const [localNote, setLocalNote] = useState('');

  useEffect(() => {
    if (item) {
      setLocalStatus(item.status || 'not_started');
      setLocalDueDate(item.dueDate || '');
      setLocalNote(item.note || '');
    }
  }, [item]);

  if (!roadmap) {
    return (
      <main className="main">
        <p className="hint">
          Сначала импортируйте дорожную карту на главной странице.
        </p>
        <Link to="/" className="btn">
          На главную
        </Link>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="main">
        <p className="error">Пункт с таким идентификатором не найден.</p>
        <Link to="/" className="btn">
          На главную
        </Link>
      </main>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateItem(item.id, {
      status: localStatus,
      dueDate: localDueDate,
      note: localNote,
    });
  };

  return (
    <main className="main">
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      <section className="detail">
        <h2 className="detail__title">{item.title}</h2>

        {item.description && (
          <p className="detail__description">{item.description}</p>
        )}

        {item.link && (
          <p className="detail__link">
            Полезная ссылка:{' '}
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.link}
            </a>
          </p>
        )}

        <form className="detail__form" onSubmit={handleSave}>
          <div className="form-row">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="dueDate">Желаемая дата завершения</label>
            <input
              id="dueDate"
              type="date"
              value={localDueDate}
              onChange={(e) => setLocalDueDate(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="note">Заметка</label>
            <textarea
              id="note"
              rows="6"
              placeholder="Ваши мысли, конспект, полезные команды..."
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              Сохранить изменения
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ItemDetail;
