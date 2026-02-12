// Example usage of BibleReader in an Astro project
import BibleReader from './bible-reader.js';

// Initialize the Bible reader with your OSIS XML file path
const bible = new BibleReader('./eng-kjv.osis.xml');





interface Passage {
    reference: string;
    verses: Array<{
        book_name: string;
        chapter: number;
        verse: number;
        text: string;
    }>;
    text: string;
}

export async function getPassage(reference: string, translation: string = 'kjv'): Promise<Passage | null> { 
    try {
        const data = bible.getReference(reference);
        
        // Check if data is valid and has verses
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error(`No verses found for reference: ${reference}`);
            return null;
        }
        
        const formattedData = bible.formatResponse(data, reference);

        // Check if formattedData has the expected structure
        if (!formattedData || !formattedData.verses || !Array.isArray(formattedData.verses)) {
            console.error(`Invalid formatted data for reference: ${reference}`);
            return null;
        }

        // Structure the verses
        const verses = formattedData.verses.map((v: any) => ({
            book_name: v.book_name,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text.trim()
        }));

        return {
            reference: formattedData.reference || reference,
            verses: verses,
            text: formattedData.text.trim()
        };
    } catch (error) {
        console.error(`Error fetching Bible passage: ${error}`);
        return null;
    }
}