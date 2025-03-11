import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
export default function Sidebar({ setBackgroundImage }: { setBackgroundImage: (img: string) => void }) {
    const [showBackgroundSetting, setShowBackgroundSetting] = useState(false);
    return (
        <AnimatePresence mode="wait">
            {!showBackgroundSetting ? (
                <MotionMenu key="menu" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.1 }}>
                    <Div className="menulist" onClick={() => setShowBackgroundSetting(true)}>
                        <Img className="background" src="../assets/icons/background.svg" />
                        <Text>배경화면</Text>
                    </Div>
                    <Div className="menulist">
                        <Img className="eval" src="../assets/icons/eval.svg" />
                        <Text>앱 평가하기</Text>
                    </Div>
                    <Div className="menulist">
                        <Img className="info" src="../assets/icons/info.svg" />
                        <Text>정보</Text>
                    </Div>
                </MotionMenu>
            ) : (
                <Div className="afterclick">
                    <Div className="backbtn">
                        <Img className="back" src="../assets/icons/back.svg" onClick={() => setShowBackgroundSetting(false)} />
                        <Text className="backbtn">배경화면 설정</Text>
                    </Div>

                    <MotionBackgroundSetting
                        key="background-setting"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.1 }}
                    >
                        <Div>
                            <Text className="imgtext">Images</Text>
                            <Div className="backimg">
                                <Btn $bgimg="img1.jpg" onClick={() => setBackgroundImage('../assets/images/img1.jpg')} />
                                <Btn $bgimg="img2.jpg" onClick={() => setBackgroundImage('../assets/images/img2.jpg')} />
                                <Btn $bgimg="img3.jpg" onClick={() => setBackgroundImage('../assets/images/img3.jpg')} />
                                <Btn $bgimg="img4.jpg" onClick={() => setBackgroundImage('../assets/images/img4.jpg')} />
                                <Btn $bgimg="img5.jpg" onClick={() => setBackgroundImage('../assets/images/img5.jpg')} />
                                <Btn $bgimg="img6.jpg" onClick={() => setBackgroundImage('../assets/images/img6.jpg')} />
                                <Btn $bgimg="img7.jpg" onClick={() => setBackgroundImage('../assets/images/img7.jpg')} />
                                <Btn $bgimg="img8.jpg" onClick={() => setBackgroundImage('../assets/images/img8.jpg')} />
                                <Btn $bgimg="img9.jpg" onClick={() => setBackgroundImage('../assets/images/img9.jpg')} />
                                <Btn $bgimg="img10.jpg" onClick={() => setBackgroundImage('../assets/images/img10.jpg')} />
                                <Btn $bgimg="img11.jpg" onClick={() => setBackgroundImage('../assets/images/img11.jpg')} />
                            </Div>
                        </Div>
                    </MotionBackgroundSetting>
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
    cursor: default;
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
`;
const Btn = styled.button<{ $bgimg: string }>`
    cursor: pointer;
    width: 54px;
    height: 54px;
    border-radius: 5px;
    min-width: 50px;
    border: none;
    background: none;
    background-image: ${({ $bgimg }) => `url(../assets/images/${$bgimg})`};
    background-size: cover;
`;
const MotionBackgroundSetting = styled(motion.div)`
    display: flex;
    flex-direction: column;
    color: black;
`;

const MotionMenu = styled(motion.div)`
    text-align: start;
    margin-top: 25px;
`;
