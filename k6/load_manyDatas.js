import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '5s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],
        'page loading complete': ['p(99)<1500'],
    },
};

const BASE_URL = 'https://all-forone.p-e.kr/stations';

export default function ()  {
    let pageResponse = http.get(BASE_URL);
    check(pageResponse, { 'page loading complete': (response) => response.status === 200 });
    let pathResponse = http.get(`${BASE_URL}/paths?source=1&target=5`);
    check(pathResponse, {'find path': (response) => response.status === 200});
    sleep(1);
};