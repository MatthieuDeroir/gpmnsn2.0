// DatePickerComponent.js
import React from 'react';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import { addDays, subMonths, subYears, startOfYear, endOfYear, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaCalendarAlt } from 'react-icons/fa'; // Import de l'icône calendrier
import './LogsPage.css'; // Assurez-vous que les styles sont importés

const DatePickerComponent = ({ dateRange, setDateRange, showDatePicker, toggleDatePicker }) => {
  const customStaticRanges = createStaticRanges([
    { label: 'Aujourd\'hui', range: () => ({ startDate: new Date(), endDate: new Date() }) },
    { label: 'Depuis 6 heures', range: () => ({ startDate: addHours(new Date(), -6), endDate: new Date() }) },
    { label: 'Depuis 12 heures', range: () => ({ startDate: addHours(new Date(), -12), endDate: new Date() }) },
    { label: 'Hier', range: () => ({ startDate: addDays(new Date(), -1), endDate: addDays(new Date(), -1) }) },
    { label: 'Cette semaine', range: () => ({ startDate: addDays(new Date(), -new Date().getDay()), endDate: new Date() }) },
    { label: 'Semaine dernière', range: () => ({ startDate: addDays(new Date(), -7 - new Date().getDay()), endDate: addDays(new Date(), -new Date().getDay() - 1) }) },
    { label: 'Ce mois', range: () => ({ startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() }) },
    { label: 'Le mois dernier', range: () => ({ startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), endDate: new Date() }) },
    { label: 'Les 6 derniers mois', range: () => ({ startDate: subMonths(new Date(), 6), endDate: new Date() }) },
    { label: 'Depuis le début de l\'année', range: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
    { label: 'Depuis un an', range: () => ({ startDate: subYears(new Date(), 1), endDate: new Date() }) },
    { label: 'L\'année dernière', range: () => ({ startDate: startOfYear(subYears(new Date(), 1)), endDate: endOfYear(subYears(new Date(), 1)) }) }
  ]);

  return (
      <div className="date-picker-component">
        <button className="date-toggle-button" onClick={toggleDatePicker}>
          <FaCalendarAlt />
        </button>
        {showDatePicker && (
            <div className="date-picker-container">
              <DateRangePicker
                  onChange={(item) => setDateRange([item.selection])}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={dateRange}
                  direction="horizontal"
                  locale={fr}
                  staticRanges={customStaticRanges}
                  inputRanges={[]}
              />
            </div>
        )}
      </div>
  );
};

export default DatePickerComponent;
