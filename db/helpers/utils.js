exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.compareDates = (a, b) => {
  //creating comparison function
  if (Date.parse(a) > Date.parse(b)) {
    return 1;
  }
  if (Date.parse(b) > Date.parse(a)) {
    return -1;
  }

  return 0;
};
