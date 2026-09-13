// content.js — Edit this file to update all site content.
// HTML tags are allowed in text values (<a>, <ul>, <strong>, etc.).
// After saving, hard-refresh the browser (Ctrl+Shift+R) to see changes.
//
// PROJECTS: each entry drives both the card on the main page and the detail page.
//   slug     — URL key: projects/project.html?id=<slug>
//   name     — display title
//   tags     — array of tag strings
//   meta     — role/affiliation/dates line
//   desc     — short blurb shown on the main page card
//   image    — { src, alt } hero image for the detail page (path relative to projects/)
//   overview — HTML string for the Overview section on the detail page
//   timeline — array of { date, text } for the Timeline section (null to hide)
//   gallery  — array of { src, alt } images (null to hide)
//   links    — array of { text, url } buttons (null to hide)

var SITE = {

    // ── Hero ──────────────────────────────────────────────────────────────────

    hero: {
        name:   'Hyungwoon Lee',
        role:   'Graduate Student, <a href="https://www.media.mit.edu/groups/fluid-interfaces/overview/" target="_blank" rel="noopener">Fluid Interfaces Group</a> @ <a href="https://www.media.mit.edu/" target="_blank" rel="noopener">MIT Media Lab</a>',
        // next:   'Incoming PhD &mdash; <a href="https://www.media.mit.edu/groups/fluid-interfaces/overview/" target="_blank" rel="noopener">Fluid Interfaces</a>, MIT Media Lab (Fall 2026)',
        email:  'hyung98 [at] media [dot] mit [dot] edu',
        github: 'https://github.com/lhw-1',
        scholar: 'https://scholar.google.com/citations?user=o_fP0WQAAAAJ&hl=en',
        medialab:  'https://www.media.mit.edu/groups/fluid-interfaces/group-members/',
        ahlab:  'https://ahlab.org/people/hyung-woon-lee/',
        cv:     'assets/cv.pdf',
        photo:  'assets/hyungwoon.jpg',
    },

    // ── News ──────────────────────────────────────────────────────────────────
    // Most recent first.

    news: [
        {
            date: 'Sep 2026',
            text: 'Starting my Masters program at the <a href="https://www.media.mit.edu/groups/fluid-interfaces/overview/" target="_blank" rel="noopener">Fluid Interfaces</a> group, MIT Media Lab, advised by Prof. <a href="https://www.media.mit.edu/people/pattie/overview/" target="_blank" rel="noopener">Pattie Maes</a>!',
        },
        // {
        //     date: 'Dec 2025',
        //     text: 'Paper presented at the NeurIPS Time Series for Health (TS4H) Workshop 2025. (<a href="#publications">see below</a>)',
        // },
        // {
        //     date: 'Apr 2025',
        //     text: 'Won the Outstanding Undergraduate Research Prize (OURP) 2024/25 for my final year project on acute cognitive stress detection.',
        // },
        // {
        //     date: 'Nov 2024',
        //     text: 'Joined the <a href="https://ahlab.org" target="_blank" rel="noopener">Augmented Human Lab</a> and <a href="https://chill.nus.edu.sg/" target="_blank" rel="noopener">CHILL @ NUS</a> as a full-time Research Engineer.',
        // },
    ],

    // ── About ─────────────────────────────────────────────────────────────────
    // paragraphs: array — each string becomes a <p>.
    // aside: rendered smaller and muted below the main paragraphs.

    about: {
        paragraphs: [
            'I am currently a graduate student at the <a href="https://www.media.mit.edu/groups/fluid-interfaces/overview/" target="_blank" rel="noopener">Fluid Interfaces Group</a> @ <a href="https://www.media.mit.edu/" target="_blank" rel="noopener">MIT Media Lab</a>, advised by Prof. <a href="https://www.media.mit.edu/people/pattie/overview/" target="_blank" rel="noopener">Pattie Maes</a>.',
            'My undergraduate studies were at the <a href="https://www.nus.edu.sg/" target="_blank" rel="noopener">National University of Singapore (NUS)</a>, double-majoring in <strong>Computer Science</strong> and <strong>Psychology</strong>, with an emphasis on machine learning and AI, as well as clinical and cognitive psychology. I was formerly a research engineer at the <a href="https://ahlab.org" target="_blank" rel="noopener">Augmented Human Lab</a> under Prof. <a href="https://www.comp.nus.edu.sg/cs/people/suranga/" target="_blank" rel="noopener">Suranga Nanayakkara</a>, and a research assistant with the <a href="https://www.keanjhsu.com" target="_blank" rel="noopener">Clinical Translational Sciences Lab</a> under Prof. <a href="https://fass.nus.edu.sg/psy/people/kean-hsu/" target="_blank" rel="noopener">Kean Hsu</a>. I was also a member of the leadership team and a senior tutor for CS1101S: Programming Methodology (taught by Prof. <a href="https://www.comp.nus.edu.sg/cs/people/henz/" target="_blank" rel="noopener">Martin Henz</a>), as well as a senior developer and project lead on the <a href="https://sourceacademy.nus.edu.sg/" target="_blank" rel="noopener">Source Academy</a> and <a href="https://markbind.org/" target="_blank" rel="noopener">MarkBind</a> open-source projects under NUS.',
        ],
        aside: ["One of my primary hobbies is music. My interest in music was sparked by video games - to be more specific, nintendo games that I played when I was young. When I first came to Singapore, I barely knew English (I commonly joke to my friends that I only knew five things: “yes”, “no”, “hello”, “goodbye”, “I love apples”. “I love apples” was one of those sentences that you get taught early on in Korean primary schools back then, for no real reason other than its simplicity). What fascinated me was how the music seemed to tell a story of its own, changing and evolving with different environments within the game. In secondary school, I started formally studying music as a subject - and I also took up bagpipes for my extra-curricular activity (a rare chance to learn a rare instrument). Since then, I have delved into digital music composition (initially using an alternatively-obtained version of FL Studio 12, now with a full licensed version of FL Studio), live performances (I play both piano and bagpipes), and even did my IB extended essay on music - comparing Tchaikovsky's incidental music for Hamlet with Shostakovich's film music for Hamlet. I've also continued as a competitive bagpiper; I started in secondary school in 2013, and I have since been involved with the bagpiping scene. I am currently part of the Singapore Pipe Band Association Exco (for logistics & event organization), and recently have been part of Singapore's Grade 4A Lion City Pipe Band.",
        "Throughout the years, video game music remains one of my lasting hobbies. I love to analyse and enjoy the interplay of narrative and music, and the distinct yet diverse styles brought out by composers from different cultures for different video game genres. Someday, I aim to start a blog about video game music... someday.",
        "Apart from music and video games, I have other hobbies (that might not yet warrant full paragraphs) like origami, digital art, storywriting, cooking, films and cinematography, self-study of history, mythology and philosophy, etc. I partake in each of these every now and then, but all of these diverse experiences do contribute towards my generalized knowledge base and gives me experiences that I can build on (especially history, mythology, and philosophy - these provide wonderful basis for how to reason about real world issues and challenges, and sometimes even complements research directions and interests).",]
    },

    // ── Research ──────────────────────────────────────────────────────────────

    research: {  
        lead: 'As a researcher and an engineer, I work on <strong>cognitive augmentation systems</strong>. In particular, my work focuses on using context-aware, multimodal AI technology alongside wearable sensing devices to augment <strong>learning</strong>, <strong>teaching</strong>, and <strong>critical thinking</strong>. My work sits at the intersection of HCI, HAI, machine learning, and cognitive sciences.',
        areas: [
            {
                title: 'HCI and Cognitive Augmentation',
                text: [
                    'Working with Prof. Suranga\'s AH Lab has been a blessing on my research journey - I was able to work with an interdisciplinary group of people, with experts from various domains such as information systems, interaction design, assistive technology, virtual reality, sensors and haptics, signal processing, machine learning, affective psychology, drone systems, communications and new media, UI/UX design, embedded systems, education pedagogy, clinical psychology... It has been, and continues to be, a great environment for new research ideas to be generated and ideated upon. My love for bridging fields together to generate interdisciplinary insights have so far thrived within the field of HCI, and I suspect that this will be the case for some time.',
                    'In particular, the HCI paradigm of <strong>human augmentation</strong> has inspired me quite a bit. The idea of designing and developing technology that can assist, enhance, or amplify human capabilities has been the core drive behind technological progress in history, and I am happy to contribute towards augmentation technology that addresses human cognitive capabilities - especially in terms of learning and memory. What I want to work on in the future is, by combining my technical skills with my theoretical knowledge, build impactful and lasting systems that can easily be integrated into our daily lives while extending our cognitive mind and capabilities.',
                ],
            },
            {
                title: 'Machine Learning and AI',
                text: [
                    'I was always interested in the idea of "learning" from the perspective of a learner and an educator. However, when I started my undergraduate studies in NUS, I was exposed early to machine learning and AI as a field, which was when I realized the potential of looking at "learning" from a mathematical, statistical perspective as well. Many of my earlier research projects (which would later spark my love for research) made use of machine learning and AI, and over time, I realized I like thinking about the problem formulation aspect of machine learning and AI; for instance, during my <a href="projects/project.html?id=program-classification">student program classification project</a> with Prof. Martin Henz, the most exciting part was formulating the student program into a representation and selecting the appropriate machine learning model and architecture, such that the different output categories of student program would align with what we hypothesised as different kinds of thinking processes that the students go through when programming.',
                    'Having worked with a diverse range of ML and AI techniques such as regression models, tree-based models and SVMs, deep learning for computer vision (CV) and natural language processing (NLP), reinforcement learning (RL), self-supervised learning (SSL), as well as encoders and transformer architectures (and of course Large Language Models (LLMs)), I now have a better intuition for selecting and constructing the appropriate model architectures for given problems. What I would like to do is to apply this intuition towards building <strong>context-aware multimodal AI</strong> pipelines that can be incorporated into cognitive augmentation systems.',
                ],
            },
            {
                title: 'Cognitive Sciences, Psychology, and Education',
                text: [
                    'When I first entered university, my early career aspirations were actually in education and teaching - and I got into research after finding out that you\'d likely need a Ph.D. to become a lecturer. What I didn\'t know was that I would end up enjoying research and completely shift my career directions! I still enjoy teaching quite a bit, and I have served as an undergraduate tutor since my 2nd year in NUS, until graduation. CS1101S in particular was a large part of that enjoyment, having taught it in 4 separate semesters as an avenger (our codename for undergraduate tutor) and later a reflection tutor, a position usually reserved for graduate students.',
                    'In my 2nd year, I converted my psychology minor (which was initially taken out of pure interest) into a double major, and started looking into clinical psychology specifically. However, after working with Prof. Kean Hsu in his CTS lab, which focused heavily on the impact of cognitive processes and biases on mental health, I realized that what really interested me was that cognitive aspect of psychology. When Prof. Suranga Nanayakkara formed his <a href="https://chill.nus.edu.sg/" target="_blank" rel="noopener">Centre for Holistic Inquiry into Lifelong Learning (CHILL)</a>, I started working with the centre on learning-related projects such as <a href="projects/project.html?id=ilems">iLEMS</a> and my <a href="projects/project.html?id=stress-detection">final year project on acute cognitive stress detection</a>. Over time, I have concretized my interest in <strong>cognitive sciences and psychology</strong>, with an emphasis towards <strong>learning, teaching, critical thinking, and mental models</strong> - and incorporating this knowledge into building impactful systems that align with the theory.',
                ],
            },
            {
                title: 'Biosensing and Signal Processing',
                text: [
                    'Signal processing was not my initial focus, but it was always something close to heart by way of music. I had dabbled in digital compositions since secondary school - and I only started looking into it as part of my research interests when I had to work with human biosignal data. Some of my early projects in the AH Lab were on voice acoustics, which introduced me to signal processing as a discipline. However, I credit CS4347: Sound and Music Computing course taught by Prof. <a href="https://www.comp.nus.edu.sg/cs/people/wangye/" target="_blank" rel="noopener">Wang Ye</a> as the catalyst that really got me into signal processing, with his intuitive explanations on concepts such as signal decomposition or chord recognition.',
                    'Many of my projects have involved signal processing on sensor data; I have worked with sensors such as electroencephalography (EEG) for brain waves, photoplethysmogram (PPG) for blood volume pulse (BVP) which can infer heart rate variability (HRV) and blood oxygen saturation (SpO2), electrodermal activity (EDA) sensors for skin conductance, temperature sensors, and eye trackers. I have also worked with voice acoustics, respiratory rate, facial expressions &amp; gestures, and other behavioral data (e.g. keyboard and mouse use). With (varying degrees of) experience in these signals and sensors, I would really like to make use of this knowledge in building the sensing and biofeedback mechanisms for cognitive augmentation systems.',
                ],
            },
        ],
    },

    // ── Projects ──────────────────────────────────────────────────────────────
    // To add a project: append a new object here. No other files needed.
    // Detail page URL will be: projects/project.html?id=<slug>

    projects: [
        {
            slug: 'affect-recognition',
            name: 'EmoDrink',
            tags: ['Affective Computing', 'Wearables', 'Deep Learning', 'Signal Processing', 'HCI'],
            meta: 'Research Engineer (Data Analysis &amp; Modeling) &middot; Augmented Human Lab @ NUS &middot; Nov 2024 &ndash; Ongoing',
            desc: 'Project in collaboration with Asahi Quality & Innovations, Ltd. This project aims to build an affect recognition pipeline with state-of-the-art model architectures, with the aim of integrating the model into wrist-worn and HMD wearable devices for affect-aware recommendation systems. (We have a <a href="#publications">workshop paper at NeurIPS TS4H 2025</a>, and a full paper at <a href="#publications">Augmented Humans 2026</a>.)',
            image: { src: '../assets/project-1.png', alt: 'EmoDrink' },
            overview: `
<p>EmoDrink is a project in collaboration with an industry partner. The goal is to build an affect recognition model using state-of-the-art AI architectures, for integration into wrist-worn and head-mounted wearable devices as part of an affect-aware recommendation system.</p>
<p>As an intermediate output, we published results on the role of sleep physiology in next-day stress prediction as a <a href="https://openreview.net/forum?id=7sNM3ANITc" target="_blank" rel="noopener">workshop paper at NeurIPS TS4H 2025</a>. In this work, we collected physiological and activity data from 44 participants over 28 days using Garmin Venu 3S smartwatches. Features were extracted from HRV, respiration rate, heart rate, SpO2, beat-to-beat intervals (BBI), skin temperature, and step count. We trained an XGBoost model and a custom multimodal encoder network based on a CNN architecture, achieving a mean AUROC of over 67%. The combination of fine-grained sleep data with current physiological data consistently outperformed current-physiology-only baselines.</p>
<p>This work also led to a full paper, <a href="https://dl.acm.org/doi/full/10.1145/3795011.3797399" target="_blank" rel="noopener">EmoDrink: Embodied MR for Physiology-Informed Beverage Recommendation</a>, accepted at the Augmented Humans International Conference 2026. This follow-up work presents a Mixed Reality framework for communicating physiology-informed wellbeing recommendations through embodied representations, integrating smartwatch-derived signals with brief self-reports and contextual cues to generate beverage recommendations.</p>
<p>My contributions to the intermediary work included:</p>
<ul>
    <li><strong>Data analysis and modeling.</strong> Designed, implemented, trained, and evaluated the custom multimodal encoder network. Currently investigating personalization, domain generalization, contrastive learning, and self-supervised learning approaches.</li>
    <li>Signal processing and feature extraction from the collected wearable data.</li>
    <li>Preliminary preparation work for data collection, including IRB ethics applications, questionnaire design, and research protocol development.</li>
</ul>`,
            timeline: [
                { date: 'Nov 2024', text: 'Project start.' },
                { date: 'Dec 2025', text: 'Published initial results at the NeurIPS TS4H Workshop 2025.' },
                { date: '2026',     text: 'Full paper, EmoDrink, accepted at Augmented Humans 2026.' },
                { date: 'Ongoing',  text: 'Continued model development and data collection.' },
            ],
            gallery: null,
            links: [
                { text: 'Workshop Paper (NeurIPS TS4H 2025)', url: 'https://openreview.net/forum?id=7sNM3ANITc' },
                { text: 'Full Paper (Augmented Humans 2026)', url: 'https://dl.acm.org/doi/full/10.1145/3795011.3797399' },
            ],
        },

        {
            slug: 'proctorx',
            name: 'ProctorX',
            tags: ['Computer Vision', 'LLMs', 'Education Technology', 'Software Engineering'],
            meta: 'Lead Developer &middot; CHILL @ NUS &middot; Sep 2024 &ndash; Jul 2025',
            desc: 'Project in collaboration with NUS Centre for Teaching, Learning and Technology (CTLT). We built an AI-driven platform that can detect and flag the use of prohibited applications during open internet examinations. Video recordings and keyboard/mouse data are processed through fine-tuned multimodal LLM pipelines to estimate the likelihood of prohibited applications being used &mdash; a surprisingly non-trivial task.',
            image: { src: '../assets/project-2.png', alt: 'ProctorX' },
            overview: `
<p>This project was developed in collaboration with the <a href="https://ctlt.nus.edu.sg/" target="_blank" rel="noopener">Centre for Teaching, Learning and Technology (CTLT) @ NUS</a>. The goal was to build an AI-driven platform for detecting and flagging the use of prohibited applications during open-internet examinations.</p>
<p>We built a prototype cross-OS logging application that records screen video and keyboard/mouse input. Using this as a basis, we developed a web platform where uploaded recordings are analysed to estimate the likelihood of prohibited application use &mdash; a surprisingly non-trivial detection problem. There is little prior work on computer vision algorithms for <strong>computer screen content</strong>, as opposed to natural images; by using fine-tuned multimodal LLMs, we were able to extract structured information from screen recordings including browser activity, visible text, and application state.</p>
<p>As development lead, I was responsible for the full-stack build of the web platform. The backend was powered by two LLM pipelines:</p>
<ul>
    <li><strong>Text-based analysis:</strong> processes keystroke data to extract typed text, then runs it through a fine-tuned LLM pipeline to assess the likelihood of communication with external parties.</li>
    <li><strong>Video-based analysis:</strong> processes screen recordings alongside keyboard/mouse data through a fine-tuned multimodal LLM pipeline to detect prohibited application use on screen.</li>
</ul>
<p>The project operated under significant practical constraints. The logging software needed to run on all student devices without compromising privacy or security. OS-level features such as browser activity logging were unavailable for this reason. Analysis was restricted to locally-run LLMs due to data privacy requirements, and secure data upload pipelines had to be designed from scratch. Our team addressed each of these constraints and delivered the system prototype within the project timeline.</p>`,
            timeline: [
                { date: 'Sep 2024', text: 'Project start. Research on available tools, models, and prior art.' },
                { date: 'Feb 2025', text: 'Prototype discussions and initial system design reviews.' },
                { date: 'Apr 2025', text: 'CTLT Hackathon for penetration testing of the ProctorX logging system.' },
                { date: 'Jul 2025', text: 'Review and delivery of ProctorX system prototypes.' },
            ],
            gallery: null,
            links:   null,
        },

        {
            slug: 'stress-detection',
            name: 'Acute Cognitive Stress Detection',
            tags: ['Biosensing', 'Multimodal ML', 'Signal Processing', 'Cognitive Science', 'Affective Computing'],
            meta: 'BComp Dissertation &middot; NUS School of Computing &middot; Aug 2024 &ndash; Apr 2025',
            desc: 'This project focused on detection of acute cognitive stress that arises when students are working on mentally demanding tasks, particularly when recalling information under pressure. Multimodal machine learning techniques were used alongside biosignal data (PPG/HRV, EDA, temperature) collected with wearable devices during real examinations. Achieved 80.3% classification accuracy. Awarded the <strong>Outstanding Undergraduate Research Prize (OURP) 2024/25</strong>. [Report available upon request]',
            image: { src: '../assets/project-3.jpg', alt: 'Acute Cognitive Stress Detection' },
            overview: `
<p>This was my final year project for <strong>CP4101: BComp Dissertation</strong> at NUS, a self-proposed cross-department project between the Department of Computer Science and the Department of Information Systems. I was supervised by Prof. <a href="https://www.comp.nus.edu.sg/cs/people/suranga/" target="_blank" rel="noopener">Suranga Nanayakkara</a>, and also worked with Profs. <a href="https://fass.nus.edu.sg/psy/people/steven-pan/" target="_blank" rel="noopener">Steven Pan</a> and <a href="https://fass.nus.edu.sg/psy/people/qin-lili/" target="_blank" rel="noopener">Qin Lili</a> from the NUS Department of Psychology.</p>
<p>The project focused on detecting acute cognitive stress that arises when students are working on mentally demanding tasks, particularly during memory recall under exam conditions. Following a literature review on stress detection and multimodal machine learning, I recruited NUS undergraduate student participants for a within-subjects study. The first session took place a week before their examinations, where participants performed cognitively non-demanding tasks; the second session was conducted during their actual course examination. Garmin Venu 3S smartwatches (equipped with PPG and temperature sensors) were used to collect biosignal data throughout both sessions.</p>
<p>After signal filtering and lower-level feature extraction (HRV and temperature features), the custom dataset was combined with public datasets (WESAD, CLAS) to train and evaluate a <strong>multimodal binary classification model</strong>. Multiple model architectures and multimodal fusion methods were compared. The final model achieved <strong>80.3% accuracy</strong> for in-situ stress detection.</p>
<p>This project was the foundation for the broader <a href="./project.html?id=ilems">iLEMS</a> initiative under CHILL @ NUS. The model and dataset have since been handed over to CHILL for integration into a proactive nudging system for students. The report is available upon request.</p>`,
            timeline: [
                { date: 'May 2024', text: 'Project ideation and proposal.' },
                { date: 'Aug 2024', text: 'Project start. Commenced literature review and preliminary investigations.' },
                { date: 'Nov 2024', text: 'Mid-project report submission and presentation.' },
                { date: 'Jan 2025', text: 'Start of data collection and analysis.' },
                { date: 'Apr 2025', text: 'Final report submission and oral presentation.' },
                { date: 'Apr 2025', text: '<strong>Awarded the Outstanding Undergraduate Research Prize (OURP) 2024/25</strong>, Individual Category.' },
            ],
            gallery: [
                { src: '../assets/project-3/signals.png', alt: 'Biosignal data overview' },
                { src: '../assets/project-3/neuro.png',   alt: 'Neurological signal analysis' },
                { src: '../assets/project-3/table.png',   alt: 'Model results table' },
            ],
            links: null,
        },

        {
            slug: 'ilems',
            name: 'Integrated Learning and Management System (iLEMS)',
            tags: ['Learning Analytics', 'HCI', 'Affective Computing', 'Web Platform'],
            meta: 'Research Engineer &middot; CHILL @ NUS &middot; Jul 2024 &ndash; Jun 2025',
            desc: 'Initiated under <a href="https://chill.nus.edu.sg/about/" target="_blank" rel="noopener">CHILL @ NUS</a>. The iLEMS system is a web-based platform that integrates course metadata with student behavioural and cognitive state data collected during course time, to give instructors a more holistic view of classroom engagement over time. The platform is still a work in progress under CHILL.',
            image: { src: '../assets/project-4.jpg', alt: 'iLEMS' },
            overview: `
<p>This project was initiated under <a href="https://chill.nus.edu.sg/" target="_blank" rel="noopener">CHILL @ NUS</a> (Centre for Holistic Inquiry into Lifelong Learning). The iLEMS system is envisioned as a web-based platform that integrates course metadata with student behavioural and cognitive state data collected during class time, allowing instructors to track and understand learning engagement at a more holistic level over time.</p>
<p>My <a href="./project.html?id=stress-detection">final year project on acute cognitive stress detection</a> was conducted as a sub-project under iLEMS. My role in the broader iLEMS project was primarily in ideation, and reviewing existing methods for measuring student cognitive and behavioural engagement. The data, model, and literature review from my FYP were handed over to CHILL at the end of my undergraduate candidature for continued integration into the platform.</p>
<p>The platform is still under active development at CHILL.</p>`,
            timeline: [
                { date: 'Jul 2024', text: 'Project start. Initial ideation and scope definition.' },
                { date: 'Feb 2025', text: 'Discussions on iLEMS development roadmap with CTLT.' },
                { date: 'Jun 2025', text: 'Review, data, and model handed over to CHILL for continued development.' },
            ],
            gallery: null,
            links:   null,
        },

        {
            slug: 'emplity',
            name: 'Emplity',
            tags: ['AI', 'Mental Health', 'Startup', 'LLMs', 'Education Technology'],
            meta: 'Co-founder &amp; Chief Research Officer &middot; Nov 2023 &ndash; Ongoing',
            desc: 'Emplity is my startup; we build AI-driven applications for mental health professionals in-training, including AI roleplay for CBT practice and automated case study review. Awarded multiple grants totalling over SGD $120,000. Currently piloting with universities and institutes of higher learning. If this sounds interesting to you as a potential collaborator or client, feel free to reach out.',
            image: { src: '../assets/project-5.png', alt: 'Emplity' },
            overview: `
<p>Emplity is my third startup venture &mdash; and the first one to gain meaningful traction. We build <strong>AI-driven training applications for mental health professionals in-training</strong>, born out of direct experience as a clinical psychology student. Our flagship product includes AI roleplay for practising Cognitive-Behavioural Therapy (CBT) formulation through audio/video conversations, and AI-assisted review of case studies and session transcripts.</p>
<p>I co-founded the company with a fellow co-founder, and developed the initial prototypes. I subsequently served as Chief Technology Officer (CTO), taking responsibility for product management and the initial AI pipeline for avatar simulation and conversation evaluation, calibrated against university clinical psychology training rubrics. I have since transitioned to Chief Research Officer (CRO), leading AI pipeline improvements and shaping business strategy and product design in line with what mental health educators and trainees actually need.</p>
<p>We are currently piloting with faculty members from NUS's Department of Psychology and other institutes of higher learning. If you are interested in collaborating or learning more, feel free to get in touch.</p>`,
            timeline: [
                { date: 'Nov 2023', text: 'Co-founders agree to start the company.' },
                { date: 'Dec 2023', text: 'Product development begins; grant applications submitted.' },
                { date: 'Jan 2024', text: 'Awarded the <strong>NUS GAP50 Grant</strong> (up to SGD $50,000).' },
                { date: 'Feb 2024', text: 'Awarded the <strong>Youth Action Challenge (YAC) Grant</strong> (up to SGD $10,000).' },
                { date: 'Jul 2024', text: 'Awarded the <strong>IMDA Digital for Life (DfL) Fund</strong> (up to SGD $20,000).' },
                { date: 'Sep 2024', text: 'Entered the NUS School of Computing Furnace Startup Ecosystem.' },
                { date: 'Jul 2025', text: "Entered Singapore's BLOCK71 Startup Ecosystem." },
                { date: 'Aug 2025', text: 'Commenced collaborations and trials with NUS Department of Psychology.' },
                { date: 'Nov 2025', text: 'Awarded the <strong>Singapore Association for Social Enterprise (raiSE) Grant</strong> (up to SGD $50,000).' },
            ],
            gallery: [
                { src: '../assets/project-5/dashboard.png', alt: 'Emplity dashboard' },
                { src: '../assets/project-5/chat.png',       alt: 'AI roleplay chat interface' },
                { src: '../assets/project-5/categories.png', alt: 'Categories view' },
                { src: '../assets/project-5/pics.png',       alt: 'Team and product photos' },
            ],
            links: null,
        },

        {
            slug: 'program-classification',
            name: 'Student Program Classification',
            tags: ['Machine Learning', 'Program Analysis', 'LLMs', 'Education Technology'],
            meta: 'UROP Student Researcher &middot; NUS School of Computing &middot; Jan 2023 &ndash; Dec 2023',
            desc: 'This project focused on classifying student programs through low-level program traces extracted from abstract syntax trees (ASTs). Both standard machine learning models and LLMs were used to cluster programs based on these traces, identifying distinct patterns that reflect how students conceptually approach programming problems. Validated with teaching assistant surveys. [Report available upon request]',
            image: { src: '../assets/project-6.png', alt: 'Student Program Classification' },
            overview: `
<p>This was my project for <strong>CP3209: Undergraduate Research Opportunities Program (UROP)</strong> at NUS, conducted under the supervision of Prof. <a href="https://www.comp.nus.edu.sg/cs/people/henz/" target="_blank" rel="noopener">Martin Henz</a> and Prof. <a href="https://www.comp.nus.edu.sg/cs/people/boyd/" target="_blank" rel="noopener">Boyd Anderson</a>. The project was related to <a href="./project.html?id=source-academy">Source Academy</a>, the learning platform for CS1101S: Programming Methodology, and was initially intended for improving the Source Academy auto-grader.</p>
<p>The project scope evolved considerably. After reviewing existing program classification approaches &mdash; which were mostly oriented toward software engineering tasks rather than educational contexts &mdash; we developed a different angle. We extracted structural features from the Abstract Syntax Trees (ASTs) of student programs: specific function calls, operations, and data flow characteristics. These low-level features were then used to train <strong>tree-based and LLM-based clustering models</strong>.</p>
<p>By comparing patterns between the two clustering approaches, we identified what we termed <strong>&ldquo;algorithmic processes&rdquo;</strong> &mdash; distinct implementations of the same algorithm that reflect different conceptual understandings. A canonical example is the difference between iterative and recursive implementations of the same recursive function (see <a href="https://sourceacademy.org/sicpjs/1.2.1" target="_blank" rel="noopener"><em>SICP Chapter 1.2.1</em></a> for background).</p>
<p>To validate the findings, we ran a survey with CS1101S teaching assistants. TAs consistently made the same program classifications as the models, even for patterns that did not map cleanly onto known algorithmic paradigms. This suggested that the clusters reflected meaningful differences in how students conceptually understood the course material &mdash; and that our models were capturing something real about student cognition, not just surface-level code structure.</p>
<p>This project was a formative one for me: it catalysed my interest in cognitive aspects of student understanding, and directly motivated my decision to pursue a double major in Psychology. The report is available upon request.</p>`,
            timeline: [
                { date: 'Jan 2023', text: 'Project start. Literature review and initial modeling work.' },
                { date: 'Apr 2023', text: 'Mid-project report submission and presentation.' },
                { date: 'Aug 2023', text: 'Teaching assistant survey data collection and analysis.' },
                { date: 'Dec 2023', text: 'Final report submission and presentation.' },
            ],
            gallery: [
                { src: '../assets/project-6/methods.png', alt: 'Classification methods overview' },
                { src: '../assets/project-6/algoapp.png', alt: 'Algorithmic process examples' },
            ],
            links: null,
        },

        {
            slug: 'markbind',
            name: 'MarkBind',
            tags: ['Open Source', 'Developer Tools', 'Software Engineering'],
            meta: 'Senior Developer &amp; Project Manager &middot; NUS Open Source Software (NUS-OSS) &middot; Jul 2022 &ndash; Jun 2025',
            desc: '<a href="https://markbind.org/" target="_blank" rel="noopener">MarkBind</a> is an open-source CLI tool for generating dynamic websites from Markdown, built and maintained by NUS students. I began as a junior developer in my 3rd year and continued as a senior developer and project manager until graduation.',
            image: { src: '../assets/project-7.png', alt: 'MarkBind' },
            overview: `
<p><a href="https://markbind.org/" target="_blank" rel="noopener">MarkBind</a> is an open-source command-line tool for generating dynamic, content-rich websites from Markdown. It is built and maintained by students of the National University of Singapore, and is used by several NUS courses for their course websites and documentation.</p>
<p>I joined MarkBind as a junior developer in my third year, contributing to component development and tooling. I later transitioned to a senior developer role, taking on more complex feature work and mentoring incoming contributors. In my final semester, I additionally took on project management responsibilities, helping guide the direction of development and onboarding new junior developers joining the project.</p>`,
            timeline: [
                { date: 'Jul 2022', text: 'Preliminary contributions as a junior developer.' },
                { date: 'Jan 2023', text: 'Formal development as a junior developer (CS3281: Thematic Systems Project I).' },
                { date: 'Jul 2023', text: 'Continued as an open-source contributor and senior developer.' },
                { date: 'Jan 2025', text: 'Development as senior developer and project manager (CS3282: Thematic Systems Project II).' },
            ],
            gallery: null,
            links: [
                { text: 'User Guide',         url: 'https://markbind.org/userGuide/' },
                { text: 'GitHub Repository',  url: 'https://github.com/markbind/markbind' },
            ],
        },

        {
            slug: 'robot-guide-dog',
            name: 'Robot Guide Dog',
            tags: ['Robotics', 'Computer Vision', 'Navigation', 'Machine Learning'],
            meta: 'Research Engineer Intern &middot; Centre for Computing for Social Good &amp; Philanthropy (CCSGP) @ NUS &middot; May 2022 &ndash; Jul 2023',
            desc: 'Part of an ongoing <a href="https://www.ccsgp.comp.nus.edu.sg/robotic-dog-intern" target="_blank" rel="noopener">research project</a> to build a navigation system for a robotic guide dog (Boston Dynamics Spot, Unitree Go1) for visually impaired users. This work specifically focused on unseen environment navigation and stair climbing, using SLAM alongside a neural network pipeline integrating Mask2Former and SAM.',
            image: { src: '../assets/project-8.jpg', alt: 'Robot Guide Dog' },
            overview: `
<p>This project was part of the NUS Centre for Computing for Social Good &amp; Philanthropy (CCSGP) initiative to develop a robotic guide dog for visually impaired users. I contributed across two separate stints.</p>
<p>In my first attachment (May 2022, summer), I conducted a preliminary review of visual Simultaneous Localisation and Mapping (SLAM) algorithms and designed a possible navigation system architecture for <strong>Boston Dynamics Spot</strong> in unseen environments, using open-source SLAM algorithms and neural network models.</p>
<p>Returning as a research engineer intern (May 2023), I continued and extended this work on a cost-effective navigation system for both <strong>Boston Dynamics Spot</strong> and <strong>Unitree Go1</strong> robot dogs. The focus was on robust navigation in previously unseen environments and staircase climbing. I implemented SLAM algorithms and developed a neural network pipeline integrating <strong>Mask2Former</strong> and <strong>Segment Anything (SAM)</strong> for collision avoidance using limited visual information.</p>`,
            timeline: [
                { date: 'May 2022', text: 'Summer research attachment. SLAM review and initial navigation system design for Boston Dynamics Spot.' },
                { date: 'May 2023', text: 'Research engineer internship. Extended navigation system and developed Mask2Former + SAM pipeline for collision avoidance.' },
            ],
            gallery: [
                { src: '../assets/project-8/boston.jpg',  alt: 'Boston Dynamics Spot robot' },
                { src: '../assets/project-8/unitree.jpg', alt: 'Unitree Go1 robot' },
            ],
            links: [
                { text: 'Project Article &amp; Video', url: 'https://www.ccsgp.comp.nus.edu.sg/robotic-dog-intern' },
            ],
        },

        {
            slug: 'source-academy',
            name: 'Source Academy',
            tags: ['Education Technology', 'Open Source', 'Software Engineering'],
            meta: 'Senior Developer &middot; NUS School of Computing &middot; Jul 2021 &ndash; Jun 2025',
            desc: '<a href="https://sourceacademy.nus.edu.sg/" target="_blank" rel="noopener">Source Academy</a> is a web-based interactive learning platform built around the Structure and Interpretation of Computer Programs (SICP) textbook, used for CS1101S: Programming Methodology I at NUS. I began as a junior developer in my 2nd year, and continued as a senior developer until graduation; I also served as an undergraduate tutor for the course across four semesters.',
            image: { src: '../assets/project-9.jpg', alt: 'Source Academy' },
            overview: `
<p><a href="https://sourceacademy.org/" target="_blank" rel="noopener">Source Academy</a> is a web-based interactive learning platform for CS1101S: Programming Methodology at NUS, designed around the Structure and Interpretation of Computer Programs (SICP) textbook. It is built and maintained by NUS students as part of the <a href="https://sourceacademy.nus.edu.sg/contributors" target="_blank" rel="noopener">Source Academy leadership team</a>.</p>
<p>I joined as a junior developer in my second year and remained involved as a senior developer until graduation, contributing across four consecutive leadership cohorts. My technical work spanned feature development, codebase maintenance, and tooling. In parallel, I also served as an undergraduate teaching assistant for CS1101S (known as an &ldquo;avenger&rdquo;), eventually becoming a reflection tutor &mdash; a role typically reserved for graduate students &mdash; responsible for supporting students' meta-cognitive reflection on their learning.</p>
<p>A related research project on <a href="./project.html?id=program-classification">student program classification</a> grew directly out of my experience with Source Academy and CS1101S.</p>`,
            timeline: [
                { date: 'Jul 2021', text: 'Joined as a junior developer.' },
                { date: 'Aug 2022', text: 'Became senior developer and joined the 2022 Leadership Team (Rook).' },
                { date: 'Jan 2023', text: 'Started UROP research project on student program classification, under Source Academy.' },
                { date: 'Aug 2023', text: 'Continued as senior developer on the 2023 Leadership Team (Merlin).' },
                { date: 'Aug 2024', text: 'Continued as senior developer on the 2024 Leadership Team (Strange).' },
            ],
            gallery: [
                { src: '../assets/project-9/hall.png',   alt: 'Source Academy interface' },
                { src: '../assets/project-9/ship.png',   alt: 'Source Academy game level' },
                { src: '../assets/project-9/forest.png', alt: 'Source Academy game level' },
            ],
            links: [
                { text: 'Source Academy',      url: 'https://sourceacademy.org/' },
                { text: 'GitHub Organisation', url: 'https://github.com/source-academy' },
            ],
        },
    ],

    // ── Publications ──────────────────────────────────────────────────────────
    // links: array of { text, url } — rendered as [Text] after the venue line.
    // abstract: string or null (omit the key or set to null to hide the toggle).

    publications: [
        {
            title:    "Don't Sleep on Sleep Data: Influence of Sleep Physiological Signals on Stress Detection.",
            authors:  'Soundarya Ramesh, Takahiro Masuda, <strong>Hyung Woon Lee</strong>, Yongquan Hu, Suranga Chandima Nanayakkara.',
            venue:    '<em>NeurIPS Time Series for Health (TS4H) Workshop</em>, 2025.',
            links:    [{ text: 'OpenReview', url: 'https://openreview.net/forum?id=7sNM3ANITc' }],
            abstract: "Stress is a critical determinant of both short-term well-being and long-term health. While wearable sensors have enabled continuous monitoring of stress through physiological signals, existing approaches that rely only on <em>current physiology</em> have shown limited success. Prior work suggests that the <em>previous night's sleep</em> is predictive of stress, yet current methods typically use only <em>coarse sleep summaries</em> (e.g., duration, resting heart rate). In this paper, we argue that <em>fine-grained sleep physiological data</em> can provide richer insights for stress detection. We collect a month-long smartwatch dataset comprising both day-time and night-time physiological signals, including detailed sleep-derived features, and train two models &mdash; XGBoost and a custom multi-modal neural network. Our results provide initial evidence that incorporating fine-grained sleep features significantly improves stress detection, opening up several promising directions for future research.",
        },
                {
            title:    "EmoDrink: Embodied MR for Physiology-Informed Beverage Recommendation.",
            authors:  'Prasanth Sasikumar, Takahiro Masuda, Soundarya Ramesh, <strong>Hyung Woon Lee</strong>, Sankha Cooray, Yongquan Hu, Suranga Nanayakkara.',
            venue:    '<em>Proceedings of the Augmented Humans International Conference</em>, 2026.',
            links:    [{ text: 'ACM', url: 'https://dl.acm.org/doi/full/10.1145/3795011.3797399' }],
            abstract: "Wearable devices increasingly capture physiological signals related to users’ affective and cognitive states, yet these signals are commonly presented through numerical dashboards that are difficult to interpret and act upon in everyday contexts. We present EmoDrink, a Mixed Reality (MR) research framework for communicating physiology-informed wellbeing recommendations through embodied representations. EmoDrink integrates smartwatch-derived signals with brief self-reports and contextual cues to generate a single beverage recommendation, then holds this recommendation constant while varying how it is presented: an abstract visualization, a generic embodied agent, and a personalized “future self” avatar. Through a walk-up-and-use MR experience, attendees can directly compare how embodiment shapes trust, comfort, and interpretability when engaging with identical wellbeing guidance.",
        },
    ],

    // ── Footer ────────────────────────────────────────────────────────────────

    footer: {
        email:       'hyung98 [at] media [dot] mit [dot] edu',
        lastUpdated: 'September 2026',
    },
};
