import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TodoList from './TodoList';

interface BottomProps {
    onTime: (time: number) => void;
    onTaskSelect: (task: string | null) => void; // onTaskSelect의 타입을 명시합니다
}

export default function Bottom({ onTaskSelect, onTime }: BottomProps) {
    const [list, setList] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // 타이머 시작/정지
    const toggleTimer = () => {
        if (isRunning) {
            // 타이머가 실행 중이면 중지
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        } else {
            // 타이머가 정지 중이면 시작
            const id = setInterval(
                () =>
                    setTime((prev) => {
                        const newTime = prev + 1;
                        onTime(newTime); // 부모에게 seconds 값 전달
                        return newTime;
                    }),
                1000
            );

            setIntervalId(id);
        }
        console.log(intervalId);
        setIsRunning(!isRunning);
    };

    const handleTimeChange = (getTime: number) => {
        setTime(getTime);
    };

    // 컴포넌트가 언마운트 될 때 타이머를 정리합니다.
    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);
    return (
        <Div className="bottom">
            <CircleButton>
                <Img src="../assets/images/music.svg" />
            </CircleButton>
            {isRunning ? (
                <CircleButton onClick={toggleTimer} className="play">
                    <Img src="../assets/images/pause.svg" />
                </CircleButton>
            ) : (
                <CircleButton onClick={toggleTimer} className="play">
                    <Img src="../assets/images/play.svg" />
                </CircleButton>
            )}
            {list && (
                <Div className="list">
                    <TodoList sendTime={handleTimeChange} seconds={time} onTaskSelect={onTaskSelect} onClose={() => setList(false)} />
                </Div>
            )}

            <CircleButton onClick={() => setList(!list)}>
                <Img src="../assets/images/list.svg" />
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
        box-shadow: -1px -1px 8px 2px #494949;

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
