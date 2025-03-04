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
                    <Div className="backbtn">
                        <Img className="back" src="../assets/images/back.svg" onClick={() => setShowBackgroundSetting(false)} />
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
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg.jpg')} />
                                <Btn bgimg={'backimg1.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
                                <Btn bgimg={'backimg.jpg'} onClick={() => setBackgroundImage('../assets/images/backimg1.jpg')} />
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
const Btn = styled.button<{ bgimg: string }>`
    cursor: pointer;
    width: 54px;
    height: 54px;
    border-radius: 5px;
    min-width: 50px;
    border: none;
    background: none;
    background-image: ${({ bgimg }) => `url(../assets/images/${bgimg})`};
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
