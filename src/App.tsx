import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Bottom from './components/Bottom';
import { format } from 'date-fns';

export default function App() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(format(new Date(), 'HH:mm'));
        }, 1000); // 1초마다 갱신

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
    }, []);
    // 시간을 mm:ss 형식으로 변환하는 함수
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };
    const handleTimeChange = (newTime: number) => {
        setTime(newTime);
    };
    return (
        <Div className="page">
            <Div className="top">
                <Header>{currentTime}</Header>
                <Stats>{selectedTask ? selectedTask : '선택하쇼'}</Stats>
                <Img src="../assets/images/menu.svg" />
            </Div>
            <Div className="middle">
                <Timer>{formatTime(time)}</Timer>
                <Quote>"Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus."</Quote>
            </Div>
            <Bottom onTaskSelect={setSelectedTask} onTime={handleTimeChange} />
        </Div>
    );
}

const Div = styled.div`
    &.page {
        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: space-between;
        height: 100vh;
        color: white;
        background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('../assets/images/backimg.jpg');
        text-align: center;
        background-size: cover;
    }
    &.sidebar {
        width: 50%;
        padding: 30px 15px 30px 30px;
        display: flex;
        flex-direction: column;
        &.right {
            padding: 30px 30px 30px 15px;
        }
    }
    &.top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 85%;
        height: 80px;

        padding-top: 20px;
    }
    &.middle {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
`;
const Text = styled.p`
    color: white;
    margin: 20px 0;
`;

const Img = styled.img``;

const Header = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const Stats = styled.div`
    display: flex;
    gap: 10px;
    margin: 0 40px;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 14px;
    backdrop-filter: blur(10px);
`;

const Timer = styled.div`
    font-size: 96px;
    font-weight: bold;
    width: 250px; // 고정된 너비 설정
`;

const Quote = styled.p`
    font-size: 18px;
    max-width: 60%;
    margin-top: 20px;
    opacity: 0.9;
`;
