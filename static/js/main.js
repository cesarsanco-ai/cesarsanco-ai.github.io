'use strict';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    initStackTrackDom();
    initStackShowcase();
    initIndustryShowcase();
    initSelectedWorkCarousel();
    initHeroTypewriter();
    initWorkBranchDialogs();
    initTeachingPreviewDialogs();
    initSiteNav();
});

/**
 * Slow horizontal drift + lateral arrows. Track should duplicate its items for seamless wrap.
 */
function initDriftingStrip(scrollId, trackId, rootSelector) {
    var scrollEl = document.getElementById(scrollId);
    var track = document.getElementById(trackId);
    if (!scrollEl || !track) return;

    var root = rootSelector ? document.querySelector(rootSelector) : null;
    var half = 0;
    var pos = 0;
    var speed = 0.11;
    var manualUntil = 0;
    var step = 120;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function measure() {
        half = track.scrollWidth / 2;
        if (half > 0 && pos >= half) pos = pos % half;
    }

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    track.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('load', measure);
    });

    if (typeof MutationObserver !== 'undefined') {
        var mo = new MutationObserver(measure);
        mo.observe(track, { childList: true, subtree: true });
    }

    function tick() {
        var now = Date.now();
        if (!reduceMotion && now > manualUntil && half > 0) {
            pos += speed;
            if (pos >= half) pos -= half;
            scrollEl.scrollLeft = pos;
        }
        window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);

    function nudge(delta) {
        manualUntil = Date.now() + 2800;
        measure();
        if (half <= 0) return;
        pos = ((pos + delta) % half) + half;
        pos = pos % half;
        scrollEl.scrollLeft = pos;
    }

    var leftBtn = root ? root.querySelector('.stack-arrow-left') : null;
    var rightBtn = root ? root.querySelector('.stack-arrow-right') : null;
    if (leftBtn) leftBtn.addEventListener('click', function () { nudge(-step); });
    if (rightBtn) rightBtn.addEventListener('click', function () { nudge(step); });

    scrollEl.addEventListener(
        'wheel',
        function () {
            manualUntil = Date.now() + 3200;
        },
        { passive: true }
    );
}

function initStackShowcase() {
    initDriftingStrip('stack-scroll', 'stack-track', '#stack-showcase-main');
}

function initIndustryShowcase() {
    initDriftingStrip('industry-scroll', 'industry-track', '#industry-showcase-main');
}

function initSelectedWorkCarousel() {
    var scrollEl = document.getElementById('selected-work-scroll');
    var root = document.getElementById('selected-work-showcase');
    if (!scrollEl || !root) return;

    var cards = scrollEl.querySelectorAll('.selected-work-card');

    function scrollByCard(direction) {
        if (!cards.length) return;
        var track = scrollEl.querySelector('.selected-work-track');
        var gap = track ? parseFloat(window.getComputedStyle(track).gap) || 24 : 24;
        var step = cards[0].offsetWidth + gap;
        scrollEl.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    var leftBtn = root.querySelector('.stack-arrow-left');
    var rightBtn = root.querySelector('.stack-arrow-right');
    if (leftBtn) leftBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (rightBtn) rightBtn.addEventListener('click', function () { scrollByCard(1); });
}

var DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

/**
 * Simple Icons via jsDelivr (reliable). cdn.simpleicons.org often 404s in practice;
 * failed images fall back to the same FA icon, which looked like duplicated logos.
 * Some slugs moved between package majors — pin per slug when needed.
 */
function si(slug, color) {
    var ver = '13';
    if (slug === 'powerbi' || slug === 'microsoft') ver = '11';
    return 'https://cdn.jsdelivr.net/npm/simple-icons@' + ver + '/icons/' + slug + '.svg';
}

/** Stack strip: logos + Font Awesome fallbacks; duplicated for seamless drift. */
var STACK_ITEMS = [
    { title: 'Python', href: 'https://www.python.org/', img: DEVICON + 'python/python-original.svg' },
    { title: 'PyTorch', href: 'https://pytorch.org/', img: DEVICON + 'pytorch/pytorch-original.svg' },
    { title: 'TensorFlow', href: 'https://www.tensorflow.org/', img: DEVICON + 'tensorflow/tensorflow-original.svg' },
    { title: 'C++', href: 'https://isocpp.org/', img: DEVICON + 'cplusplus/cplusplus-original.svg' },
    { title: 'SQL Server', href: 'https://www.microsoft.com/sql-server', img: DEVICON + 'microsoftsqlserver/microsoftsqlserver-plain.svg' },
    { title: 'PostgreSQL', href: 'https://www.postgresql.org/', img: DEVICON + 'postgresql/postgresql-original.svg' },
    { title: 'n8n', href: 'https://n8n.io/', img: si('n8n', 'EA4B71') },
    { title: 'Linux', href: 'https://www.linux.org/', img: DEVICON + 'linux/linux-original.svg' },
    { title: 'LangGraph', href: 'https://langchain-ai.github.io/langgraph/', fa: 'fas fa-project-diagram' },
    { title: 'GitHub Actions', href: 'https://github.com/features/actions', fa: 'fab fa-github' },
    { title: 'AWS', href: 'https://aws.amazon.com/', fa: 'fab fa-aws' },
    { title: 'Databricks', href: 'https://www.databricks.com/', img: si('databricks', 'FF3621') },
    { title: 'Hugging Face', href: 'https://huggingface.co/', img: si('huggingface', 'FFD21E') },
    { title: 'Apache Airflow', href: 'https://airflow.apache.org/', img: DEVICON + 'apacheairflow/apacheairflow-original.svg' },
    { title: 'Apache Kafka', href: 'https://kafka.apache.org/', img: DEVICON + 'apachekafka/apachekafka-original.svg' },
    { title: 'PySpark', href: 'https://spark.apache.org/', img: DEVICON + 'apachespark/apachespark-original.svg' },
    { title: 'Power BI', href: 'https://powerbi.microsoft.com/', img: si('powerbi', 'F2C811') },
    { title: 'Microsoft Fabric', href: 'https://www.microsoft.com/microsoft-fabric', img: si('microsoft', '6264A7') },
    { title: 'Docker', href: 'https://www.docker.com/', img: DEVICON + 'docker/docker-original.svg' },
    { title: 'NVIDIA', href: 'https://www.nvidia.com/', img: si('nvidia', '76B900') },
    { title: 'Kubernetes', href: 'https://kubernetes.io/', img: DEVICON + 'kubernetes/kubernetes-plain.svg' },
    { title: 'Delta Lake', href: 'https://delta.io/', fa: 'fas fa-database' },
    { title: 'Terraform', href: 'https://www.terraform.io/', img: DEVICON + 'terraform/terraform-original.svg' },
    { title: 'MLflow', href: 'https://mlflow.org/', img: si('mlflow', '0194C4') },
    { title: 'Grafana', href: 'https://grafana.com/', img: si('grafana', 'F46800') },
    { title: 'FastAPI', href: 'https://fastapi.tiangolo.com/', img: DEVICON + 'fastapi/fastapi-original.svg' },
    { title: 'Node-RED', href: 'https://nodered.org/', img: si('nodered', '8F0000') },
    { title: 'Power Automate', href: 'https://www.microsoft.com/power-platform/products/power-automate', fa: 'fab fa-microsoft' }
];

function buildStackLogoEl(item, duplicate) {
    var a = document.createElement('a');
    a.className = item.fa ? 'stack-logo stack-logo--fa' : 'stack-logo';
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = item.title;
    if (duplicate) {
        a.setAttribute('aria-hidden', 'true');
        a.setAttribute('tabindex', '-1');
    }
    if (item.img) {
        var img = document.createElement('img');
        img.src = item.img;
        img.width = 36;
        img.height = 36;
        img.alt = duplicate ? '' : item.title + ' logo';
        if (duplicate) img.setAttribute('aria-hidden', 'true');
        img.addEventListener('error', function () {
            img.remove();
            var fallback = document.createElement('i');
            fallback.className = 'fas fa-cube';
            fallback.setAttribute('aria-hidden', 'true');
            a.classList.add('stack-logo--fa');
            a.appendChild(fallback);
        });
        a.appendChild(img);
    } else if (item.fa) {
        var icon = document.createElement('i');
        icon.className = item.fa;
        icon.setAttribute('aria-hidden', 'true');
        a.appendChild(icon);
    }
    return a;
}

function initStackTrackDom() {
    var track = document.getElementById('stack-track');
    if (!track) return;
    track.textContent = '';
    STACK_ITEMS.forEach(function (item) {
        track.appendChild(buildStackLogoEl(item, false));
    });
    STACK_ITEMS.forEach(function (item) {
        track.appendChild(buildStackLogoEl(item, true));
    });
}

function initHeroTypewriter() {
    var stage = document.getElementById('hero-typewriter-stage');
    var indicator = document.getElementById('hero-typewriter-indicator');
    if (!stage || !indicator) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        stage.innerHTML =
            '<h1 class="title is-1 publication-title">Cesar Sanchez-Coronel</h1>' +
            '<h2 class="subtitle is-5 publication-awards">AI Engineer · Data Engineer · AI Infrastructure &amp; Operations</h2>' +
            '<div class="is-size-5 publication-authors"><span class="author-block">' +
            '<span class="link-hero-ai">Agentic AI · Data Platforms · Production AI Ops</span></span></div>';
        indicator.style.display = 'none';
        return;
    }

    var charMs = 44;
    var linePauseMs = 320;
    var cyclePauseMs = 2400;
    var caretEl = document.createElement('span');
    caretEl.className = 'hero-tw-caret';
    caretEl.setAttribute('aria-hidden', 'true');
    caretEl.textContent = '▍';

    var linesSpec = [
        { type: 'title', text: 'Cesar Sanchez-Coronel' },
        { type: 'subtitle', text: 'AI Engineer · Data Engineer · AI Infrastructure & Operations' },
        { type: 'tagline', text: 'Agentic AI · Data Platforms · Production AI Ops' }
    ];

    var lineIndex = 0;
    var charIndex = 0;
    var textSpan = null;
    var hostEl = null;
    var timer = null;

    function clearStage() {
        stage.textContent = '';
        textSpan = null;
        hostEl = null;
        lineIndex = 0;
        charIndex = 0;
    }

    function mountCaret() {
        if (caretEl.parentNode) caretEl.parentNode.removeChild(caretEl);
        if (hostEl) hostEl.appendChild(caretEl);
    }

    function startLine() {
        var spec = linesSpec[lineIndex];
        var wrap = document.createElement('div');
        wrap.className = 'hero-tw-block';

        if (spec.type === 'title') {
            var h1 = document.createElement('h1');
            h1.className = 'title is-1 publication-title';
            textSpan = document.createElement('span');
            h1.appendChild(textSpan);
            wrap.appendChild(h1);
            hostEl = h1;
        } else if (spec.type === 'subtitle') {
            var h2 = document.createElement('h2');
            h2.className = 'subtitle is-5 publication-awards';
            textSpan = document.createElement('span');
            h2.appendChild(textSpan);
            wrap.appendChild(h2);
            hostEl = h2;
        } else if (spec.type === 'tagline') {
            var row = document.createElement('div');
            row.className = 'is-size-5 publication-authors';
            var ab = document.createElement('span');
            ab.className = 'author-block';
            textSpan = document.createElement('span');
            textSpan.className = 'link-hero-ai';
            ab.appendChild(textSpan);
            row.appendChild(ab);
            wrap.appendChild(row);
            hostEl = ab;
        }

        stage.appendChild(wrap);
        mountCaret();
    }

    function schedule(nextFn, ms) {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(nextFn, ms);
    }

    function tick() {
        var spec = linesSpec[lineIndex];
        if (!textSpan) startLine();

        if (charIndex < spec.text.length) {
            textSpan.textContent = spec.text.slice(0, charIndex + 1);
            charIndex += 1;
            mountCaret();
            indicator.classList.remove('is-idle');
            schedule(tick, charMs + Math.floor(Math.random() * 18));
            return;
        }

        mountCaret();
        if (lineIndex < linesSpec.length - 1) {
            lineIndex += 1;
            charIndex = 0;
            textSpan = null;
            hostEl = null;
            schedule(function () {
                startLine();
                tick();
            }, linePauseMs);
            return;
        }

        indicator.classList.add('is-idle');
        schedule(function () {
            indicator.classList.remove('is-idle');
            clearStage();
            lineIndex = 0;
            charIndex = 0;
            textSpan = null;
            hostEl = null;
            startLine();
            tick();
        }, cyclePauseMs);
    }

    tick();
}

/**
 * Work Experience — three branches: open/close native <dialog> popups.
 */
function initWorkBranchDialogs() {
    document.querySelectorAll('[data-work-branch-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = btn.getAttribute('data-work-branch-open');
            var dlg = id ? document.getElementById(id) : null;
            if (!dlg || typeof dlg.showModal !== 'function') return;
            dlg.showModal();
            var closeBtn = dlg.querySelector('.work-branch-dialog-close');
            if (closeBtn) closeBtn.focus();
        });
    });

    document.querySelectorAll('.work-branch-dialog').forEach(function (dlg) {
        dlg.addEventListener('click', function (e) {
            if (e.target === dlg) dlg.close();
        });
        var closeBtn = dlg.querySelector('.work-branch-dialog-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                dlg.close();
            });
        }
    });
}

function initTeachingPreviewDialogs() {
    document.querySelectorAll('[data-teaching-preview-open]').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            var id = trigger.getAttribute('data-teaching-preview-open');
            var dlg = id ? document.getElementById(id) : null;
            if (!dlg || typeof dlg.showModal !== 'function') return;
            dlg.showModal();
            var closeBtn = dlg.querySelector('.work-branch-dialog-close');
            if (closeBtn) closeBtn.focus();
        });
    });
}

function initSiteNav() {
    var toggle = document.getElementById('siteNavToggle');
    var links = document.getElementById('siteNavLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', function (e) {
        if (e.target.tagName !== 'A') return;
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    });

    var navLinks = links.querySelectorAll('a[href^="#"]');
    var sections = [];

    navLinks.forEach(function (link) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;
        var section = document.querySelector(id);
        if (section) sections.push({ link: link, section: section });
    });

    function setActiveLink(activeLink) {
        navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link === activeLink);
        });
    }

    function updateActiveFromScroll() {
        if (!sections.length) return;

        var offset = (document.querySelector('.site-nav') || {}).offsetHeight || 72;
        var scrollPos = window.scrollY + offset + 24;
        var active = sections[0].link;

        sections.forEach(function (entry) {
            if (entry.section.offsetTop <= scrollPos) {
                active = entry.link;
            }
        });

        setActiveLink(active);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            setActiveLink(link);
        });
    });

    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);
    updateActiveFromScroll();
}
