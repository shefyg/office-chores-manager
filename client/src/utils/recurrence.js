import { isSameDay, parseDate, addDays, addMonths } from './dateUtils';

export function expandRecurrence(chore, startDate, endDate) {
  const occurrences = [];
  const choreStartDate = parseDate(chore.dueDate);

  // If no recurrence, just check if the single date falls within range
  if (!chore.recurrence) {
    if (choreStartDate >= startDate && choreStartDate <= endDate) {
      if (isSameDay(choreStartDate, startDate) || isSameDay(choreStartDate, endDate) ||
          (choreStartDate > startDate && choreStartDate < endDate)) {
        occurrences.push(choreStartDate);
      }
    }
    // For single day view, check if same day
    if (isSameDay(startDate, endDate) && isSameDay(choreStartDate, startDate)) {
      return [choreStartDate];
    }
    if (!chore.recurrence) {
      if (isSameDay(choreStartDate, startDate)) {
        return [choreStartDate];
      }
      return [];
    }
  }

  const { type, daysOfWeek } = chore.recurrence;

  // Generate occurrences based on recurrence type
  let currentDate = new Date(choreStartDate);

  // Don't go back more than a year
  const minDate = new Date(startDate);
  minDate.setFullYear(minDate.getFullYear() - 1);

  // Adjust start date if it's after the range
  if (currentDate > endDate) {
    return [];
  }

  // Move to start of range if chore starts before
  if (currentDate < startDate) {
    if (type === 'daily') {
      const daysDiff = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
      currentDate = addDays(currentDate, daysDiff);
    } else if (type === 'weekly') {
      while (currentDate < startDate) {
        currentDate = addDays(currentDate, 7);
      }
      // Adjust back if we went too far
      currentDate = addDays(currentDate, -7);
    } else if (type === 'monthly') {
      while (currentDate < startDate) {
        currentDate = addMonths(currentDate, 1);
      }
      currentDate = addMonths(currentDate, -1);
    }
  }

  // Generate occurrences
  const maxIterations = 400; // Safety limit
  let iterations = 0;

  while (currentDate <= endDate && iterations < maxIterations) {
    iterations++;

    if (currentDate >= startDate && currentDate >= choreStartDate) {
      if (type === 'daily') {
        occurrences.push(new Date(currentDate));
      } else if (type === 'weekly') {
        if (daysOfWeek && daysOfWeek.includes(currentDate.getDay())) {
          occurrences.push(new Date(currentDate));
        } else if (!daysOfWeek) {
          occurrences.push(new Date(currentDate));
        }
      } else if (type === 'monthly') {
        if (currentDate.getDate() === choreStartDate.getDate()) {
          occurrences.push(new Date(currentDate));
        }
      }
    }

    // Advance to next potential occurrence
    if (type === 'daily') {
      currentDate = addDays(currentDate, 1);
    } else if (type === 'weekly') {
      currentDate = addDays(currentDate, 1);
    } else if (type === 'monthly') {
      currentDate = addDays(currentDate, 1);
    }
  }

  return occurrences;
}
