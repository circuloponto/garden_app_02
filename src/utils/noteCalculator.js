// Array of notes with flat notation (used consistently throughout)
const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];



// Map of interval semitones
const intervalMap = {
  '0': 0,
  '1': 1,
  '2': 2,
  'b3': 3,
  '3': 4,
  '4': 5,
  'b5': 6,
  '5': 7,
  '#5': 8,
  '6': 9,
  'b7': 10,
  '7': 11
};

// Function to get the index of a note
export const getNoteIndex = (note) => {
  const normalizedNote = note.charAt(0).toUpperCase() + note.slice(1);
  return flatNotes.indexOf(normalizedNote);
};

// Function to calculate notes from a root and intervals
export const calculateChordNotes = (root, intervals) => {
  const rootIndex = getNoteIndex(root);
  
  if (rootIndex === -1) {
    console.error(`Invalid root note: ${root}`);
    return [];
  }
  
  return intervals.map(interval => {
    const semitones = intervalMap[interval];
    if (semitones === undefined) {
      console.error(`Invalid interval: ${interval}`);
      return null;
    }
    const noteIndex = (rootIndex + semitones) % 12;
    return flatNotes[noteIndex];
  }).filter(note => note !== null);
};

// Function to get the full chord name with root
export const getFullChordName = (root, chordName) => {
  return `${root}${chordName}`;
};

// Function to find a chord type by className
export const findChordTypeByClassName = (chordTypes, className) => {
  return chordTypes.find(chord => chord.className === className);
};

// Function to get the offset root note
export const getOffsetRoot = (root, offset) => {
  if (!offset) {
    return root;
  }
  
  // Get the index of the root note
  const rootIndex = getNoteIndex(root);
  if (rootIndex === -1) {
    return root;
  }
  
  // Calculate the new index with the offset
  const newIndex = (rootIndex + offset + 12) % 12; // Add 12 to handle negative offsets
  return flatNotes[newIndex];
};

// Function to get the root offset for a chord pair
export const getRootOffset = (chordRootOffsets, firstChord, secondChord) => {
  const key = `${firstChord}_${secondChord}`;
  return chordRootOffsets[key] || 0; // Default to 0 if no offset is defined
};
