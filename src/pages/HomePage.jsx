import React from 'react';
import RoadmapGrid from '../components/RoadmapGrid';

const HomePage = ({
  roadmap,
  onUploadRoadmap,
  onExportRoadmap,
  importError,
}) => {
  return (
    <main className="main">
      <section className="toolbar">
        <div className="file-controls">
          <label className="file-upload">
            <span>Импортировать карту (JSON)</span>
            <input
              type="file"
              accept="application/json"
              onChange={onUploadRoadmap}
            />
          </label>

          <button
            className="btn"
            onClick={onExportRoadmap}
            disabled={!roadmap}
          >
            Экспортировать с прогрессом
          </button>
        </div>

        {importError && <p className="error">{importError}</p>}
      </section>

      {!roadmap && (
        <p className="hint">
          Загрузите JSON-файл с дорожной картой, чтобы начать отслеживать
          прогресс.
        </p>
      )}

      {roadmap && (
        <>
          <section className="roadmap-info">
            <h2>{roadmap.title}</h2>
            {roadmap.description && <p>{roadmap.description}</p>}
          </section>

          <RoadmapGrid items={roadmap.items} />
        </>
      )}
    </main>
  );
};

export default HomePage;
