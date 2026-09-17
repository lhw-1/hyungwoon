// brush-fx.js — a cursor-following ink effect, adapted from the real GPU
// fluid simulation used on domenicobrz.github.io/webgl's "gpu-fluid-sim"
// demo, which itself is built on PavelDoGreat/WebGL-Fluid-Simulation
// (https://github.com/PavelDoGreat/WebGL-Fluid-Simulation, MIT licensed).
// Same technique — a Navier–Stokes solver on the GPU: the cursor injects
// velocity + "dye" into the fluid each frame (a splat), the velocity field
// is advected/curled/vorticity-confined and made divergence-free via a
// pressure (Jacobi) solve, and the dye is advected by that velocity field
// and slowly dissipates — but rendered as a single monochrome ink channel
// instead of Pavel's rainbow palette, styled after traditional East-Asian
// ink brush painting.
//
// This is the default ambient effect on the home page; the heatmap toggle
// switches it out for HeatmapFX (see cursor-toggle.js). Exposes
// BrushFX.start() / BrushFX.stop().

// ── Shaders (adapted from PavelDoGreat/WebGL-Fluid-Simulation, MIT) ───────
// `position` / `uv` are auto-supplied by three.js's ShaderMaterial.

var BRUSH_BASE_VERTEX = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform vec2 texelSize;\n\
void main () {\n\
    vUv = uv;\n\
    vL = vUv - vec2(texelSize.x, 0.0);\n\
    vR = vUv + vec2(texelSize.x, 0.0);\n\
    vT = vUv + vec2(0.0, texelSize.y);\n\
    vB = vUv - vec2(0.0, texelSize.y);\n\
    gl_Position = vec4(position, 1.0);\n\
}\n';

var BRUSH_SPLAT_FRAG = '\n\
varying vec2 vUv;\n\
uniform sampler2D uTarget;\n\
uniform float aspectRatio;\n\
uniform vec3 color;\n\
uniform vec2 point;\n\
uniform float radius;\n\
void main () {\n\
    vec2 p = vUv - point.xy;\n\
    p.x *= aspectRatio;\n\
    vec3 splat = exp(-dot(p, p) / max(radius, 0.0001)) * color;\n\
    vec3 base = texture2D(uTarget, vUv).xyz;\n\
    gl_FragColor = vec4(base + splat, 1.0);\n\
}\n';

var BRUSH_ADVECTION_FRAG = '\n\
varying vec2 vUv;\n\
uniform sampler2D uVelocity;\n\
uniform sampler2D uSource;\n\
uniform vec2 texelSize;\n\
uniform float dt;\n\
uniform float dissipation;\n\
void main () {\n\
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n\
    vec4 result = texture2D(uSource, coord);\n\
    float decay = 1.0 + dissipation * dt;\n\
    gl_FragColor = result / decay;\n\
}\n';

var BRUSH_DIVERGENCE_FRAG = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform sampler2D uVelocity;\n\
void main () {\n\
    float L = texture2D(uVelocity, vL).x;\n\
    float R = texture2D(uVelocity, vR).x;\n\
    float T = texture2D(uVelocity, vT).y;\n\
    float B = texture2D(uVelocity, vB).y;\n\
    vec2 C = texture2D(uVelocity, vUv).xy;\n\
    if (vL.x < 0.0) { L = -C.x; }\n\
    if (vR.x > 1.0) { R = -C.x; }\n\
    if (vT.y > 1.0) { T = -C.y; }\n\
    if (vB.y < 0.0) { B = -C.y; }\n\
    float div = 0.5 * (R - L + T - B);\n\
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n\
}\n';

var BRUSH_CURL_FRAG = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform sampler2D uVelocity;\n\
void main () {\n\
    float L = texture2D(uVelocity, vL).y;\n\
    float R = texture2D(uVelocity, vR).y;\n\
    float T = texture2D(uVelocity, vT).x;\n\
    float B = texture2D(uVelocity, vB).x;\n\
    float vorticity = R - L - T + B;\n\
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n\
}\n';

var BRUSH_VORTICITY_FRAG = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform sampler2D uVelocity;\n\
uniform sampler2D uCurl;\n\
uniform float curlStrength;\n\
uniform float dt;\n\
void main () {\n\
    float L = texture2D(uCurl, vL).x;\n\
    float R = texture2D(uCurl, vR).x;\n\
    float T = texture2D(uCurl, vT).x;\n\
    float B = texture2D(uCurl, vB).x;\n\
    float C = texture2D(uCurl, vUv).x;\n\
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n\
    force /= length(force) + 0.0001;\n\
    force *= curlStrength * C;\n\
    force.y *= -1.0;\n\
    vec2 vel = texture2D(uVelocity, vUv).xy;\n\
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n\
}\n';

var BRUSH_PRESSURE_FRAG = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform sampler2D uPressure;\n\
uniform sampler2D uDivergence;\n\
void main () {\n\
    float L = texture2D(uPressure, vL).x;\n\
    float R = texture2D(uPressure, vR).x;\n\
    float T = texture2D(uPressure, vT).x;\n\
    float B = texture2D(uPressure, vB).x;\n\
    float divergence = texture2D(uDivergence, vUv).x;\n\
    float pressure = (L + R + B + T - divergence) * 0.25;\n\
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n\
}\n';

var BRUSH_GRADIENT_SUBTRACT_FRAG = '\n\
varying vec2 vUv;\n\
varying vec2 vL;\n\
varying vec2 vR;\n\
varying vec2 vT;\n\
varying vec2 vB;\n\
uniform sampler2D uPressure;\n\
uniform sampler2D uVelocity;\n\
void main () {\n\
    float L = texture2D(uPressure, vL).x;\n\
    float R = texture2D(uPressure, vR).x;\n\
    float T = texture2D(uPressure, vT).x;\n\
    float B = texture2D(uPressure, vB).x;\n\
    vec2 velocity = texture2D(uVelocity, vUv).xy;\n\
    velocity -= vec2(R - L, T - B);\n\
    gl_FragColor = vec4(velocity, 0.0, 1.0);\n\
}\n';

var BRUSH_CLEAR_FRAG = '\n\
varying vec2 vUv;\n\
uniform sampler2D uTexture;\n\
uniform float value;\n\
void main () {\n\
    gl_FragColor = value * texture2D(uTexture, vUv);\n\
}\n';

var BRUSH_DISPLAY_FRAG = '\n\
varying vec2 vUv;\n\
uniform sampler2D uTexture;\n\
void main () {\n\
    float density = clamp(texture2D(uTexture, vUv).x, 0.0, 1.0);\n\
    gl_FragColor = vec4(0.03, 0.03, 0.03, density);\n\
}\n';

var BrushFX = (function () {
    'use strict';

    var canvas = document.getElementById('brush-canvas');
    var noop = { start: function () {}, stop: function () {} };
    if (!canvas || typeof THREE === 'undefined') { return noop; }

    // ── Tunables ─────────────────────────────────────────────────────────

    var SIM_RESOLUTION        = 128;  // velocity/pressure/curl/divergence field resolution
    var DYE_RESOLUTION        = 720;  // ink resolution — upsampled smoothly on display
    var DENSITY_DISSIPATION   = 0.9;  // higher = ink fades sooner
    var VELOCITY_DISSIPATION  = 0.4;  // higher = flow settles down sooner
    var PRESSURE_DISSIPATION  = 0.8;
    var PRESSURE_ITERATIONS   = 20;
    var CURL_STRENGTH         = 22;   // swirliness (vorticity confinement)
    var SPLAT_RADIUS          = 0.22;
    var SPLAT_FORCE           = 4200;
    var INK_PER_SPLAT         = 0.9;

    var renderer, scene, camera, quad;
    var velocityFBO, dyeFBO, divergenceRT, curlRT, pressureFBO;
    var simWidth, simHeight, dyeWidth, dyeHeight;
    var materials = {};
    var active = false;
    var rafId  = null;
    var lastTime = 0;

    function makeMaterial(fragmentShader, transparent) {
        return new THREE.ShaderMaterial({
            vertexShader: BRUSH_BASE_VERTEX,
            fragmentShader: fragmentShader,
            transparent: !!transparent,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                texelSize:   { value: new THREE.Vector2(1, 1) },
                uTarget:     { value: null },
                uVelocity:   { value: null },
                uSource:     { value: null },
                uCurl:       { value: null },
                uDivergence: { value: null },
                uPressure:   { value: null },
                uTexture:    { value: null },
                aspectRatio: { value: 1 },
                color:       { value: new THREE.Vector3() },
                point:       { value: new THREE.Vector2() },
                radius:      { value: SPLAT_RADIUS },
                dt:          { value: 0 },
                dissipation: { value: 0 },
                curlStrength:{ value: CURL_STRENGTH },
                value:       { value: 1 },
            },
        });
    }

    function createRT(w, h, type) {
        return new THREE.WebGLRenderTarget(w, h, {
            type: type,
            format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            depthBuffer: false,
            stencilBuffer: false,
        });
    }

    function makeDoubleFBO(w, h, type) {
        var a = createRT(w, h, type);
        var b = createRT(w, h, type);
        return {
            read: a, write: b,
            swap: function () { var t = this.read; this.read = this.write; this.write = t; },
        };
    }

    function stageWidth()  { return Math.max(1, window.innerWidth); }
    function stageHeight() { return Math.max(1, window.innerHeight); }

    function getResolution(resolution) {
        var w = stageWidth(), h = stageHeight();
        var aspect = w / h;
        if (aspect < 1) { aspect = 1 / aspect; }
        var min = Math.round(resolution);
        var max = Math.round(resolution * aspect);
        if (w > h) { return { width: max, height: min }; }
        return { width: min, height: max };
    }

    function disposeFBO(fbo) {
        if (!fbo) { return; }
        fbo.read.dispose();
        fbo.write.dispose();
    }

    function resize() {
        var w = stageWidth(), h = stageHeight();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(w, h, false);

        var simRes = getResolution(SIM_RESOLUTION);
        var dyeRes = getResolution(DYE_RESOLUTION);
        simWidth = simRes.width; simHeight = simRes.height;
        dyeWidth = dyeRes.width; dyeHeight = dyeRes.height;

        disposeFBO(velocityFBO);
        if (divergenceRT) { divergenceRT.dispose(); }
        if (curlRT) { curlRT.dispose(); }
        disposeFBO(pressureFBO);
        disposeFBO(dyeFBO);

        var floatType = THREE.HalfFloatType;
        velocityFBO  = makeDoubleFBO(simWidth, simHeight, floatType);
        divergenceRT = createRT(simWidth, simHeight, floatType);
        curlRT       = createRT(simWidth, simHeight, floatType);
        pressureFBO  = makeDoubleFBO(simWidth, simHeight, floatType);
        dyeFBO       = makeDoubleFBO(dyeWidth, dyeHeight, THREE.UnsignedByteType);
    }

    function renderPass(material, target) {
        quad.material = material;
        renderer.setRenderTarget(target);
        renderer.render(scene, camera);
    }

    // ── Pointer tracking ─────────────────────────────────────────────────

    var pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, down: false };

    function setPointer(clientX, clientY) {
        var x = clientX / stageWidth();
        var y = 1 - clientY / stageHeight();
        if (pointer.down) {
            pointer.dx = (x - pointer.x) * 5;
            pointer.dy = (y - pointer.y) * 5;
            pointer.moved = pointer.dx !== 0 || pointer.dy !== 0;
        }
        pointer.x = x;
        pointer.y = y;
        pointer.down = true;
    }

    function onMove(e) {
        if (!active) { return; }
        if (e.touches && e.touches[0]) {
            setPointer(e.touches[0].clientX, e.touches[0].clientY);
        } else {
            setPointer(e.clientX, e.clientY);
        }
    }

    // ── Simulation step ──────────────────────────────────────────────────

    function splat(x, y, dx, dy) {
        var aspect = stageWidth() / stageHeight();
        var u = materials.splat.uniforms;

        u.uTarget.value = velocityFBO.read.texture;
        u.aspectRatio.value = aspect;
        u.point.value.set(x, y);
        u.color.value.set(dx * SPLAT_FORCE, dy * SPLAT_FORCE, 0);
        u.radius.value = SPLAT_RADIUS / 100; // matches Pavel's correctRadius() scaling
        renderPass(materials.splat, velocityFBO.write);
        velocityFBO.swap();

        u.uTarget.value = dyeFBO.read.texture;
        u.color.value.set(INK_PER_SPLAT, INK_PER_SPLAT, INK_PER_SPLAT);
        renderPass(materials.splat, dyeFBO.write);
        dyeFBO.swap();
    }

    function step(dt) {
        var u;

        u = materials.curl.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uVelocity.value = velocityFBO.read.texture;
        renderPass(materials.curl, curlRT);

        u = materials.vorticity.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uVelocity.value = velocityFBO.read.texture;
        u.uCurl.value = curlRT.texture;
        u.curlStrength.value = CURL_STRENGTH;
        u.dt.value = dt;
        renderPass(materials.vorticity, velocityFBO.write);
        velocityFBO.swap();

        u = materials.divergence.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uVelocity.value = velocityFBO.read.texture;
        renderPass(materials.divergence, divergenceRT);

        u = materials.clear.uniforms;
        u.uTexture.value = pressureFBO.read.texture;
        u.value.value = PRESSURE_DISSIPATION;
        renderPass(materials.clear, pressureFBO.write);
        pressureFBO.swap();

        u = materials.pressure.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uDivergence.value = divergenceRT.texture;
        for (var i = 0; i < PRESSURE_ITERATIONS; i++) {
            u.uPressure.value = pressureFBO.read.texture;
            renderPass(materials.pressure, pressureFBO.write);
            pressureFBO.swap();
        }

        u = materials.gradientSubtract.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uPressure.value = pressureFBO.read.texture;
        u.uVelocity.value = velocityFBO.read.texture;
        renderPass(materials.gradientSubtract, velocityFBO.write);
        velocityFBO.swap();

        u = materials.advection.uniforms;
        u.texelSize.value.set(1 / simWidth, 1 / simHeight);
        u.uVelocity.value = velocityFBO.read.texture;
        u.uSource.value = velocityFBO.read.texture;
        u.dt.value = dt;
        u.dissipation.value = VELOCITY_DISSIPATION;
        renderPass(materials.advection, velocityFBO.write);
        velocityFBO.swap();

        u.texelSize.value.set(1 / dyeWidth, 1 / dyeHeight);
        u.uVelocity.value = velocityFBO.read.texture;
        u.uSource.value = dyeFBO.read.texture;
        u.dissipation.value = DENSITY_DISSIPATION;
        renderPass(materials.advection, dyeFBO.write);
        dyeFBO.swap();
    }

    function render() {
        var u = materials.display.uniforms;
        u.uTexture.value = dyeFBO.read.texture;
        quad.material = materials.display;
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
    }

    function frame(now) {
        if (!active) { return; }
        var dt = Math.min((now - lastTime) / 1000, 1 / 30) || 1 / 60;
        lastTime = now;

        if (pointer.moved) {
            splat(pointer.x, pointer.y, pointer.dx, pointer.dy);
            pointer.moved = false;
        }

        step(dt);
        render();
        rafId = requestAnimationFrame(frame);
    }

    function start() {
        if (active) { return; }
        active = true;
        canvas.classList.add('active');
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        active = false;
        canvas.classList.remove('active');
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        pointer.down = false;
        if (renderer) {
            renderer.setRenderTarget(null);
            renderer.clear();
        }
    }

    try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
        renderer.autoClear = true;
        renderer.setClearColor(0x000000, 0);

        scene  = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        quad   = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
        scene.add(quad);

        materials.splat            = makeMaterial(BRUSH_SPLAT_FRAG);
        materials.advection        = makeMaterial(BRUSH_ADVECTION_FRAG);
        materials.divergence       = makeMaterial(BRUSH_DIVERGENCE_FRAG);
        materials.curl             = makeMaterial(BRUSH_CURL_FRAG);
        materials.vorticity        = makeMaterial(BRUSH_VORTICITY_FRAG);
        materials.pressure         = makeMaterial(BRUSH_PRESSURE_FRAG);
        materials.gradientSubtract = makeMaterial(BRUSH_GRADIENT_SUBTRACT_FRAG);
        materials.clear            = makeMaterial(BRUSH_CLEAR_FRAG);
        materials.display          = makeMaterial(BRUSH_DISPLAY_FRAG, true);

        resize();
    } catch (e) {
        return noop;
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('resize', function () { resize(); });

    return { start: start, stop: stop };
}());
