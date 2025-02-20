import React from 'react';

import styled from 'styled-components';

export default function App() {
    return (
        <Div>
            <Text>유진영 hi</Text>
        </Div>
    );
}

const Div = styled.div`
    background-color: black;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Text = styled.p`
    color: white;
    margin: 20px 0;
`;
