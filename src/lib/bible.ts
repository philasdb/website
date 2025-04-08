

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
    // Encode the reference for use in a URL
    const encodedReference = encodeURIComponent(reference);
    const url = `https://bible-api.com/${encodedReference}?translation=${translation}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} reference: ${encodedReference}`);
        }

        const data = await response.json();

        // Structure the verses
        const verses = data.verses.map( (v:any) => ({
            book_name: v.book_name,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text.trim()
        }));

        return {
            reference: data.reference,
            verses: verses,
            text: data.text.trim()
        };
    } catch (error) {
        console.error(`Error fetching Bible passage: ${error}`);
        return null;
    }
}