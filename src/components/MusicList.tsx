import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

export default function MusicList({ onClose }: { onClose: () => void }) {
    return (
        <Container>
            <TitleBar>
                <ListTop>
                    <Img className="listimg" src="../assets/images/music.svg" />
                    <Text>Todo List</Text>
                </ListTop>
                <Img className="close" onClick={onClose} src="../assets/images/pagedown.svg" />
            </TitleBar>
        </Container>
    );
}
const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 10px;
`;
const ListTop = styled.div`
    display: flex;
    align-items: center;
`;
const Text = styled.p`
    font-size: 18px;
    color: black;
    margin: 0;
    font-weight: bold;
`;
const TitleBar = styled.div`
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
`;
const Img = styled.img`
    &.listimg {
        filter: brightness(0%);
        margin-right: 5px;
        height: 25px;
    }
    cursor: pointer;
`;
