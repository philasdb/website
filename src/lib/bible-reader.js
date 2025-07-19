/**
 * Bible Reader - Local Bible API replacement for Astro projects
 * Reads from local OSIS XML file to avoid 429 API rate limit errors
 */

import { readFileSync } from 'fs';
import { DOMParser } from '@xmldom/xmldom';

class BibleReader {
  constructor(osisFilePath) {
    this.osisFilePath = osisFilePath;
    this.dom = null;
    this.bookAbbreviations = {
      'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
      'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
      '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
      'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
      'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
      'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
      'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
      'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
      'Zech': 'Zechariah', 'Mal': 'Malachi', 'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke',
      'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
      'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
      '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy',
      'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter',
      '2Pet': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude',
      'Rev': 'Revelation'
    };
    this.loadXML();
  }

  loadXML() {
    try {
      const xmlContent = readFileSync(this.osisFilePath, 'utf8');
      const parser = new DOMParser();
      this.dom = parser.parseFromString(xmlContent, 'text/xml');
    } catch (error) {
      throw new Error(`Failed to load XML file: ${error.message}`);
    }
  }

  // Clean verse text by removing XML tags and normalizing whitespace
  cleanVerseText(text) {
    return text
      .replace(/<[^>]*>/g, '') // Remove XML tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  }

  // Get a specific verse
  getVerse(book, chapter, verse) {
    try {
      const osisID = `${book}.${chapter}.${verse}`;
      const verseElements = this.dom.getElementsByTagName('verse');
      
      for (let i = 0; i < verseElements.length; i++) {
        const element = verseElements[i];
        if (element.getAttribute('osisID') === osisID) {
          const parent = element.parentNode;
          let text = '';
          
          // Get text content from the verse element and its siblings until next verse
          let currentNode = element;
          while (currentNode && currentNode.nodeType !== undefined) {
            if (currentNode.nodeType === 3) { // Text node
              text += currentNode.nodeValue;
            } else if (currentNode.nodeType === 1) { // Element node
              if (currentNode.tagName === 'verse' && currentNode.getAttribute('eID')) {
                break; // End of verse
              }
              text += currentNode.textContent || '';
            }
            currentNode = currentNode.nextSibling;
          }
          
          return {
            book_id: book,
            book_name: this.bookAbbreviations[book] || book,
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            text: this.cleanVerseText(text)
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting verse:', error);
      return null;
    }
  }

  // Get all verses from a chapter
  getChapter(book, chapter) {
    try {
      const verses = [];
      const verseElements = this.dom.getElementsByTagName('verse');
      
      for (let i = 0; i < verseElements.length; i++) {
        const element = verseElements[i];
        const osisID = element.getAttribute('osisID');
        
        if (osisID && osisID.startsWith(`${book}.${chapter}.`)) {
          const verseNum = osisID.split('.')[2];
          const verse = this.getVerse(book, chapter, verseNum);
          if (verse) {
            verses.push(verse);
          }
        }
      }
      
      return verses.sort((a, b) => a.verse - b.verse);
    } catch (error) {
      console.error('Error getting chapter:', error);
      return [];
    }
  }

  // Get a range of verses (e.g., John 3:16-18)
  getVerseRange(book, chapter, startVerse, endVerse) {
    try {
      const verses = [];
      for (let v = startVerse; v <= endVerse; v++) {
        const verse = this.getVerse(book, chapter, v);
        if (verse) {
          verses.push(verse);
        }
      }
      return verses;
    } catch (error) {
      console.error('Error getting verse range:', error);
      return [];
    }
  }

  // Parse a reference string like "John 3:16" or "John 3:16-18" or "2 Timothy 3:16-17"
  parseReference(ref) {
    // Handle multi-word book names like "2 Timothy", "1 Corinthians", etc.
    const match = ref.match(/^([1-3]?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) {
      throw new Error(`Invalid reference format: ${ref}`);
    }
    
    const [, bookName, chapter, startVerse, endVerse] = match;
    
    // Convert full book name to abbreviation
    const book = this.convertBookNameToAbbreviation(bookName.trim());
    
    return {
      book,
      chapter: parseInt(chapter),
      startVerse: parseInt(startVerse),
      endVerse: endVerse ? parseInt(endVerse) : parseInt(startVerse)
    };
  }

  // Convert full book name to OSIS abbreviation
  convertBookNameToAbbreviation(fullName) {
    const bookMap = {
      'Genesis': 'Gen', 'Exodus': 'Exod', 'Leviticus': 'Lev', 'Numbers': 'Num', 'Deuteronomy': 'Deut',
      'Joshua': 'Josh', 'Judges': 'Judg', 'Ruth': 'Ruth', '1 Samuel': '1Sam', '2 Samuel': '2Sam',
      '1 Kings': '1Kgs', '2 Kings': '2Kgs', '1 Chronicles': '1Chr', '2 Chronicles': '2Chr',
      'Ezra': 'Ezra', 'Nehemiah': 'Neh', 'Esther': 'Esth', 'Job': 'Job', 'Psalms': 'Ps', 'Psalm': 'Ps',
      'Proverbs': 'Prov', 'Ecclesiastes': 'Eccl', 'Song of Solomon': 'Song', 'Isaiah': 'Isa',
      'Jeremiah': 'Jer', 'Lamentations': 'Lam', 'Ezekiel': 'Ezek', 'Daniel': 'Dan',
      'Hosea': 'Hos', 'Joel': 'Joel', 'Amos': 'Amos', 'Obadiah': 'Obad', 'Jonah': 'Jonah',
      'Micah': 'Mic', 'Nahum': 'Nah', 'Habakkuk': 'Hab', 'Zephaniah': 'Zeph', 'Haggai': 'Hag',
      'Zechariah': 'Zech', 'Malachi': 'Mal', 'Matthew': 'Matt', 'Mark': 'Mark', 'Luke': 'Luke',
      'John': 'John', 'Acts': 'Acts', 'Romans': 'Rom', '1 Corinthians': '1Cor', '2 Corinthians': '2Cor',
      'Galatians': 'Gal', 'Ephesians': 'Eph', 'Philippians': 'Phil', 'Colossians': 'Col',
      '1 Thessalonians': '1Thess', '2 Thessalonians': '2Thess', '1 Timothy': '1Tim', '2 Timothy': '2Tim',
      'Titus': 'Titus', 'Philemon': 'Phlm', 'Hebrews': 'Heb', 'James': 'Jas', '1 Peter': '1Pet',
      '2 Peter': '2Pet', '1 John': '1John', '2 John': '2John', '3 John': '3John', 'Jude': 'Jude',
      'Revelation': 'Rev'
    };
    
    return bookMap[fullName] || fullName;
  }

  // Main method to get verses by reference string
  getReference(ref) {
    try {
      const parsed = this.parseReference(ref);
      
      if (parsed.startVerse === parsed.endVerse) {
        const verse = this.getVerse(parsed.book, parsed.chapter, parsed.startVerse);
        return verse ? [verse] : [];
      } else {
        return this.getVerseRange(parsed.book, parsed.chapter, parsed.startVerse, parsed.endVerse);
      }
    } catch (error) {
      console.error('Error getting reference:', error);
      return [];
    }
  }

  // Get a random verse
  getRandomVerse() {
    try {
      const verseElements = this.dom.getElementsByTagName('verse');
      const verses = [];
      
      // Collect all valid verse IDs
      for (let i = 0; i < verseElements.length; i++) {
        const osisID = verseElements[i].getAttribute('osisID');
        if (osisID && osisID.includes('.')) {
          verses.push(osisID);
        }
      }
      
      if (verses.length === 0) return null;
      
      // Pick a random verse
      const randomOsisID = verses[Math.floor(Math.random() * verses.length)];
      const [book, chapter, verse] = randomOsisID.split('.');
      
      return this.getVerse(book, chapter, verse);
    } catch (error) {
      console.error('Error getting random verse:', error);
      return null;
    }
  }

  // Get list of all books
  getBooks() {
    try {
      const books = [];
      const bookElements = this.dom.querySelectorAll('div[type="book"]');
      
      for (let i = 0; i < bookElements.length; i++) {
        const element = bookElements[i];
        const osisID = element.getAttribute('osisID');
        if (osisID) {
          books.push({
            id: osisID,
            name: this.bookAbbreviations[osisID] || osisID
          });
        }
      }
      
      return books;
    } catch (error) {
      console.error('Error getting books:', error);
      return [];
    }
  }

  // Format verses as API-compatible response
  formatResponse(verses, reference = '') {
    if (!verses || !Array.isArray(verses) || verses.length === 0) {
      return {
        reference,
        verses: [],
        text: '',
        translation_id: 'KJV',
        translation_name: 'King James Version',
        translation_note: 'Public Domain',
        error: 'Verses not found'
      };
    }

    const text = verses.map(v => v.text).join(' ');
    
    return {
      reference,
      verses,
      text,
      translation_id: 'KJV',
      translation_name: 'King James Version',
      translation_note: 'Public Domain'
    };
  }
}

// Export for use in Astro
export default BibleReader;

// Example usage:
// import BibleReader from './bible-reader.js';
// const bible = new BibleReader('./eng-kjv.osis.xml');
// const verses = bible.getReference('John 3:16');
// const response = bible.formatResponse(verses, 'John 3:16');