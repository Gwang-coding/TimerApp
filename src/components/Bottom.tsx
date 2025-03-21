import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TodoList from './TodoList';
import MusicList from './MusicList';

interface BottomProps {
    onTime: (time: number) => void;
    onTaskSelect: (task: string | null) => void;
}

export default function Bottom({ onTaskSelect, onTime }: BottomProps) {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [list, setList] = useState(false);
    const [music, setMusic] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [handleTimeChange, setHandleTimeChange] = useState<number>(0);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [worker, setWorker] = useState<Worker | null>(null);
    // 타이머 시작/정지
    useEffect(() => {
        onTime(time); // `time` 상태가 변할 때만 `onTime` 호출
    }, [time]);
    useEffect(() => {
        const timerWorker = new Worker('/worker.js');

        timerWorker.onmessage = (event) => {
            setTime(event.data);
            onTime(event.data);
        };
        setWorker(timerWorker);
        return () => {
            timerWorker.terminate();
        };
    }, []);
    const toggleTimer = () => {
        if (isRunning) {
            // 타이머가 실행 중이면 중지
            worker?.postMessage('stop');
        } else {
            worker?.postMessage('start');
        }
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        onTaskSelect(selectedTask);
        if (selectedTask == null) {
            setTime(0);
            onTime(0);
            worker?.postMessage('reset');
        } else {
            setTime(handleTimeChange);
            onTime(handleTimeChange);
            worker?.postMessage({ command: 'set', time: handleTimeChange });
        }

        setIsRunning(false); // 타이머 강제 정지
        worker?.postMessage('stop');
    }, [selectedTask]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listRef.current && !listRef.current.contains(event.target as Node)) {
                setList(false);
                setMusic(false);
            }
        };

        if (list || music) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [list, music]);
    return (
        <Div className="bottom">
            <CircleButton onClick={() => setMusic(!music)}>
                <Img src="./assets/icons/music.svg" />
            </CircleButton>
            {music && (
                <Div className="list" ref={listRef}>
                    <MusicList onClose={() => setMusic(false)} />
                </Div>
            )}

            {isRunning ? (
                <CircleButton onClick={toggleTimer} className="play">
                    <Img src="./assets/icons/pause.svg" />
                </CircleButton>
            ) : (
                <CircleButton onClick={toggleTimer} className="play">
                    <Img src="./assets/icons/play.svg" />
                </CircleButton>
            )}
            {list && (
                <Div className="list" ref={listRef}>
                    <TodoList sendTime={setHandleTimeChange} seconds={time} onTaskSelect={setSelectedTask} onClose={() => setList(false)} />
                </Div>
            )}

            <CircleButton onClick={() => setList(!list)}>
                <Img src="./assets/icons/list.svg" />
            </CircleButton>
        </Div>
    );
}

const Div = styled.div`
    &.bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        width: 250px;
    }
    &.list {
        position: absolute;
        height: 480px;
        margin-inline: auto;
        width: 580px;
        box-shadow: 0px -1px 8px -1px #494949;

        border-radius: 4% 4% 0 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: white;
        z-index: 1000;
    }
`;
const CircleButton = styled.button`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #c0c0c0;
    color: white;
    font-size: 16px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1); /* 어두운 반투명 배경 */
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    &.play {
        width: 90px;
        height: 90px;
    }
`;
const Img = styled.img``;
