import { uniqueNamesGenerator, NumberDictionary, colors, animals } from 'unique-names-generator';

export default function getUniqueName() {
  const numberDictionary = NumberDictionary.generate({ length: 3 });
  return uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    separator: '',
    style: 'capital'
  });
}
