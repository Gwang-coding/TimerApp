import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TodoList from './TodoList';
import MusicList from './MusicList';

// 타이머 API 타입 정의 (에러 방지를 위해 수정)
declare global {
    interface Window {
        timerAPI: {
            startTimer: () => void;
            stopTimer: () => void;
            resetTimer: () => void;
            setTime: (time: number) => void;
            requestTimerState?: () => void; // 선택적 속성으로 변경
            onTimeUpdate: (callback: (time: number) => void) => () => void;
            onRunningStateChange?: (callback: (isRunning: boolean) => void) => () => void; // 선택적 속성으로 변경
        };
    }
}

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

    useEffect(() => {
        onTime(time); // `time` 상태가 변할 때만 `onTime` 호출
    }, [time]);
    // 컴포넌트 마운트 시 상태 요청 (안전하게 처리)
    useEffect(() => {
        console.log('Component mounted, checking for requestTimerState');

        // 함수가 존재하는지 확인하고 실행
        if (window.timerAPI.requestTimerState) {
            console.log('Requesting timer state');
            window.timerAPI.requestTimerState();
        } else {
            console.log('requestTimerState function not available');
        }
    }, []);

    // 타이머 시간 업데이트 리스너
    useEffect(() => {
        console.log('Setting up timer update listener');

        // 기본 타이머 업데이트 리스너 등록 (필수)
        const removeTimeListener = window.timerAPI.onTimeUpdate((newTime: number) => {
            console.log('Timer update received:', newTime);
            setTime(newTime);
            onTime(newTime);
        });

        let removeRunningListener = () => {};

        // 실행 상태 리스너가 존재하면 등록 (선택)
        if (window.timerAPI.onRunningStateChange) {
            removeRunningListener = window.timerAPI.onRunningStateChange((running: boolean) => {
                console.log('Timer running state update:', running);
                setIsRunning(running);
            });
        }

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            console.log('Removing timer listeners');
            removeTimeListener();
            removeRunningListener();
        };
    }, []);

    // 타이머 시작/정지 토글 함수
    const toggleTimer = () => {
        console.log('Toggle timer, current state:', isRunning);

        if (isRunning) {
            window.timerAPI.stopTimer();
            setIsRunning(false); // 수동으로 상태 업데이트 (onRunningStateChange가 없을 경우)
        } else {
            window.timerAPI.startTimer();
            setIsRunning(true); // 수동으로 상태 업데이트 (onRunningStateChange가 없을 경우)
        }
    };

    // 선택된 작업이 변경될 때 타이머 업데이트
    useEffect(() => {
        console.log('Task selected:', selectedTask, 'Time:', handleTimeChange);
        onTaskSelect(selectedTask);

        if (selectedTask == null) {
            setTime(0);
            onTime(0);
            window.timerAPI.resetTimer();
        } else {
            setTime(handleTimeChange);
            onTime(handleTimeChange);
            window.timerAPI.setTime(handleTimeChange);
        }

        // 타이머 강제 정지
        window.timerAPI.stopTimer();
        setIsRunning(false); // 수동으로 상태 업데이트
    }, [selectedTask]);

    // 모달 외부 클릭 처리
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

    // 앱이 포커스를 받을 때 상태 다시 요청 (안전하게 처리)
    useEffect(() => {
        const handleFocus = () => {
            console.log('Window focused, checking for requestTimerState');
            if (window.timerAPI.requestTimerState) {
                window.timerAPI.requestTimerState();
            }
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

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
