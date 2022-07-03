export const formatSeries = (data) => (data || []).map(point => {
  const { confirmed: value, added_at: dateStr } = point;
  return { value, date: (+new Date(dateStr)) };
});
