import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { categoryTracks, Track } from './TrackData';

export default function MusicList({ onClose }: { onClose: () => void }) {
    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
    const [volume, setVolume] = useState(0.5);
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [muted, setMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentCategory, setCurrentCategory] = useState<string>('카페');

    // 현재 카테고리의 트랙들
    const tracks = categoryTracks[currentCategory];

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category: string) => {
        setCurrentCategory(category);
        // 카테고리 변경 시 현재 재생 중인 트랙 초기화
        setCurrentTrack(null);
        setIsPlaying(false);
        // 모든 오디오 정지
        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    };

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

    const toggleMute = () => {
        setMuted(!muted);
    };

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
            // 다른 곡 정지
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

    const playPrevious = () => {
        if (currentTrack === null) return;

        const currentIndex = tracks.findIndex((track) => track.id === currentTrack);
        if (currentIndex > 0) {
            const prevTrackId = tracks[currentIndex - 1].id;
            togglePlay(prevTrackId);
        }
    };

    const playNext = (autoPlay: boolean = false) => {
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
                audioRefs.current.forEach((a) => a?.pause());

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

    useEffect(() => {
        // 각 오디오 요소에 이벤트 리스너 추가
        const audioElements = audioRefs.current;
        const handleTrackEnd = () => {
            playNext(true); // 자동 재생 플래그 true
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
    }, [tracks, currentTrack]);

    return (
        <Div className="container">
            <Div className="titlebar">
                <Div className="listtop">
                    <Img className="listimg" src="../assets/images/music.svg" />
                    <Text className="listtop">Music List</Text>
                </Div>
                <Img className="close" onClick={onClose} src="../assets/images/pagedown.svg" />
            </Div>
            <Div className="musicwrapper">
                <Div className="musiclist">
                    {Object.keys(categoryTracks).map((category) => (
                        <Div
                            key={category}
                            className={`musictrack ${currentCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            <Img className="list" src="../assets/images/backimg.jpg" />
                            <Text className="musiclist">{category}</Text>
                        </Div>
                    ))}
                </Div>
                <Div className="musicbottom">
                    <Div className="listtitle">
                        <Img className="img" src="../assets/images/backimg.jpg" />
                        <Div className="listinfobox">
                            <Div className="title">
                                <Text className="list title">{currentCategory}</Text>
                                <Text className="list subtitle">
                                    {currentTrack
                                        ? tracks.find((track) => track.id === currentTrack)?.title || 'No Track'
                                        : 'Select a Track'}
                                </Text>
                            </Div>
                            <Div className="playlist">
                                <Div className="musicimg" onClick={() => togglePlay(currentTrack!)}>
                                    {isPlaying ? (
                                        <Img className="listpause" src="../assets/images/pause.svg" />
                                    ) : (
                                        <Img className="listplay" src="../assets/images/play.svg" />
                                    )}
                                </Div>
                                <Div className="musicimg" onClick={playPrevious}>
                                    <Img className="jump" src="../assets/images/preplay.svg" />
                                </Div>
                                <Div className="musicimg" onClick={() => playNext()}>
                                    <Img className="jump" src="../assets/images/nextplay.svg" />
                                </Div>

                                <Div className="musicimg" onClick={() => playNext()}>
                                    <Img
                                        className="sound"
                                        src={muted ? '../assets/images/mute.svg' : '../assets/images/sound.svg'}
                                        onClick={toggleMute}
                                    />
                                </Div>

                                <Slider min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolumeChange} />

                                {/* <section>
                                    <p>final volume: {finalVolume.toFixed(3)}</p>
                                </section> */}
                            </Div>
                        </Div>
                    </Div>
                    <Div className="listwrapper">
                        {tracks.map((track, index) => (
                            <Div
                                className={`list ${currentTrack === track.id ? 'active' : ''}`}
                                key={track.id}
                                onClick={() => togglePlay(track.id)}
                            >
                                <audio
                                    ref={(el) => {
                                        audioRefs.current[index] = el;
                                    }}
                                    src={track.src}
                                    preload="auto"
                                />
                                <Text className="list num">{track.id}.</Text>
                                <Text className="list">{track.title}</Text>
                            </Div>
                        ))}
                    </Div>
                </Div>
            </Div>
        </Div>
    );
}
const Div = styled.div`
    &.container {
        display: flex;
        flex-direction: column;
        padding: 15px 15px 0 15px;
        border-radius: 10px;
    }
    &.listtop {
        display: flex;
        align-items: center;
    }
    &.titlebar {
        display: flex;
        padding: 0 10px;
        margin-bottom: 10px;
        justify-content: space-between;
    }
    &.musicwrapper {
        color: black;
    }
    &.musiclist {
        display: flex;
    }
    &.musictrack {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 140px;
        font-size: 15px;
        cursor: pointer;
        border-radius: 7px;
        margin: 5px;
        background-color: #f0f2f3;
        &.active {
            background-color: #cdd1d5;
        }
        &:hover {
            background-color: #cdd1d5;
        }
    }
    &.musicbottom {
        height: 100%;
        margin-top: 5px;
        border-radius: 7px;
    }
    &.listtitle {
        height: 100%;
        border-radius: 7px 7px 0px 0px;
        padding: 15px;
        display: flex;
        background-color: #6b7280;
    }
    &.listwrapper {
        padding: 5px;
        overflow-y: auto; /* 세로 스크롤만 */
        max-height: 145px;
        height: 145px;
        border-radius: 0px 0px 7px 7px;
        background-color: #4b5563;
    }
    &.list {
        border-radius: 3px;
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px 0 12px;
        cursor: pointer;
        &.active {
            background-color: #384151;
        }
        &:hover {
            background-color: #384151;
        }
    }
    &.listinfo {
        padding: 0 20px;
    }
    &.listinfobox {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    &.playlist {
        display: flex;
        align-items: center;
    }
    &.musicimg {
        width: 50px;
        height: 30px;
        justify-content: center;
        display: flex;
        cursor: pointer;
        &:hover {
            border-radius: 10px;
            background-color: #7c8492;
        }
    }
    &.title {
        margin-left: 10px;
    }
`;

const Text = styled.p`
    cursor: default;
    &.listtop {
        font-size: 18px;
        color: black;
        margin: 0;
        font-weight: bold;
    }
    &.musiclist {
        margin: 0;
        margin-top: 5px;
        font-weight: 500;
        color: black;
        cursor: pointer;
    }
    &.list {
        margin: 0;
        color: white;
        cursor: pointer;
        text-align: start;
        &.num {
            margin-right: 20px;
        }
        &.title {
            font-weight: 600;
            font-size: 18px;
            cursor: default;
        }
        &.subtitle {
            cursor: default;
        }
    }
`;

const Img = styled.img`
    &.listimg {
        filter: brightness(0%);
        margin-right: 5px;
        height: 25px;
    }
    &.list {
        width: 100px;
        height: 100px;
        border-radius: 5px;
    }

    &.img {
        border-radius: 5px;
        width: 80px;
        height: 80px;
    }
    &.listplay {
        width: 20px;
    }
    &.jump {
        width: 25px;
    }
    &.sound {
        width: 25px;
    }
    &.listpause {
        width: 12px;
    }
    &.close {
        cursor: pointer;
    }
`;
const Slider = styled.input.attrs({ type: 'range' })<{ value: number }>`
    -webkit-appearance: none;
    width: 150px;
    margin-left: 5px;
    height: 6px;
    background: linear-gradient(
        to right,
        white ${(props) => props.value * 100}%,
        /* 왼쪽 (채워진 부분) */ #404040 ${(props) => props.value * 100}% /* 오른쪽 (남은 부분) */
    );
    border-radius: 5px;
    border: 1px solid #828282;
    &:hover {
        border: 1px solid #a3a3a3;
    }

    cursor: pointer;

    /* 트랙 기본 스타일 */
    &::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 5px;
    }

    /* 슬라이더 버튼 (thumb) */
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        margin-top: -3.8px;
    }
`;
