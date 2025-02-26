import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface ListProps {
    onClose: () => void;
    onTaskSelect: (task: string | null) => void;
    seconds: number;
    sendTime: (time: number) => void;
}

export default function TodoList({ onClose, onTaskSelect, seconds, sendTime }: ListProps) {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState<{ text: string; checked: boolean; selected: boolean; timer: number }[]>(() => {
        // 로컬스토리지에서 기존 할 일 목록 불러오기
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [showInput, setShowInput] = useState(false); // 입력창 표시 여부
    const inputRef = useRef<HTMLInputElement>(null);
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };
    const handleDeleteTask = (index: number, e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 전파 중지
        setTasks(tasks.filter((_, i) => i !== index));

        const prevSelected = tasks.findIndex((task) => task.selected);
        if (prevSelected === index) {
            onTaskSelect(null);
        }
    };

    const handleTaskSelect = (index: number) => {
        const updatedTasks = [...tasks];
        const prevSelected = updatedTasks.findIndex((task) => task.selected);

        sendTime(tasks[index].timer);
        if (prevSelected !== -1) {
            // 이전 선택된 것이 동일한 index라면 선택 해제
            if (prevSelected === index) {
                updatedTasks[prevSelected].selected = false;
                onTaskSelect(null); // null 값 전달
            } else {
                updatedTasks[prevSelected].selected = false;
                updatedTasks[index].selected = true;
                onTaskSelect(updatedTasks[index].text);
            }
        } else {
            updatedTasks[index].selected = true;
            onTaskSelect(updatedTasks[index].text);
        }
        // 상태 업데이트
        setTasks(updatedTasks);
    };

    const addTask = () => {
        if (task.trim()) {
            const updatedTasks = [...tasks, { text: task, checked: false, selected: false, timer: 0 }];
            setTasks(updatedTasks.sort((a, b) => Number(a.checked) - Number(b.checked)));
            setTask('');
            setShowInput(false); // 입력 후 입력창 닫기
        }
    };
    useEffect(() => {
        setTasks((prevTasks) => prevTasks.map((task) => (task.selected ? { ...task, timer: seconds } : task)));
    }, [seconds]);
    useEffect(() => {
        inputRef.current?.focus();
    }, [addTask]);

    // 로컬에 list 저장
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const toggleCheck = (index: number, isChecked: boolean) => {
        const realIndex = tasks.findIndex((t, i) => {
            if (isChecked) {
                return t.checked && tasks.filter((t) => t.checked).indexOf(t) === index;
            } else {
                return !t.checked && tasks.filter((t) => !t.checked).indexOf(t) === index;
            }
        });

        if (realIndex !== -1) {
            const updatedTasks = [...tasks];
            updatedTasks[realIndex].checked = !updatedTasks[realIndex].checked;

            if (updatedTasks[realIndex].selected) {
                updatedTasks[realIndex].selected = false;
                onTaskSelect(null);
            }

            setTasks(updatedTasks.sort((a, b) => Number(a.checked) - Number(b.checked)));
        }
    };
    const activeEnter = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    return (
        <Container>
            <TitleBar>
                <Text>오늘 할 일</Text>
                <Img className="close" onClick={onClose} src="../assets/images/pagedown.svg" />
            </TitleBar>

            <TaskList>
                {/* 미완료된 할 일 목록 */}
                {tasks
                    .filter((task) => !task.checked)
                    .map((task, index) => (
                        <Task checked={task.checked} key={index} isSelected={task.selected} onClick={() => handleTaskSelect(index)}>
                            <CheckContainer
                                checked={task.checked}
                                onMouseUp={() => {
                                    toggleCheck(index, false);
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CheckIcon />
                            </CheckContainer>
                            <TaskText checked={task.checked} className="task">
                                {task.text}
                            </TaskText>

                            <Div className="timer">{formatTime(task.timer)}</Div>
                            <Img className="list" onClick={(e) => handleDeleteTask(index, e)} src="../assets/images/cancel.svg" />
                        </Task>
                    ))}

                {showInput && (
                    <InputWrapper>
                        <Input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            onKeyDown={(e) => activeEnter(e)}
                            placeholder="할 일을 입력하세요"
                            ref={inputRef}
                        />
                        <InputBtnWrapper>
                            <InputBtn onClick={addTask}>저장</InputBtn>
                            <InputBtn
                                className="cancel"
                                onClick={() => {
                                    setTask('');
                                    setShowInput(false);
                                }}
                            >
                                취소
                            </InputBtn>
                        </InputBtnWrapper>
                    </InputWrapper>
                )}

                {/* 완료된 할 일 목록 */}
                {tasks
                    .filter((task) => task.checked)
                    .map((task, index) => (
                        <Task checked={task.checked} key={index}>
                            <CheckContainer
                                checked={task.checked}
                                onMouseUp={() => {
                                    toggleCheck(index, true);
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CheckIcon />
                            </CheckContainer>
                            <TaskText checked={task.checked} className="task">
                                {task.text}
                            </TaskText>
                            <Div className="timer">{formatTime(task.timer)}</Div>
                            <Img
                                className="list"
                                onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                                src="../assets/images/cancel.svg"
                            />
                        </Task>
                    ))}
                {!showInput && (
                    <AddTask onClick={() => setShowInput(true)}>
                        <Img src="../assets/images/is.svg" />
                        <Text className="addtask">할 일 추가하기</Text>
                    </AddTask>
                )}
            </TaskList>
        </Container>
    );
}

// 스타일 컴포넌트
const Div = styled.div`
    color: black;
    margin-bottom: 2px;
    font-weight: 600;
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    flex: 1;
    border-radius: 10px;
`;
const TaskText = styled.div<{ checked: boolean }>`
    font-size: 14px;
    margin: 5px 5px 5px 0;
    width: 100%;
    text-align: left;
    font-weight: 600;
    color: ${(props) => (props.checked ? '#9CA3AF' : 'black')};
    text-decoration: ${(props) => (props.checked ? 'line-through' : 'none')};
`;
const Text = styled.p`
    font-size: 18px;
    color: black;
    margin: 0;
    font-weight: bold;
    &.addtask {
        margin-left: 10px;
        font-size: 14px;
    }
    &.timer {
    }
`;
const AddTask = styled.div`
    display: flex;
    border-radius: 10px;
    height: 50px;
    cursor: pointer;
    align-items: center;
    border: 2px dashed #c8c8c8;
    padding-left: 10px;
    cursor: pointer;
    margin-top: 10px;
`;
const InputBtn = styled.button`
    cursor: pointer;
    margin-right: 10px;
    color: white;
    background-color: #3a82f7;
    border: none;
    font-weight: 600;
    border-radius: 4px;
    padding: 4px 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #1e5ebe;
    }

    &:active {
        background-color: #1e5ebe;
    }
    &.cancel {
        background-color: transparent;
        &:hover {
            background-color: #85a4d3;
            color: #1e5ebe;
            border: 1px solid #85a4d3;
        }
        color: black;
        border: 1px solid black;
    }
`;
const InputBtnWrapper = styled.div`
    display: flex;
    margin: 0 0 10px 10px;
`;
const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 10px;
`;

const Input = styled.input`
    &:focus {
        outline: none;
        border: none;
    }
    &::placeholder {
        font-weight: 500;
        color: #acacac;
    }
    flex: 1;
    color: black;
    font-weight: 500;
    padding: 10px 12px;
    border-radius: 5px;
    font-size: 14px;
    background-color: transparent;
    border: none;
    margin: 5px 0;
`;

const TaskList = styled.div`
    width: 100%;
    margin-top: 10px;
    overflow-y: auto; /* 세로 스크롤만 */
    max-height: 410px;
`;

const Task = styled.div<{ checked: boolean; isSelected?: boolean }>`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    cursor: pointer;
    align-items: center;
    background-color: ${(props) => (props.checked ? '#EFF1F3' : '')};
    border: solid ${(props) => (props.isSelected ? '1.5px #3a82f7' : '1px #c8c8c8')};
    border-radius: 10px;
    height: ${(props) => (props.isSelected ? '40px' : '')};
    margin: 10px 0;
`;

const TitleBar = styled.div`
    display: flex;
    width: 100%;
    position: relative;
    justify-content: center;
`;
const Img = styled.img`
    &.close {
        position: absolute;
        right: 10px;
        top: 10%;
    }
    &.list {
        margin-left: 10px;
    }
    cursor: pointer;
`;
const CheckContainer = styled.div<{ checked: boolean }>`
    width: 23px;
    height: 18px;
    border-radius: 50%;
    border: ${(props) => (props.checked ? '1px solid #94A3B8' : '1px solid #333333')};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease, transform 0.1s ease-in-out;
    margin-right: 8px;
    background-color: ${(props) => (props.checked ? '#9CA3AF' : 'transparent')};
    &:hover {
        border-color: #888;
    }

    &:active {
        ${(props) =>
            !props.checked &&
            `
            border: 1px solid #4caf50;
            background-color: #4caf50;
            transform: scale(1.3);
        `}
    }
`;

const CheckIcon = styled.div`
    width: 10px;
    height: 10px;
    background-size: cover;
    background-position: center;
    background-image: url('/assets/images/done.svg');
`;
