import { uniqueNamesGenerator, NumberDictionary, colors, animals } from 'unique-names-generator';

const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });

export default function getUniqueName() {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    separator: '',
    style: 'capital'
  });
}
