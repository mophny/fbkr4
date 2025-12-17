import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import ItemDetail from './pages/ItemDetail';
import ProgressBar from './components/ProgressBar';

import './App.css';

const STORAGE_KEY = 'roadmap-tracker-data';

// Нормализация структуры дорожной карты из JSON
const normalizeRoadmap = (raw) => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Файл не содержит объект дорожной карты.');
  }

  const title = raw.title;
  const description = raw.description || '';
  const items = raw.items;

  if (!title || !Array.isArray(items)) {
    throw new Error(
      'Ожидались поля "title" (строка) и "items" (массив) в корне JSON.'
    );
  }

  const normalizedItems = items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Элемент дорожной карты имеет неверный формат.');
    }

    const id = item.id != null ? String(item.id) : String(index);
    const itemTitle = item.title || `Пункт ${index + 1}`;

    return {
      ...item,
      id,
      title: itemTitle,
      description: item.description || '',
      status: item.status || 'not_started', // not_started | in_progress | done
      note: item.note || '',
      dueDate: item.dueDate || '',
    };
  });

  return {
    title,
    description,
    items: normalizedItems,
  };
};

// Расчёт процента прогресса (по статусам "done")
const calculateProgress = (roadmap) => {
  if (!roadmap || !Array.isArray(roadmap.items) || roadmap.items.length === 0) {
    return 0;
  }
  const total = roadmap.items.length;
  const doneCount = roadmap.items.filter((i) => i.status === 'done').length;
  return Math.round((doneCount / total) * 100);
};

function App() {
  const [roadmap, setRoadmap] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [importError, setImportError] = useState('');

  // Сохранение в localStorage при каждом изменении карты
  useEffect(() => {
    if (!roadmap) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
  }, [roadmap]);

  // Импорт дорожной карты из JSON-файла
  const handleUploadRoadmap = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type && file.type !== 'application/json') {
      setImportError('Ожидался JSON-файл с дорожной картой.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const normalized = normalizeRoadmap(parsed);
        setRoadmap(normalized);
        setImportError('');
      } catch (err) {
        console.error(err);
        setImportError(
          'Не удалось прочитать файл. Проверьте, что это корректный JSON с полями title, description и items[].'
        );
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка чтения файла.');
    };

    reader.readAsText(file, 'utf-8');
  }, []);

  // Экспорт текущего состояния (с заметками, статусами и дедлайнами) в JSON
  const handleExportRoadmap = useCallback(() => {
    if (!roadmap) return;

    const dataStr = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const fileNameSlug = (roadmap.title || 'roadmap')
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNameSlug || 'roadmap'}-with-progress.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [roadmap]);

  // Обновление отдельного пункта (заметки, статус, дедлайн)
  const handleUpdateItem = useCallback((itemId, updates) => {
    setRoadmap((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items.map((item) =>
        String(item.id) === String(itemId) ? { ...item, ...updates } : item
      );
      return { ...prev, items: updatedItems };
    });
  }, []);

  const progress = calculateProgress(roadmap);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div>
            <h1 className="header__title">Трекер освоения технологий</h1>
            <p className="header__subtitle">
              Импортируйте дорожную карту (JSON), отмечайте прогресс, добавляйте
              заметки и сроки.
            </p>
          </div>
          <div className="header__progress">
            <span className="header__progress-label">
              Общий прогресс: {progress}%
            </span>
            <ProgressBar value={progress} />
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                roadmap={roadmap}
                onUploadRoadmap={handleUploadRoadmap}
                onExportRoadmap={handleExportRoadmap}
                importError={importError}
              />
            }
          />
          <Route
            path="/item/:itemId"
            element={
              <ItemDetail
                roadmap={roadmap}
                onUpdateItem={handleUpdateItem}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <footer className="footer">
          <p>Ожидаемый минимальный формат входного JSON:</p>
          <pre className="footer__json-example">
{`{
  "title": "React Roadmap",
  "description": "Краткое описание карты",
  "items": [
    {
      "id": "jsx",
      "title": "JSX",
      "description": "Основы JSX",
      "link": "https://..."
    }
  ]
}`}
          </pre>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
