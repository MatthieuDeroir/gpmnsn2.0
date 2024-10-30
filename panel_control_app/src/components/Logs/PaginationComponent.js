// PaginationComponent.js
import React from 'react';

const PaginationComponent = ({ page, setPage, totalPages, fetchLogs }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Nombre maximum de pages à afficher dans la pagination
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={() => { setPage(1); fetchLogs(); }} disabled={page === 1}>
        Début
      </button>

      <button onClick={() => { setPage(page - 1); fetchLogs(); }} disabled={page === 1}>
        Précédent
      </button>

      {startPage > 1 && <span>...</span>}

      {pageNumbers.map((num) => (
        <button 
          key={num} 
          onClick={() => { setPage(num); fetchLogs(); }}
          className={num === page ? 'active' : ''}
        >
          {num}
        </button>
      ))}

      {endPage < totalPages && <span>...</span>}

      <button onClick={() => { setPage(page + 1); fetchLogs(); }} disabled={page === totalPages}>
        Suivant
      </button>

      <button onClick={() => { setPage(totalPages); fetchLogs(); }} disabled={page === totalPages}>
        Fin
      </button>
    </div>
  );
};

export default PaginationComponent;
