export interface Track {
    id: number;
    title: string;
    src: string;
}

export const categoryTracks: Record<string, Track[]> = {
    카페: [
        { id: 1, title: '카페 분위기 1', src: '../assets/audio/pocketmon1.mp3' },
        { id: 2, title: '카페 분위기 2', src: '../assets/audio/pocketmon2.mp3' },
        { id: 3, title: '카페 분위기 3', src: '../assets/audio/pocketmon3.mp3' },
    ],
    자연: [
        { id: 1, title: '자연 사운드 1', src: '../assets/audio/pocketmon2.mp3' },
        { id: 2, title: '자연 사운드 2', src: '../assets/audio/pocketmon3.mp3' },
        { id: 3, title: '자연 사운드 3', src: '../assets/audio/pocketmon1.mp3' },
    ],
    일렉: [
        { id: 1, title: '일렉 트랙 1', src: '../assets/audio/pocketmon4.mp3' },
        { id: 2, title: '일렉 트랙 2', src: '../assets/audio/pocketmon3.mp3' },
        { id: 3, title: '일렉 트랙 3', src: '../assets/audio/pocketmon2.mp3' },
    ],
};
