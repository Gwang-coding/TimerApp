import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Bottom from './components/Bottom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import quotesData from './components/quote.json';

interface QuotesData {
    quotes: string[];
}
export default function App() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'));
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [showBackgroundSetting, setShowBackgroundSetting] = useState(false);
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
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotesData.quotes.length);
        }, 60000); // 60000ms = 1분으로 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, []);
    return (
        <Div className="page">
            <Div className="top">
                <Header>{currentTime}</Header>
                <Div className="stats">{selectedTask ? selectedTask : '오늘 할일에서 작업을 선택하세요.'}</Div>
                <Img src="../assets/images/menu.svg" />
            </Div>
            <Div className="menuwrapper">
                <AnimatePresence mode="wait">
                    {!showBackgroundSetting ? (
                        <MotionMenu key="menu" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.1 }}>
                            <Div className="menulist" onClick={() => setShowBackgroundSetting(true)}>
                                <Img className="background" src="../assets/images/background.svg" />
                                <Text>배경화면</Text>
                            </Div>
                            <Div className="menulist">
                                <Img className="eval" src="../assets/images/eval.svg" />
                                <Text>앱 평가하기</Text>
                            </Div>
                            <Div className="menulist">
                                <Img className="info" src="../assets/images/info.svg" />
                                <Text>정보</Text>
                            </Div>
                        </MotionMenu>
                    ) : (
                        <Div className="afterclick">
                            <Img className="back" src="../assets/images/back.svg" onClick={() => setShowBackgroundSetting(false)} />
                            <MotionBackgroundSetting
                                key="background-setting"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ duration: 0.1 }}
                            >
                                <h2>배경화면 설정</h2>
                                <p>배경화면을 설정하는 UI가 들어갈 공간</p>
                            </MotionBackgroundSetting>
                        </Div>
                    )}
                </AnimatePresence>

                <Img className="close" src="../assets/images/pagedown.svg" />
            </Div>
            <Div className="middle">
                <Timer>{formatTime(time)}</Timer>
                <Quote>{quotesData.quotes[quoteIndex]}</Quote>
            </Div>
            <Bottom onTaskSelect={setSelectedTask} onTime={handleTimeChange} />
        </Div>
    );
}
const Text = styled.p`
    color: black;
    margin: 0;
    font-weight: 600;
`;
const MotionBackgroundSetting = styled(motion.div)`
    display: flex;
    flex-direction: column;
    color: black;
`;

const MotionMenu = styled(motion.div)`
    text-align: start;
    margin-top: 25px;
    margin-bottom: 10px;
`;

const Div = styled.div`
    &.afterclick {
        display: flex;
        flex-direction: column;
    }
    &.menuwrapper {
        background-color: white;
        position: absolute;
        width: 250px;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: start;
        padding: 20px 20px 15px;
        border-radius: 0 0 0 40px;
        overflow: hidden;
    }
    &.menulist {
        &:hover {
            background-color: #f2f2f3;
            border-radius: 10px;
        }
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 10px;

        cursor: pointer;
        width: 200px;
    }
    &.menu {
        text-align: start;
        margin-top: 25px;
        margin-bottom: 10px;
    }
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
    &.stats {
        display: flex;
        gap: 10px;
        margin: 0 40px;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 16px;
        border-radius: 12px;
        font-size: 16px;
        backdrop-filter: blur(10px);
        cursor: default;
        text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
    }
`;

const Img = styled.img`
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
    &.close {
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
        margin-top: 3px;
    }
    &.eval {
        margin-right: 10px;
    }
    &.background {
        margin-left: 5px;
        margin-right: 10px;
    }
    &.info {
        margin-left: 2px;
        margin-right: 10px;
    }
    &.back {
        width: 30px;
    }
`;

const Header = styled.div`
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
`;

const Timer = styled.div`
    font-size: 120px;
    font-weight: bold;
    width: 200px;
    margin-right: 145px;
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
`;

const Quote = styled.p`
    font-size: 18px;
    font-weight: 700;
    margin-top: 20px;
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
    opacity: 0.9;
`;
