<script setup>
import { ref, inject, onMounted, watch } from 'vue';

onMounted(() => {
const colElms = [];

    function getTimeStr(date = new Date()) {
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map((item) => item.toString().padStart(2, "0"))
            .join("");
    }

    function createCol() {
        const createEl = (cls) => {
            const div = document.createElement("div");
            div.classList.add(cls);
            return div;
        };
        const [col, flip, flipNext, flipCurr, next, curr] = ["col", "flip", "next", "curr", "next", "curr"].map(
            (cls) => createEl(cls)
        );
        flip.append(flipNext, flipCurr);
        col.append(flip, next, curr);
        time.append(col);
        return {
            toggleActive: () => flip.classList.toggle("active"),
            getCurr: () => curr.dataset.t,
            setCurr: (t) => [flipCurr, curr].forEach((el) => (el.dataset.t = t)),
            setNext: (t) => [flipNext, next].forEach((el) => (el.dataset.t = t)),
        };
    }

    for (let i = 0; i < 6; i++) {
        colElms.push(createCol());
    }

    const timeStr = getTimeStr();
    colElms.forEach(({ setCurr }, i) => {
        setCurr(timeStr[i]);
    });

    let lastSec = new Date().getSeconds();
    function updateTime() {
        let s = new Date().getSeconds();
        if (s === lastSec) {
            return;
        }
        lastSec = s;
        const currStr = getTimeStr();
        colElms.forEach(({ toggleActive, getCurr, setCurr, setNext }, i) => {
            var currTxt = getCurr();
            setNext(currStr[i]);
            if (currTxt !== currStr[i]) {
                toggleActive();
                setTimeout(() => {
                    toggleActive();
                    setCurr(currStr[i]);
                }, 500);
            }
        });
    }

    function run() {
        updateTime();
        setTimeout(() => {
            run();
        }, 1000 / 60);
    }

    run();
});
</script>

<template>
    <div class="flip-clock-container">
        <div class="time" id="time"></div>
    </div>
</template>

<style>
    .flip-clock-container .time {
        width: 100%;
        inset: 0;
        justify-content: center;
        align-items: center;
        display: flex;
        gap: 0.5vw;
        font-family: sans-serif;
        font-weight: 700;
        overflow: hidden;
    }

    .flip-clock-container .col {
        width: 4vw;
        height: 60px;
        perspective: 60px;
    }
    .flip-clock-container .col:nth-child(3),
    .flip-clock-container .col:nth-child(5) {
        margin-left: 1vw;
    }

    .flip-clock-container .curr,
    .flip-clock-container .next {
        position: relative;
        width: 4vw;
        height: calc(60px / 2);
        font-size: 4vw;
        background: #f4f1e9;
        border-radius: 0.6vw;
        color: #847d72;
        overflow: hidden;
        box-sizing: border-box;
    }

    .flip-clock-container .flip .curr::before,
    .flip-clock-container .flip .next::before,
    .flip-clock-container .col > .curr::before,
    .flip-clock-container .col > .next::before {
        position: absolute;
        content: attr(data-t);
        line-height: 60px;
        text-align: center;
        height: 60px;
        left: 0;
        right: 0;
    }

    .flip-clock-container .flip .curr::before,
    .flip-clock-container .col > .next::before {
        top: 0;
    }

    .flip-clock-container .flip .next::before,
    .flip-clock-container .col > .curr::before {
        bottom: 0;
    }

    .flip-clock-container .flip .curr,
    .flip-clock-container .col > .next {
        border-bottom: 0.2vw solid #e6ddce;
    }

    .flip-clock-container .flip .next,
    .flip-clock-container .col > .curr {
        border-top: 0.2vw solid #e6ddce;
    }

    .flip-clock-container .flip .next {
        transform: rotateX(-180deg);
        backface-visibility: hidden;
    }

    .flip-clock-container .flip .curr {
        position: absolute;
        top: 0;
        backface-visibility: hidden;
    }

    .flip-clock-container .flip {
        position: absolute;
        width: 4vw;
        height: 60px;
        z-index: 1;
        transform-style: preserve-3d;
        transition: transform 0s;
        transform: rotateX(0);
    }

    .flip-clock-container .flip.active {
        transition: all 0.5s ease-in-out;
        transform: rotateX(-180deg);
    }
</style>
