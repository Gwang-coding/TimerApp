import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Bottom from './components/Bottom';
import { format } from 'date-fns';
import { MusicPlayerProvider } from './components/MusicPlayer';
import quotesData from './components/quote.json';
import Sidebar from './components/Sidebar';

export default function App() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'));
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [sidebar, setSidebar] = useState<boolean>(false);
    const [backgroundImage, setBackgroundImage] = useState('./assets/images/img1.jpg');
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(format(new Date(), 'HH:mm'));
        }, 1000); // 1초마다 갱신

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
    }, []);
    // 시간을 hh:mm:ss 형식으로 변환하는 함수
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600).toString();
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');

        if (totalSeconds >= 3600) {
            return `${hours}:${minutes}:${secs}`;
        } else {
            return `${minutes}:${secs}`;
        }
    };
    //할일에서 클릭시 시간전달
    const handleTimeChange = (newTime: number) => {
        setTime(newTime);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotesData.quotes.length);
        }, 60000); // 60000ms = 1분으로 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebar(false);
            }
        };

        if (sidebar) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebar]);

    return (
        <Page $bgImage={backgroundImage}>
            <Div className="topwrapper">
                <Div className="top">
                    <Header>{currentTime}</Header>
                </Div>

                <Div className="stats">{selectedTask ? selectedTask : '오늘 할일에서 작업을 선택하세요.'}</Div>
                <Div className="top">
                    <Img
                        onClick={() => {
                            setSidebar(!sidebar);
                        }}
                        src="./assets/icons/menu.svg"
                    />
                </Div>
            </Div>
            {sidebar && (
                <Div className="menuwrapper" ref={sidebarRef}>
                    <Sidebar setBackgroundImage={setBackgroundImage} />
                    <Img
                        onClick={() => {
                            setSidebar(false);
                        }}
                        className="close"
                        src="./assets/icons/pagedown.svg"
                    />
                </Div>
            )}

            <Div className="middle">
                <Timer>{formatTime(time)}</Timer>
                <Quote>"{quotesData.quotes[quoteIndex]}"</Quote>
            </Div>
            <MusicPlayerProvider>
                <Bottom onTaskSelect={setSelectedTask} onTime={handleTimeChange} />
            </MusicPlayerProvider>
        </Page>
    );
}

const Page = styled.div<{ $bgImage: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    color: white;
    background-image: ${(props) => `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${props.$bgImage}')`};
    text-align: center;
    background-size: cover;
`;
const Div = styled.div`
    &.menuwrapper {
        background-color: white;
        position: absolute;
        width: 280px;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: start;
        padding: 20px 30px 30px;
        border-radius: 0 0 0 40px;
        overflow: hidden;
        box-shadow: 0px 0px 6px -1px #494949;
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

    &.topwrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 85%;
        height: 80px;
        padding-top: 20px;
    }
    &.top {
        width: 60px;
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
    }
`;

const Img = styled.img`
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;
    cursor: pointer;
    &.close {
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
        margin-top: 3px;
    }
`;

const Header = styled.p`
    font-size: 20px;
    font-weight: bold;
    marign: 0;
`;

const Timer = styled.p`
    font-size: 115px;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    margin: 0;
`;

const Quote = styled.p`
    font-size: 18px;
    font-weight: 700;
    margin-top: 20px;

    opacity: 0.9;
`;
