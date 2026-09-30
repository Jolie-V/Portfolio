/* =========================================================
   PROJECT DATA
========================================================= */

const projects = {

    cardzap: {

        title:
            "CardZap: An AI-powered File Converter Tool for Interactive Learning",

        image:
            "assets/images/cardzap/5.png",

        stack: [
            "React",
            "Supabase",
            "Google Gemini AI",
            "JavaScript"
        ],

        description:
            "An AI-powered web application designed to transform learning materials into interactive flashcards.",

        overview:
            "CardZap allows users to work with learning materials and generate interactive flashcard content. The project combines a web-based interface with AI-assisted content generation and database functionality.",

        role:
            "Full-Stack Developer",

        technologies:
            "React, JavaScript, Supabase, Google Gemini API, HTML, CSS",

        live:
            "YOUR_CARDZAP_URL"

    },


    docutrack: {

        title:
            "DocuTrack",

        image:
            "assets/images/docutrack/1.png",

        stack: [
            "PHP",
            "PostgreSQL",
            "QR Code",
            "JavaScript"
        ],

        description:
            "A web-based document tracking system designed to support document routing, receiving, acceptance, and monitoring.",

        overview:
            "The system provides a centralized workflow for tracking documents across offices and departments. QR codes are used to identify documents and assist with monitoring their movement through the workflow.",

        role:
            "IT Intern / Developer",

        technologies:
            "PHP, PostgreSQL, JavaScript, Tailwind CSS, QR Code, HTML, CSS",

        live:
            "YOUR_DOCUTRACK_URL"

    },


    shopfootas: {

        title:
            "ShopFootas",

        image:
            "",

        stack: [
            "PHP",
            "MySQL",
            "JavaScript",
            "Bootstrap"
        ],

        description:
            "An e-commerce web application developed as an academic project for browsing and purchasing shoes.",

        overview:
            "ShopFootas provides an online shopping experience with database-driven product information and e-commerce functionality.",

        role:
            "Project Manager & Lead Backend Developer",

        technologies:
            "PHP, MySQL, HTML, CSS, JavaScript, Bootstrap, Figma, GitHub",

        live:
            "YOUR_SHOPFOOTAS_URL"

    }

};


/* =========================================================
   GET PROJECT ID FROM URL
========================================================= */

const params =
    new URLSearchParams(window.location.search);

const projectId =
    params.get('id');


/* =========================================================
   FIND PROJECT
========================================================= */

const project =
    projects[projectId];


/* =========================================================
   DISPLAY PROJECT
========================================================= */

if (project) {

    document.title =
        `${project.title} | jolie_V`;


    document.getElementById(
        'project-title'
    ).textContent =
        project.title;


    const projectImage =
        document.getElementById('project-image');

    if (project.image) {
        projectImage.src = project.image;
    } else {
        projectImage.closest('.project-details-image').hidden = true;
        document.querySelector('.project-details-grid').classList.add(
            'project-details-grid--no-image'
        );
    }


    projectImage.alt =
        project.title;


    document.getElementById(
        'project-description'
    ).textContent =
        project.description;


    document.getElementById(
        'project-overview'
    ).textContent =
        project.overview;


    document.getElementById(
        'project-role'
    ).textContent =
        project.role;


    document.getElementById(
        'project-technologies'
    ).textContent =
        project.technologies;


    document.getElementById(
        'project-live-link'
    ).href =
        project.live;


    /* Create technology tags */

    const stackContainer =
        document.getElementById(
            'project-stack'
        );


    project.stack.forEach(technology => {

        const tag =
            document.createElement('span');

        tag.textContent =
            technology;

        stackContainer.appendChild(tag);

    });


} else {

    /*
     * If someone manually enters an invalid
     * project ID, send them back to projects.
     */

    window.location.href =
        'index.html#projects';

}