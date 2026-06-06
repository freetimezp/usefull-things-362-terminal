gsap.registerPlugin(ScrollTrigger, Draggable);

/* -------------------------
   LENIS smooth scroll
------------------------- */
const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", (e) => {
    ScrollTrigger.update();

    // subtle depth shift
    particles.rotation.z = e.scroll * 0.0001;
});

/* -------------------------
   HERO INTRO SEQUENCE
------------------------- */
window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.from(".glass", { y: -30, opacity: 0, duration: 0.8 })
        .from(".hero h1", { y: 60, opacity: 0, duration: 1 })
        .from(".hero .fade", { opacity: 0, y: 20, duration: 0.8 });

    gsap.set(".terminal", {
        opacity: 0,
        y: 30,
        scale: 0.98,
    });
});

/* -------------------------
   SIMPLE "SplitText" effect
   (manual char split)
------------------------- */
const split = document.querySelector(".split");
if (split) {
    const text = split.innerText;
    split.innerHTML = "";

    text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        split.appendChild(span);
    });

    gsap.from(".split span", {
        opacity: 0,
        y: 50,
        stagger: 0.03,
        duration: 0.8,
        delay: 0.5,
    });
}

/* -------------------------
   SCROLL TRIGGER SECTIONS
------------------------- */
gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
    });
});

/* -------------------------
   HERO PARALLAX EFFECT
------------------------- */
gsap.to(".hero h1", {
    scale: 1.2,
    opacity: 0,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
    },
});

/* -------------------------
   THREE.JS BACKGROUND
------------------------- */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true,
    antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* -------------------------
   PARTICLES
------------------------- */
const particlesCount = 1200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    size: 0.01,
    color: 0x66ccff,
    transparent: true,
    opacity: 0.7,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 3;

/* -------------------------
   ANIMATION LOOP
------------------------- */
function animate() {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    renderer.render(scene, camera);
}

animate();

/* -------------------------
   RESIZE HANDLER
------------------------- */
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* -------------------------
   PAGE TRANSITION SYSTEM
------------------------- */

const transitionLayer = document.querySelector(".transition-layer");

function pageWipe(callback) {
    const tl = gsap.timeline();

    tl.to(transitionLayer, {
        scaleY: 1,
        duration: 0.6,
        ease: "power4.inOut",
    }).to(transitionLayer, {
        scaleY: 0,
        duration: 0.6,
        ease: "power4.inOut",
        delay: 0.1,
        onComplete: callback,
    });
}

document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) return;

        pageWipe(() => {
            lenis.scrollTo(target, {
                duration: 1.2,
                easing: (t) => 1 - Math.pow(1 - t, 3),
            });
        });
    });
});

gsap.utils.toArray("section").forEach((sec) => {
    ScrollTrigger.create({
        trigger: sec,
        start: "top 60%",
        onEnter: () => {
            gsap.to(sec, { filter: "brightness(1.1)", duration: 0.3 });
        },
        onLeaveBack: () => {
            gsap.to(sec, { filter: "brightness(1)", duration: 0.3 });
        },
    });
});

gsap.utils.toArray(".step").forEach((step, i) => {
    gsap.to(step, {
        scrollTrigger: {
            trigger: step,
            start: "top 85%",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.05,
        ease: "power3.out",
    });
});

gsap.utils.toArray(".step").forEach((step) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        onEnter: () => {
            gsap.to(step.querySelector(".dot"), {
                scale: 1.5,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
            });
        },
    });
});

//terminal
const terminalEl = document.getElementById("terminal");
const dragHandle = document.getElementById("terminal-drag");
const terminal = document.getElementById("terminal-output");

let offsetX = 0;
let offsetY = 0;

let terminalActive = false;

gsap.set(terminalEl, {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.98,
});

const messages = [
    "initializing rendering core...",
    "loading UI modules...",
    "synchronizing scroll engine...",
    "connecting GSAP timeline...",
    "activating parallax system...",
    "mounting glass interface layers...",
    "optimizing particle field...",
    "system ready.",
];

function bringTerminalFront() {
    gsap.set(terminalEl, {
        zIndex: 999999,
    });
}

ScrollTrigger.create({
    trigger: ".story",
    start: "top 80%",
    once: true,
    onEnter: () => {
        if (terminalActive) return; // 🚨 important guard
        startStream();
    },
});

function getTime() {
    const d = new Date();
    return d.toLocaleTimeString();
}

function typeLine(text, callback) {
    const line = document.createElement("div");
    line.className = "line";

    const time = document.createElement("span");
    time.className = "time";
    time.innerText = `[${getTime()}] SYSTEM >`;

    const content = document.createElement("span");

    line.appendChild(time);
    line.appendChild(content);
    terminal.appendChild(line);

    let i = 0;

    function type() {
        if (i < text.length) {
            content.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
            i++;
            setTimeout(type, 25 + Math.random() * 40);
        } else {
            content.innerHTML = text;
            gsap.to(line, { opacity: 1, y: 0, duration: 0.4 });

            if (callback) callback();
        }
    }

    type();
}

let opened = false;

function openTerminal(callback) {
    if (opened) {
        callback?.();
        return;
    }

    opened = true;
    terminalActive = true;

    gsap.to(".terminal", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
            gsap.set(".terminal", { display: "block" });
        },
        onComplete: callback,
    });
}

let index = 0;

function startStream() {
    if (index >= messages.length) return;

    openTerminal(() => {
        typeLine(messages[index], () => {
            index++;
            setTimeout(startStream, 500);
        });
    });
}

Draggable.create(terminalEl, {
    type: "x,y",
    trigger: dragHandle,
    inertia: true,

    onDrag() {
        lastX = this.x;
        lastY = this.y;

        gsap.set(terminalEl, {
            x: gsap.getProperty(terminalEl, "x"),
            y: gsap.getProperty(terminalEl, "y"),
        });
    },
});

//taskbar
let isMinimized = false;
const taskItem = document.getElementById("terminal-task");

let lastX = 0;
let lastY = 0;

function minimizeTerminal() {
    if (isMinimized) return;
    isMinimized = true;

    lastX = gsap.getProperty(terminalEl, "x");
    lastY = gsap.getProperty(terminalEl, "y");

    gsap.to(terminalEl, {
        opacity: 0,
        scale: 0.2,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => {
            terminalEl.style.display = "none";
        },
    });
}

function restoreTerminal() {
    if (!isMinimized) return;
    isMinimized = false;

    terminalEl.style.display = "block";
    bringTerminalFront();

    gsap.set(terminalEl, {
        x: lastX,
        y: lastY,
        opacity: 0,
        scale: 0.2,
    });

    gsap.to(terminalEl, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
    });
}

taskItem.addEventListener("click", () => {
    restoreTerminal();
});

document.getElementById("minimize-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    minimizeTerminal();
});

//work
gsap.to(".work-card", {
    scrollTrigger: {
        trigger: "#work",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
    rotateX: 8,
    rotateY: -8,
    transformPerspective: 1000,
    stagger: 0.05,
});

gsap.to(".work", {
    scrollTrigger: {
        trigger: "#work",
        scrub: true,
    },
    rotateX: 2,
    rotateY: -2,
});
