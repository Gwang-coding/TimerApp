import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ setBackgroundImage }: { setBackgroundImage: (img: string) => void }) {
    // 현재 화면 상태를 관리하는 state ('menu', 'background', 'evaluation', 'info')
    const [currentView, setCurrentView] = useState('menu');

    const backgroundImages = Array.from({ length: 11 }, (_, i) => `img${i + 1}.jpg`);

    // 메인 메뉴로 돌아가기
    const goBackToMenu = () => {
        setCurrentView('menu');
    };
    const openAppStoreReview = () => {
        console.log('Review button clicked');
        const appStoreId = '497799835';
        const reviewUrl = `macappstore://apps.apple.com/app/id${appStoreId}?action=write-review`;

        console.log('window.Electron:', window.Electron);

        if (window.Electron && typeof window.Electron.openExternal === 'function') {
            window.Electron.openExternal(reviewUrl)
                .then(() => console.log('App Store opened successfully via Electron API'))
                .catch((err) => {
                    console.error('Failed to open App Store via Electron API:', err);
                });
        } else {
            console.error('Electron API not available or not properly initialized');
            // 대체 방법으로 웹 URL 열기
            const webUrl = `https://apps.apple.com/app/id${appStoreId}?action=write-review`;
            window.open(webUrl, '_blank');
        }
    };
    return (
        <AnimatePresence mode="wait">
            {currentView === 'menu' ? (
                <MotionMenu key="menu" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.1 }}>
                    <Div className="menulist" onClick={() => setCurrentView('background')}>
                        <Img className="background" src="./assets/icons/background.svg" />
                        <Text>배경화면</Text>
                    </Div>
                    <Div className="menulist" onClick={openAppStoreReview}>
                        <Img className="eval" src="./assets/icons/eval.svg" />
                        <Text>앱 평가하기</Text>
                    </Div>
                    <Div className="menulist" onClick={() => setCurrentView('info')}>
                        <Img className="info" src="./assets/icons/info.svg" />
                        <Text>정보</Text>
                    </Div>
                </MotionMenu>
            ) : (
                <Div className="afterclick">
                    <Div className="backbtn">
                        <Img className="back" src="./assets/icons/back.svg" onClick={goBackToMenu} />
                        <Text className="backbtn">
                            {currentView === 'background' && '배경화면 설정'}

                            {currentView === 'info' && '정보'}
                        </Text>
                    </Div>

                    {/* 배경화면 설정 화면 */}
                    {currentView === 'background' && (
                        <MotionContent
                            key="background-setting"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.1 }}
                        >
                            <Div>
                                <Text className="imgtext">Images</Text>
                                <Div className="backimg">
                                    {backgroundImages.map((imgName) => (
                                        <Btn
                                            key={imgName}
                                            onClick={() => setBackgroundImage(`./assets/images/${imgName}`)}
                                            style={{ backgroundImage: `url(./assets/images/${imgName})` }}
                                        />
                                    ))}
                                </Div>
                            </Div>
                        </MotionContent>
                    )}

                    {/* 정보 화면 */}
                    {currentView === 'info' && (
                        <MotionContent
                            key="info-content"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.1 }}
                        >
                            <Div className="content-container">
                                <InfoItem>
                                    <InfoLabel>버전</InfoLabel>
                                    <InfoValue>0.1.0</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>개발자</InfoLabel>
                                    <InfoValue>Jaegwang</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>연락처</InfoLabel>
                                    <InfoValue>jaegwang1238@gmail.com</InfoValue>
                                </InfoItem>
                            </Div>
                        </MotionContent>
                    )}
                </Div>
            )}
        </AnimatePresence>
    );
}

const Div = styled.div`
    &.afterclick {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    &.backbtn {
        display: flex;
        align-items: center;
    }
    &.backimg {
        display: flex;
        gap: 13px;
        width: 100%;
        flex-wrap: wrap;
    }
    &.menulist {
        &:hover {
            background-color: #f2f2f3;
            border-radius: 10px;
            cursor: pointer;
        }
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 10px;
        cursor: pointer;
        width: 200px;
    }
    &.content-container {
        padding: 15px 0;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
`;

const Img = styled.img`
    text-shadow: 0.3px 0px #000, 0px 0.3px #000, -0.3px 0px #000, 0px -0.3px #000;

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
        cursor: pointer;
        width: 30px;
    }
`;

const Text = styled.p`
    color: black;
    margin: 0;
    font-weight: 700;

    &.imgtext {
        text-align: start;
        margin: 15px 0;
        font-size: 18px;
        font-weight: 600;
    }
    &.backbtn {
        font-size: 18px;
        margin-left: 10px;
    }
    &.content-title {
        text-align: start;
        margin: 15px 0;
        font-size: 18px;
        font-weight: 600;
    }
`;

const Btn = styled.button`
    cursor: pointer;
    width: 54px;
    height: 54px;
    border-radius: 5px;
    min-width: 50px;
    border: none;
    background: none;
    background-size: cover;
`;

const MotionContent = styled(motion.div)`
    display: flex;
    flex-direction: column;
    color: black;
    width: 100%;
`;

const MotionMenu = styled(motion.div)`
    text-align: start;
    margin-top: 25px;
`;

// 정보 화면 스타일
const InfoItem = styled.div`
    display: flex;
    padding: 10px 15px 10px 0;
    border-bottom: 1px solid #f1f1f1;
`;

const InfoLabel = styled.span`
    font-weight: 600;
    min-width: 60px;
`;

const InfoValue = styled.span`
    color: #666;
`;
