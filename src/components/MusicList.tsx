import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { categoryTracks, Track } from './TrackData';
import { useMusicPlayer } from './MusicPlayer';
export default function MusicList({ onClose }: { onClose: () => void }) {
    const {
        currentTrack,
        currentCategory,
        setCurrentCategory,
        isPlaying,
        togglePlay,
        toggleRepeat,
        toggleMute,
        isRepeating,
        muted,
        playNext,
        playPrevious,
        volume,
        handleVolumeChange,
        audioRefs,
        handleCategoryChange,
        tracksWithDuration,
    } = useMusicPlayer();

    const categoryImages: Record<string, string> = {
        jazz: './assets/images/jazz.jpg',
        lofi: './assets/images/lofi.jpg',
        nature: './assets/images/rain.png',
    };

    const tracks = tracksWithDuration.length > 0 ? tracksWithDuration : categoryTracks[currentCategory];

    return (
        <Div className="container">
            <Div className="titlebar">
                <Div className="listtop">
                    <Img className="listimg" src="./assets/icons/music.svg" />
                    <Text className="listtop">Music List</Text>
                </Div>
                <Img className="close" onClick={onClose} src="./assets/icons/pagedown.svg" />
            </Div>
            <Div className="musicwrapper">
                <Div className="musiclist">
                    {Object.keys(categoryTracks).map((category) => (
                        <Div
                            key={category}
                            className={`musictrack ${currentCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            <Img className="list" src={categoryImages[category]} alt={category} />
                            <Text className="musiclist">{category}</Text>
                        </Div>
                    ))}
                </Div>
                <Div className="musicbottom">
                    <Div className="listtitle">
                        <Img className="img" src={categoryImages[currentCategory]} />
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
                                        <Img className="listpause" src="./assets/icons/pause.svg" />
                                    ) : (
                                        <Img className="listplay" src="./assets/icons/play.svg" />
                                    )}
                                </Div>
                                <Div className="musicimg" onClick={playPrevious}>
                                    <Img className="jump" src="./assets/icons/preplay.svg" />
                                </Div>
                                <Div className="musicimg" onClick={() => playNext()}>
                                    <Img className="jump" src="./assets/icons/nextplay.svg" />
                                </Div>
                                {/* 반복재생 아이콘 추가 */}
                                <Div className={`musicimg ${isRepeating ? 'active' : ''}`} onClick={toggleRepeat}>
                                    {isRepeating ? (
                                        <Img className="repeat" src="./assets/icons/notrepeat.svg" />
                                    ) : (
                                        <Img className="repeat" src="./assets/icons/repeat.svg" />
                                    )}
                                </Div>
                                <Div className="musicimg" onClick={toggleMute}>
                                    <Img className="sound" src={muted ? './assets/icons/mute.svg' : './assets/icons/sound.svg'} />
                                </Div>

                                <Slider min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolumeChange} />
                            </Div>
                        </Div>
                    </Div>

                    <Div className="listwrapper">
                        {tracks.map((track) => (
                            <Div
                                className={`list ${currentTrack === track.id ? 'active' : ''}`}
                                key={track.id}
                                onClick={() => togglePlay(track.id)}
                            >
                                <Text className="list num">{track.id}.</Text>
                                <Text className="list">{track.title}</Text>
                                <Text className="list duration">{track.duration || '00:00'}</Text>
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
        width: 100%;
        &.num {
            margin-right: 10px;
            width: 20px;
        }
        &.title {
            font-weight: 600;
            font-size: 18px;
            cursor: default;
        }
        &.duration {
            width: 40px;
            font-size: 14px;
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
    &.repeat {
        width: 26px;
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
