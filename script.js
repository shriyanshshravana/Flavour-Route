/* =========================================================
   FLAVOURROUTE
   VANILLA JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const carousel = document.getElementById("carousel");
const carouselTrack = document.getElementById("carouselTrack");

const slides = document.querySelectorAll(".slide");
const indicators = document.querySelectorAll(".indicator");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const emptyState = document.getElementById("emptyState");

const formMessage = document.getElementById("formMessage");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const addCuisineButtons =
    document.querySelectorAll(".add-cuisine");

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

const navItems =
    document.querySelectorAll(".nav-link");


/* =========================================================
   CAROUSEL
========================================================= */

let currentSlide = 0;

let autoplayTimer = null;

const AUTOPLAY_TIME = 5000;


/*
   Move carousel to selected slide
*/

function showSlide(index) {

    currentSlide =
        (index + slides.length) % slides.length;

    carouselTrack.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === currentSlide
        );

    });

    indicators.forEach((indicator, index) => {

        indicator.classList.toggle(
            "active",
            index === currentSlide
        );

    });
}


/*
   Next slide
*/

function nextSlide() {

    showSlide(currentSlide + 1);

    resetAutoplay();

}


/*
   Previous slide
*/

function previousSlide() {

    showSlide(currentSlide - 1);

    resetAutoplay();

}


/*
   Next / Previous buttons
*/

nextBtn.addEventListener(
    "click",
    nextSlide
);

prevBtn.addEventListener(
    "click",
    previousSlide
);


/*
   Indicator buttons
*/

indicators.forEach((indicator) => {

    indicator.addEventListener(
        "click",
        () => {

            const slideIndex =
                Number(
                    indicator.dataset.slide
                );

            showSlide(slideIndex);

            resetAutoplay();

        }
    );

});


/* =========================================================
   AUTOPLAY
========================================================= */

function startAutoplay() {

    stopAutoplay();

    autoplayTimer = setInterval(
        () => {

            showSlide(
                currentSlide + 1
            );

        },
        AUTOPLAY_TIME
    );

}


function stopAutoplay() {

    if (autoplayTimer !== null) {

        clearInterval(
            autoplayTimer
        );

        autoplayTimer = null;

    }

}


function resetAutoplay() {

    stopAutoplay();

    startAutoplay();

}


/*
   Pause while user is hovering
*/

carousel.addEventListener(
    "mouseenter",
    stopAutoplay
);

carousel.addEventListener(
    "mouseleave",
    startAutoplay
);


/*
   Pause while user is interacting
*/

carousel.addEventListener(
    "focusin",
    stopAutoplay
);

carousel.addEventListener(
    "focusout",
    startAutoplay
);


/* =========================================================
   KEYBOARD CAROUSEL CONTROL
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
           Do not control carousel when typing
           inside an input.
        */

        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }


        if (event.key === "ArrowRight") {

            nextSlide();

        }


        if (event.key === "ArrowLeft") {

            previousSlide();

        }

    }
);


/* =========================================================
   MOBILE SWIPE
========================================================= */

let touchStartX = 0;

let touchEndX = 0;

carousel.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

        stopAutoplay();

    },
    { passive: true }
);


carousel.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

        startAutoplay();

    },
    { passive: true }
);


function handleSwipe() {

    const swipeDistance =
        touchStartX - touchEndX;

    const minimumDistance = 50;


    if (
        Math.abs(swipeDistance) <
        minimumDistance
    ) {

        return;

    }


    if (swipeDistance > 0) {

        showSlide(
            currentSlide + 1
        );

    } else {

        showSlide(
            currentSlide - 1
        );

    }

}


/* =========================================================
   TASK DATA
========================================================= */

let tasks = loadTasks();

let currentFilter = "all";


/*
   Generate unique ID
*/

function generateTaskId() {

    return Date.now() +
        Math.random()
            .toString(36)
            .slice(2);

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "flavourRouteTasks",
        JSON.stringify(tasks)
    );

}


function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(
                "flavourRouteTasks"
            );

        return savedTasks
            ? JSON.parse(savedTasks)
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   ADD TASK
========================================================= */

taskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        addTask(
            taskInput.value,
            "PERSONAL PICK"
        );

    }
);


function addTask(
    text,
    source = "PERSONAL PICK"
) {

    const cleanText =
        text.trim();


    /*
       Reject empty input
    */

    if (!cleanText) {

        showFormMessage(
            "Please enter something you'd like to try."
        );

        taskInput.focus();

        return;

    }


    /*
       Prevent duplicate tasks
    */

    const duplicate =
        tasks.some(
            (task) =>
                task.text.toLowerCase() ===
                cleanText.toLowerCase()
        );


    if (duplicate) {

        showFormMessage(
            "This item is already in your journey."
        );

        taskInput.focus();

        return;

    }


    const newTask = {

        id: generateTaskId(),

        text: cleanText,

        completed: false,

        source: source

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    clearFormMessage();

    showToast(
        `"${cleanText}" added to your journey.`
    );

}


/* =========================================================
   CAROUSEL → FOOD JOURNEY
========================================================= */

addCuisineButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const taskText =
                    button.dataset.task;

                addTask(
                    taskText,
                    "FROM CUISINE"
                );

            }
        );

    }
);


/* =========================================================
   RENDER TASKS
========================================================= */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    /*
       Empty state depends on
       the current filter.
    */

    if (filteredTasks.length === 0) {

        taskList.style.display = "none";

        emptyState.style.display = "block";

    } else {

        taskList.style.display = "flex";

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(
        (task) => {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(
                taskElement
            );

        }
    );


    updateCounters();

    updateProgress();

}


/* =========================================================
   CREATE TASK ELEMENT
========================================================= */

function createTaskElement(task) {

    const article =
        document.createElement("article");

    article.className =
        "task-item";

    if (task.completed) {

        article.classList.add(
            "completed"
        );

    }


    /*
       Complete button
    */

    const checkButton =
        document.createElement("button");

    checkButton.className =
        "task-check";

    checkButton.type = "button";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as not completed"
            : "Mark task as completed"
    );

    checkButton.innerHTML =
        task.completed
            ? "✓"
            : "";


    checkButton.addEventListener(
        "click",
        () => {

            toggleTask(
                task.id
            );

        }
    );


    /*
       Task details
    */

    const details =
        document.createElement("div");

    details.className =
        "task-details";


    const text =
        document.createElement("span");

    text.className =
        "task-text";

    text.textContent =
        task.text;


    const source =
        document.createElement("span");

    source.className =
        "task-source";

    source.textContent =
        task.source;


    details.appendChild(text);

    details.appendChild(source);


    /*
       Delete button
    */

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-task";

    deleteButton.type = "button";

    deleteButton.setAttribute(
        "aria-label",
        `Delete ${task.text}`
    );

    deleteButton.innerHTML =
        "×";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteTask(
                task.id
            );

        }
    );


    article.appendChild(
        checkButton
    );

    article.appendChild(
        details
    );

    article.appendChild(
        deleteButton
    );


    return article;

}


/* =========================================================
   GET FILTERED TASKS
========================================================= */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            (task) =>
                !task.completed
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            (task) =>
                task.completed
        );

    }


    return tasks;

}


/* =========================================================
   COMPLETE TASK
========================================================= */

function toggleTask(taskId) {

    tasks =
        tasks.map(
            (task) => {

                if (
                    task.id === taskId
                ) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }

                return task;

            }
        );


    saveTasks();

    renderTasks();

}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(taskId) {

    const task =
        tasks.find(
            (item) =>
                item.id === taskId
        );


    tasks =
        tasks.filter(
            (item) =>
                item.id !== taskId
        );


    saveTasks();

    renderTasks();


    if (task) {

        showToast(
            `"${task.text}" removed.`
        );

    }

}


/* =========================================================
   COUNTERS
========================================================= */

function updateCounters() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;

    const remaining =
        total - completed;


    totalCount.textContent =
        total;

    completedCount.textContent =
        completed;

    remainingCount.textContent =
        remaining;

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function updateProgress() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    progressBar.style.width =
        `${progress}%`;

    progressText.textContent =
        `${progress}%`;

}


/* =========================================================
   FILTERS
========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    (item) => {

                        item.classList.toggle(
                            "active",
                            item === button
                        );

                    }
                );


                renderTasks();

            }
        );

    }
);


/* =========================================================
   FORM MESSAGES
========================================================= */

function showFormMessage(message) {

    formMessage.textContent =
        message;

}


function clearFormMessage() {

    formMessage.textContent =
        "";

}


/*
   Clear validation message
   as soon as the user starts typing.
*/

taskInput.addEventListener(
    "input",
    clearFormMessage
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            navLinks.classList.toggle(
                "open"
            );

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    }
);


/*
   Close menu when navigation
   link is clicked.
*/

navItems.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "open"
                );

                menuToggle.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        navItems.forEach(
                            (link) => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                );

                            }
                        );

                    }

                }
            );

        },
        {
            threshold: 0.25
        }
    );


sections.forEach(
    (section) => {

        observer.observe(
            section
        );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

showSlide(0);

renderTasks();

startAutoplay();