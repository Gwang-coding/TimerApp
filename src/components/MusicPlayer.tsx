import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { categoryTracks, Track } from './TrackData';

// 오디오 상태를 공유할 Context 생성
const MusicPlayerContext = createContext<any>(null);

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
    const [tracksWithDuration, setTracksWithDuration] = useState<Track[]>([]);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<number | null>(() => {
        const savedTrack = localStorage.getItem('currentTrack');
        return savedTrack ? parseInt(savedTrack) : null;
    });
    const [currentCategory, setCurrentCategory] = useState<string>(() => {
        const savedCategory = localStorage.getItem('currentCategory');
        return savedCategory || 'jazz';
    });
    const tracks = categoryTracks[currentCategory];

    useEffect(() => {
        const loadTrackDurations = async () => {
            const tracksWithDurationData = await Promise.all(
                tracks.map(async (track) => {
                    try {
                        const duration = await getAudioDuration(track.src);
                        return { ...track, duration };
                    } catch (error) {
                        console.error(`Error loading duration for ${track.title}:`, error);
                        return { ...track, duration: '00:00' };
                    }
                })
            );
            setTracksWithDuration(tracksWithDurationData);
        };

        loadTrackDurations();
    }, [currentCategory]);

    // 노래 시간 확인
    const getAudioDuration = (src: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                // 초 단위의 길이를 분:초 형식으로 변환
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                resolve(formattedDuration);
            });

            audio.addEventListener('error', (error) => {
                reject(error);
            });

            audio.src = src;
        });
    };

    // 트랙이 마지막에 도달하면 반복
    useEffect(() => {
        // 각 오디오 요소에 이벤트 리스너 추가
        const audioElements = audioRefs.current;
        const handleTrackEnd = () => {
            if (isRepeating && currentTrack !== null) {
                // 현재 트랙 반복
                const currentAudio = audioRefs.current[tracks.findIndex((track) => track.id === currentTrack)];
                if (currentAudio) {
                    currentAudio.currentTime = 0;
                    currentAudio.play();
                }
            } else {
                playNext(true); // 자동 재생 플래그 true
            }
        };

        audioElements.forEach((audio) => {
            if (audio) {
                audio.addEventListener('ended', handleTrackEnd);
            }
        });

        // 클린업 함수
        return () => {
            audioElements.forEach((audio) => {
                if (audio) {
                    audio.removeEventListener('ended', handleTrackEnd);
                }
            });
        };
    }, [tracks, currentTrack, isRepeating]);

    useEffect(() => {
        if (currentTrack !== null) {
            const trackIndex = tracks.findIndex((track) => track.id === currentTrack);
            if (trackIndex !== -1) {
                const audio = audioRefs.current[trackIndex];
                if (audio) {
                    audio.volume = muted ? 0 : volume;
                    const wasPlaying = localStorage.getItem('isPlaying') === 'true';
                    if (wasPlaying) {
                        audio.play().catch((error) => console.log('Autoplay prevented:', error));
                        setIsPlaying(true);
                    }
                }
            }
        }
    }, []);

    //현재 정보 로컬스토리지에 저장
    useEffect(() => {
        if (currentTrack !== null) {
            localStorage.setItem('currentTrack', currentTrack.toString());
        }
        localStorage.setItem('currentCategory', currentCategory);
        localStorage.setItem('isPlaying', isPlaying.toString());
    }, [currentTrack, currentCategory, isPlaying]);

    //플레이버튼
    const togglePlay = (trackId: number) => {
        const trackIndex = tracks.findIndex((track) => track.id === trackId);
        if (trackIndex === -1) return;
        const audio = audioRefs.current[trackIndex];

        if (!audio) return;

        if (currentTrack === trackId) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            audioRefs.current.forEach((a) => {
                if (a) {
                    a.pause();
                    a.currentTime = 0; // 노래를 처음부터 시작하도록 설정
                }
            });
            audio.play();
            setCurrentTrack(trackId);
            setIsPlaying(true);
        }
    };

    //볼륨 조절
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);

        // 현재 재생 중인 트랙의 볼륨 조절
        if (currentTrack !== null) {
            const currentAudio = audioRefs.current[tracks.findIndex((track) => track.id === currentTrack)];
            if (currentAudio) {
                currentAudio.volume = muted ? 0 : newVolume;
            }
        }

        // 모든 오디오 요소의 볼륨 조절
        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.volume = muted ? 0 : newVolume;
            }
        });
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category: string) => {
        setCurrentCategory(category);
        // 카테고리 변경 시 현재 재생 중인 트랙 초기화
        setCurrentTrack(null);
        setIsPlaying(false);
        setIsRepeating(false);
        // 모든 오디오 정지
        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    };

    const playPrevious = () => {
        if (currentTrack === null) return;

        const currentIndex = tracks.findIndex((track) => track.id === currentTrack);
        if (currentIndex > 0) {
            const prevTrackId = tracks[currentIndex - 1].id;
            togglePlay(prevTrackId);
        }
    };
    const pauseAllAudio = () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                audioRefs.current.forEach((a) => {
                    if (a) {
                        a.pause();
                        a.currentTime = 0;
                    }
                });
                resolve();
            }, 100); // 50ms에서 100ms로 지연 시간 증가
        });
    };
    const playNext = async (autoPlay: boolean = false) => {
        // 현재 트랙의 인덱스 찾기
        const currentIndex = currentTrack ? tracks.findIndex((track) => track.id === currentTrack) : -1;

        // 다음 트랙 인덱스 계산
        let nextIndex = currentIndex + 1;

        // 마지막 트랙을 넘어가면 처음으로 돌아감
        if (nextIndex >= tracks.length) {
            nextIndex = 0;
        }

        const nextTrackId = tracks[nextIndex].id;

        // 자동 재생 모드일 경우
        if (autoPlay) {
            const nextAudio = audioRefs.current[nextIndex];
            if (nextAudio) {
                // 모든 오디오 일시정지
                await pauseAllAudio();
                await new Promise((resolve) => setTimeout(resolve, 100));

                // 볼륨 설정
                nextAudio.volume = muted ? 0 : volume;

                // 재생
                nextAudio.play();
                setCurrentTrack(nextTrackId);
                setIsPlaying(true);
            }
        } else {
            // 수동 재생 모드 (기존 로직 유지)
            togglePlay(nextTrackId);
        }
    };
    const toggleMute = () => {
        setMuted(!muted);
    };

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                audioRefs,
                volume,
                muted,
                isPlaying,
                isRepeating,
                currentTrack,
                currentCategory,
                setCurrentCategory,
                togglePlay,
                handleVolumeChange,
                toggleMute,
                toggleRepeat,
                playNext,
                playPrevious,
                handleCategoryChange,
                tracksWithDuration,
            }}
        >
            {children}
            {tracks.map((track, index) => (
                <audio
                    key={track.id}
                    ref={(el) => {
                        audioRefs.current[index] = el;
                    }}
                    src={track.src}
                    preload="auto"
                />
            ))}
        </MusicPlayerContext.Provider>
    );
}
