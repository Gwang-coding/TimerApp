let time = 0;
let intervalId = null;

self.onmessage = function (e) {
    if (e.data === 'start') {
        if (!intervalId) {
            intervalId = setInterval(() => {
                time += 1;
                self.postMessage(time);
            }, 1000);
        }
    } else if (e.data === 'stop') {
        clearInterval(intervalId);
        intervalId = null;
    } else if (e.data === 'reset') {
        time = 0;
        self.postMessage(time);
    } else if (typeof e.data === 'object' && e.data.command === 'set') {
        // 새로운 시간 값을 설정하는 메시지 처리
        time = e.data.time;
        self.postMessage(time);
    }
};
