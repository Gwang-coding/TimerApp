export interface Track {
    id: number;
    title: string;
    src: string;
    duration?: string;
}

export const categoryTracks: Record<string, Track[]> = {
    jazz: [
        { id: 1, title: 'latte', src: '../assets/audio/jazz/latte.mp3' },
        { id: 2, title: 'midnight', src: '../assets/audio/jazz/midnight.mp3' },
        { id: 3, title: 'sebuah', src: '../assets/audio/jazz/sebuah.mp3' },
        { id: 4, title: 'smooth', src: '../assets/audio/jazz/smooth.mp3' },
        { id: 5, title: 'smoothcafe', src: '../assets/audio/jazz/smoothcafe.mp3' },
        { id: 6, title: 'smoothchill', src: '../assets/audio/jazz/smoothchill.mp3' },
    ],
    lofi: [
        { id: 1, title: 'blissfulmorning', src: '../assets/audio/lofi/blissfulmorning.mp3' },
        { id: 2, title: 'bubbletea', src: '../assets/audio/lofi/bubbletea.mp3' },
        { id: 3, title: 'cosydreaming', src: '../assets/audio/lofi/cosydreaming.mp3' },
        { id: 4, title: 'feelingood', src: '../assets/audio/lofi/feelingood.mp3' },
        { id: 5, title: 'perfectday', src: '../assets/audio/lofi/perfectday.mp3' },
    ],
    nature: [
        { id: 1, title: 'firecamp', src: '../assets/audio/nature/firecamp.mp3' },
        { id: 2, title: 'raining', src: '../assets/audio/nature/raining.mp3' },
    ],
};
