import { remove } from 'diacritics';
import FuzzySet from 'fuzzyset';

const checkArtistName = ({ artistName, msg }) => {
  let checkA = cleanInput(artistName);
  let checkU = cleanInput(msg);

  const ref = FuzzySet([checkA]);
  const refResult = ref.get(checkU);

  if (!refResult || !refResult[0] || !refResult[0][0]) {
    return false;
  }

  const probability = refResult[0][0];

  return probability >= 0.9;
};

const checkTrackName = ({ trackName, msg }) => {
  let checkT = cleanInput(trackName);
  let checkU = cleanInput(msg);

  const ref = FuzzySet([checkT]);
  const refResult = ref.get(checkU);

  if (!refResult || !refResult[0] || !refResult[0][0]) {
    return false;
  }

  const probability = refResult[0][0];

  return probability >= 0.9;
};

const cleanInput = (str) => {
  str = str.toLowerCase().trim();
  str = str.replace(/\s{2,}/g, " ");
  str = str.replace(/(\'|\.|\*|\(|\))/g, " ");
  str = remove(str);
  str = str.trim();

  return str;
};

export { checkArtistName, checkTrackName };
