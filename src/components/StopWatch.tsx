import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Stopwatch() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // 시간을 mm:ss 형식으로 변환하는 함수
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

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
            const id = setInterval(() => setSeconds((prev) => prev + 1), 1000);
            setIntervalId(id);
        }
        setIsRunning(!isRunning);
    };

    // 타이머를 리셋하는 함수
    const resetTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setSeconds(0);
        setIsRunning(false);
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
        <StopwatchContainer>
            <TimeDisplay>{formatTime(seconds)}</TimeDisplay>
            <ButtonContainer>
                <Button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</Button>
                <Button onClick={resetTimer}>Reset</Button>
            </ButtonContainer>
        </StopwatchContainer>
    );
}

const StopwatchContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid #333333;
    padding: 20px;
    border-radius: 10px;
    height: 250px;
    font-family: 'Arial', sans-serif;
    color: white;
`;

const TimeDisplay = styled.div`
    font-size: 48px;
    margin: 20px 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 20px;
    margin: 10px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #3a82f7;
    color: black;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #1e5ebe;
    }

    &:active {
        background-color: #1e5ebe;
    }
`;
