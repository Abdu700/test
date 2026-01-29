// === ARC Raiders Skill Tree - Canvas Implementation ===
// PROTECTION: Domain Lock
/*(function () {
    const authorizedDomain = 'your-domain.com'; // CHANGE THIS to your actual domain
    if (window.location.hostname !== authorizedDomain && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        document.body.innerHTML = '<div style="color: white; background: #060505; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;"><div><h1>Unauthorized Domain</h1><p>This application is not authorized to run on this domain.</p></div></div>';
        throw new Error('Unauthorized domain');
    }
})();*/

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// منع F12 و Ctrl+Shift+I (Developer Tools)
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

const canvas = document.getElementById('skillTreeCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipDesc = document.getElementById('tooltipDesc');

// === COLORS ===
const COLORS = {
    conditioning: '#12FF70',
    mobility: '#F7CF09',
    survival: '#F3040E',
    disabled: '#606576',
    background: '#060505',
    skillBg: '#0A0B19',
    hover: '#D9DEE7',
    lineDark: '#606576'
};

// === COMPLETE SKILL DATA  ===
const SKILL_DATA = {
    Conditioning: {
        skills: [
            { id: 'used-to-the-weight', name: 'Used To The Weight', description: "Wearing a shield doesn't slow you down as much.", maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 550, y: 545, level: 0 },
            { id: 'blast-born', name: 'Blast-Born', description: 'Your hearing is less affected by nearby explosions.', maxPoints: 5, requiredSkill: 'used-to-the-weight', requiredPoints: null, x: 424, y: 539, level: 1 },
            { id: 'gentle-pressure', name: 'Gentle Pressure', description: 'You make less noise when breaching.', maxPoints: 5, requiredSkill: 'used-to-the-weight', requiredPoints: null, x: 431.5, y: 457, level: 1 },
            { id: 'fight-or-flight', name: 'Fight Or Flight', description: "When you're hurt in combat, regain a fixed amount of stamina.", maxPoints: 5, requiredSkill: 'blast-born', requiredPoints: null, x: 373, y: 510, level: 2 },
            { id: 'proficient-pryer', name: 'Proficient Pryer', description: 'Breaching doors and containers takes less time.', maxPoints: 5, requiredSkill: 'gentle-pressure', requiredPoints: null, x: 431.5, y: 398, level: 2 },
            { id: 'survivors-stamina', name: "Survivor's Stamina", description: "When you're critically hurt, your stamina regenerates faster.", maxPoints: 1, requiredSkill: 'fight-or-flight', requiredPoints: 15, x: 282, y: 450, level: 3 },
            { id: 'unburdened-roll', name: 'Unburdened Roll', description: 'If your shield breaks, your first Dodge Roll does not cost stamina.', maxPoints: 1, requiredSkill: 'proficient-pryer', requiredPoints: 15, x: 360, y: 316, level: 3 },
            { id: 'downed-but-determined', name: 'Downed But Determined', description: "When you're downed, it takes longer before you collapse.", maxPoints: 5, requiredSkill: 'survivors-stamina', requiredPoints: null, x: 184, y: 399, level: 4 },
            { id: 'a-little-extra', name: 'A Little Extra', description: 'Breaching an object generates resources.', maxPoints: 1, requiredSkill: ['survivors-stamina', 'unburdened-roll'], requiredPoints: null, x: 221, y: 332, level: 4 },
            { id: 'effortless-swing', name: 'Effortless Swing', description: 'Melee abilities cost less stamina.', maxPoints: 5, requiredSkill: 'unburdened-roll', requiredPoints: null, x: 261, y: 264, level: 4 },
            { id: 'turtle-crawl', name: 'Turtle Crawl', description: 'While downed, you take less damage.', maxPoints: 5, requiredSkill: 'downed-but-determined', requiredPoints: null, x: 133, y: 369, level: 5 },
            { id: 'loaded-arms', name: 'Loaded Arms', description: 'Your equipped weapon has less impact on encumbrance.', maxPoints: 1, requiredSkill: 'a-little-extra', requiredPoints: null, x: 170, y: 302, level: 5 },
            { id: 'sky-clearing-swing', name: 'Sky-Clearing Swing', description: 'You deal more melee damage to drones.', maxPoints: 5, requiredSkill: 'effortless-swing', requiredPoints: null, x: 210, y: 233, level: 5 },
            { id: 'back-on-your-feet', name: 'Back On Your Feet', description: "When you're critically hurt, your health regenerates.", maxPoints: 1, requiredSkill: ['turtle-crawl', 'loaded-arms'], requiredPoints: 36, x: 1, y: 290, level: 6 },
            { id: 'flyswatter', name: 'Flyswatter', description: 'Wasps and Turrets can be destroyed with a single melee attack.', maxPoints: 1, requiredSkill: ['loaded-arms', 'sky-clearing-swing'], requiredPoints: 36, x: 80, y: 154, level: 6 }
        ],
        edges: [
            { from: 'used-to-the-weight', to: 'blast-born', path: 'M141.632 34.3231C23.8993 -42.2394 54.2352 43.7125 0.786133 9.04307', x: 444.54, y: 550.9 },
            { from: 'blast-born', to: 'fight-or-flight', path: 'M53.4473 31.5881L0.720459 1.25212', x: 391.81, y: 528.88 },
            { from: 'fight-or-flight', to: 'survivors-stamina', path: 'M76.9944 44.3693L0.494385 0.869293', x: 317, y: 486.5 },
            { from: 'survivors-stamina', to: 'downed-but-determined', path: 'M114.003 66.8645L0.502686 0.864471', x: 202.5, y: 420 },
            { from: 'downed-but-determined', to: 'turtle-crawl', path: 'M50.7585 30.928L0.258545 0.427994', x: 152.5, y: 390 },
            { from: 'turtle-crawl', to: 'back-on-your-feet', path: 'M112.995 64.8692L0.494507 0.869186', x: 39, y: 325.5 },
            { from: 'survivors-stamina', to: 'a-little-extra', path: 'M75.3638 134.432C-4.13623 102.432 73.3638 29.4315 0.36377 0.931519', x: 240.5, y: 353 },
            { from: 'used-to-the-weight', to: 'gentle-pressure', path: 'M131 98C48.5 50 1 36.5 1 0', x: 454.5, y: 482 },
            { from: 'gentle-pressure', to: 'proficient-pryer', path: 'M1 58V0', x: 458, y: 420 },
            { from: 'proficient-pryer', to: 'unburdened-roll', path: 'M64.8877 66.4218C69.8877 31.9218 63.3877 27.4218 0.387695 0.921768', x: 394, y: 353.5 },
            { from: 'unburdened-roll', to: 'a-little-extra', path: 'M155.533 21.4485C85.5334 -42.5511 75.0334 68.4489 0.533447 21.4485', x: 239.5, y: 332.55 },
            { from: 'a-little-extra', to: 'loaded-arms', path: 'M51.5007 30.3656L0.500732 0.865616', x: 190.5, y: 323.5 },
            { from: 'loaded-arms', to: 'back-on-your-feet', path: 'M155.545 12.7653C102.545 -33.7347 93.5453 76.7653 0.545288 16.2653', x: 34.5, y: 311.23 },
            { from: 'loaded-arms', to: 'flyswatter', path: 'M75.9366 136.4C8.43665 104.4 102.437 50.3997 0.436646 0.899658', x: 115, y: 188.5 },
            { from: 'unburdened-roll', to: 'effortless-swing', path: 'M113.014 68.3575L0.514404 0.857483', x: 281, y: 286 },
            { from: 'effortless-swing', to: 'sky-clearing-swing', path: 'M50.5144 30.8575L0.514404 0.857483', x: 230.5, y: 256 },
            { from: 'sky-clearing-swing', to: 'flyswatter', path: 'M112.49 63.8716L0.490234 0.871582', x: 116.5, y: 191.5 }
        ]
    },
    Mobility: {
        skills: [
            { id: 'nimble-climber', name: 'Nimble Climber', description: 'You can climb and vault more quickly.', maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 646, y: 499, level: 0 },
            { id: 'marathon-runner', name: 'Marathon Runner', description: 'Moving around costs less stamina.', maxPoints: 5, requiredSkill: 'nimble-climber', requiredPoints: null, x: 550, y: 403, level: 1 },
            { id: 'slip-and-slide', name: 'Slip and Slide', description: 'You can slide further and faster.', maxPoints: 5, requiredSkill: 'nimble-climber', requiredPoints: null, x: 756, y: 403, level: 1 },
            { id: 'youthful-lungs', name: 'Youthful Lungs', description: 'Increase your max stamina.', maxPoints: 5, requiredSkill: 'marathon-runner', requiredPoints: null, x: 550, y: 348, level: 2 },
            { id: 'sturdy-ankles', name: 'Sturdy Ankles', description: 'You take less fall damage.', maxPoints: 5, requiredSkill: 'slip-and-slide', requiredPoints: null, x: 757, y: 348, level: 2 },
            { id: 'carry-the-momentum', name: 'Carry The Momentum', description: 'After a Sprint Dodge Roll, sprinting costs no stamina briefly.', maxPoints: 1, requiredSkill: 'youthful-lungs', requiredPoints: 15, x: 594, y: 277, level: 3 },
            { id: 'calming-stroll', name: 'Calming Stroll', description: 'While walking, stamina regenerates as if standing still.', maxPoints: 1, requiredSkill: 'sturdy-ankles', requiredPoints: 15, x: 697, y: 277, level: 3 },
            { id: 'effortless-roll', name: 'Effortless Roll', description: 'Dodge Rolls cost less stamina.', maxPoints: 5, requiredSkill: 'carry-the-momentum', requiredPoints: null, x: 549, y: 182, level: 4 },
            { id: 'crawl-before-you-walk', name: 'Crawl Before You Walk', description: "When you're downed, you crawl faster.", maxPoints: 5, requiredSkill: ['carry-the-momentum', 'calming-stroll'], requiredPoints: null, x: 654, y: 182, level: 4 },
            { id: 'off-the-wall', name: 'Off The Wall', description: 'You can Wall Leap further.', maxPoints: 5, requiredSkill: 'calming-stroll', requiredPoints: null, x: 756.5, y: 182, level: 4 },
            { id: 'heroic-leap', name: 'Heroic Leap', description: 'You can Sprint Dodge Roll further.', maxPoints: 5, requiredSkill: 'effortless-roll', requiredPoints: null, x: 549, y: 125, level: 5 },
            { id: 'vigorous-vaulter', name: 'Vigorous Vaulter', description: 'Vaulting is no longer slowed while exhausted.', maxPoints: 1, requiredSkill: 'crawl-before-you-walk', requiredPoints: null, x: 652, y: 125, level: 5 },
            { id: 'ready-to-roll', name: 'Ready To Roll', description: 'When falling, your Recovery Roll window is increased.', maxPoints: 5, requiredSkill: 'off-the-wall', requiredPoints: null, x: 757, y: 125, level: 5 },
            { id: 'vaults-on-vaults-on-vaults', name: 'Vaults on Vaults on Vaults', description: 'Vaulting no longer costs stamina.', maxPoints: 1, requiredSkill: ['heroic-leap', 'vigorous-vaulter'], requiredPoints: 36, x: 598, y: 3, level: 6 },
            { id: 'vault-spring', name: 'Vault Spring', description: 'Lets you jump at the end of a vault.', maxPoints: 1, requiredSkill: ['vigorous-vaulter', 'ready-to-roll'], requiredPoints: 36, x: 703, y: 3, level: 6 }
        ],
        edges: [
            { from: 'nimble-climber', to: 'marathon-runner', path: 'M105 112.534C105 4.53429 4.49951 102.034 0.999512 0.0342865', x: 577, y: 424 },
            { from: 'marathon-runner', to: 'youthful-lungs', path: 'M1 56V0', x: 576.5, y: 368 },
            { from: 'youthful-lungs', to: 'carry-the-momentum', path: 'M1.44458 57.7828C1.44458 1.44456 10.112 1.44456 54.8937 1.44456', x: 576.83, y: 312 },
            { from: 'carry-the-momentum', to: 'effortless-roll', path: 'M57.614 113.215C54.0026 -18.2408 6.49862 98.305 1.44263 0.0742493', x: 575, y: 203.5 },
            { from: 'effortless-roll', to: 'heroic-leap', path: 'M1 57V0', x: 577, y: 145 },
            { from: 'heroic-leap', to: 'vaults-on-vaults-on-vaults', path: 'M1.44458 113.536C1.44458 14.0358 51.4446 121.036 54.4446 0.0358276', x: 578, y: 35 },
            { from: 'carry-the-momentum', to: 'crawl-before-you-walk', path: 'M1.44409 113.473C5.05552 -17.9829 50.5595 98.305 55.6155 0.0742493', x: 627.39, y: 202.52 },
            { from: 'crawl-before-you-walk', to: 'vigorous-vaulter', path: 'M1 57V0', x: 680.5, y: 146 },
            { from: 'vigorous-vaulter', to: 'vaults-on-vaults-on-vaults', path: 'M54.4441 113.536C54.4441 14.0358 4.44409 121.036 1.44409 0.0358276', x: 627, y: 35 },
            { from: 'vigorous-vaulter', to: 'vault-spring', path: 'M1.44458 113.536C1.44458 14.0358 51.4446 121.036 54.4446 0.0358276', x: 681, y: 35 },
            { from: 'nimble-climber', to: 'slip-and-slide', path: 'M1 112.534C1 4.53429 101.5 102.034 105 0.0342865', x: 680, y: 423 },
            { from: 'slip-and-slide', to: 'sturdy-ankles', path: 'M1 56V0', x: 785, y: 370 },
            { from: 'sturdy-ankles', to: 'calming-stroll', path: 'M51.6255 54.9391C51.6255 -1.06091 51.6255 5.93909 0.125851 1.43909', x: 733, y: 312 },
            { from: 'calming-stroll', to: 'crawl-before-you-walk', path: 'M55.614 113.473C52.0026 -17.9829 6.49863 98.305 1.44263 0.0742493', x: 680.84, y: 203.24 },
            { from: 'calming-stroll', to: 'off-the-wall', path: 'M1.44409 113.215C5.05552 -18.2408 52.5595 98.305 57.6155 0.0742493', x: 730, y: 204 },
            { from: 'off-the-wall', to: 'ready-to-roll', path: 'M1 57V0', x: 784, y: 145 },
            { from: 'ready-to-roll', to: 'vault-spring', path: 'M54.4441 113.536C54.4441 14.0358 4.44409 121.036 1.44409 0.0358276', x: 731.5, y: 35.5 }
        ]
    },
    Survival: {
        skills: [
            { id: 'agile-croucher', name: 'Agile Croucher', description: 'Your movement speed while crouching is increased.', maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 774, y: 570, level: 0 },
            { id: 'looters-instincts', name: "Looter's Instincts", description: 'When searching a container, loot is revealed faster.', maxPoints: 5, requiredSkill: 'agile-croucher', requiredPoints: null, x: 908, y: 475, level: 1 },
            { id: 'revitalizing-squat', name: 'Revitalizing Squat', description: 'Stamina regeneration while crouched is increased.', maxPoints: 5, requiredSkill: 'agile-croucher', requiredPoints: null, x: 927, y: 555, level: 1 },
            { id: 'silent-scavenger', name: 'Silent Scavenger', description: 'You make less noise when looting.', maxPoints: 5, requiredSkill: 'looters-instincts', requiredPoints: null, x: 908, y: 415, level: 2 },
            { id: 'in-round-crafting', name: 'In-round Crafting', description: 'Unlocks field-craft items while topside.', maxPoints: 1, requiredSkill: 'revitalizing-squat', requiredPoints: null, x: 981, y: 526, level: 2 },
            { id: 'suffer-in-silence', name: 'Suffer In Silence', description: 'While critically hurt, your movement makes less noise.', maxPoints: 1, requiredSkill: 'silent-scavenger', requiredPoints: 15, x: 964, y: 341, level: 3 },
            { id: 'good-as-new', name: 'Good As New', description: 'While healing, stamina regeneration is increased.', maxPoints: 1, requiredSkill: 'in-round-crafting', requiredPoints: 15, x: 1043, y: 475, level: 3 },
            { id: 'broad-shoulders', name: 'Broad Shoulders', description: 'Increases the maximum weight you can carry.', maxPoints: 5, requiredSkill: 'suffer-in-silence', requiredPoints: null, x: 1088.5, y: 280, level: 4 },
            { id: 'traveling-tinkerer', name: 'Traveling Tinkerer', description: 'Unlocks additional items to field craft.', maxPoints: 1, requiredSkill: ['suffer-in-silence', 'good-as-new'], requiredPoints: null, x: 1131, y: 346, level: 4 },
            { id: 'stubborn-mule', name: 'Stubborn Mule', description: 'Stamina regeneration is less affected by over-encumbrance.', maxPoints: 5, requiredSkill: 'good-as-new', requiredPoints: null, x: 1168, y: 416, level: 4 },
            { id: 'looters-luck', name: "Looter's Luck", description: 'Chance to reveal twice as many items at once.', maxPoints: 5, requiredSkill: 'broad-shoulders', requiredPoints: null, x: 1138.5, y: 251, level: 5 },
            { id: 'one-raiders-scraps', name: "One Raider's Scraps", description: 'Chance of finding additional field-crafted items in Raider containers.', maxPoints: 5, requiredSkill: 'traveling-tinkerer', requiredPoints: null, x: 1180, y: 321, level: 5 },
            { id: 'three-deep-breaths', name: 'Three Deep Breaths', description: 'After an ability drains stamina, you recover more quickly.', maxPoints: 5, requiredSkill: 'stubborn-mule', requiredPoints: null, x: 1218.33, y: 386.33, level: 5 },
            { id: 'security-breach', name: 'Security Breach', description: 'Lets you breach Security Lockers.', maxPoints: 1, requiredSkill: ['looters-luck', 'one-raiders-scraps'], requiredPoints: 36, x: 1245, y: 178, level: 6 },
            { id: 'minesweeper', name: 'Minesweeper', description: 'Mines and explosive deployables can be defused.', maxPoints: 1, requiredSkill: ['one-raiders-scraps', 'three-deep-breaths'], requiredPoints: 36, x: 1322, y: 314, level: 6 }
        ],
        edges: [
            { from: 'agile-croucher', to: 'looters-instincts', path: 'M0.537842 103.564C87.5378 48.0637 123.538 47.0637 126.538 0.0637016', x: 810, y: 501.5 },
            { from: 'looters-instincts', to: 'silent-scavenger', path: 'M1.99976 58.5171L0.999756 0.0170898', x: 935, y: 443.5 },
            { from: 'silent-scavenger', to: 'suffer-in-silence', path: 'M2.11598 59.4781C-3.4391 25.5226 10.7854 12.7588 66.116 0.978073', x: 934.38, y: 383.5 },
            { from: 'suffer-in-silence', to: 'broad-shoulders', path: 'M0.505371 65.8629L111.505 0.86293', x: 1000.5, y: 309.5 },
            { from: 'broad-shoulders', to: 'looters-luck', path: 'M0.500732 30.3656L51.5007 0.865631', x: 1112.5, y: 280.5 },
            { from: 'looters-luck', to: 'security-breach', path: 'M0.497803 66.8673L115.498 0.86731', x: 1164.5, y: 213 },
            { from: 'suffer-in-silence', to: 'traveling-tinkerer', path: 'M0.360596 10.2544C81.8606 -21.2456 81.3606 40.2544 156.861 10.2544', x: 996, y: 367.25 },
            { from: 'traveling-tinkerer', to: 'one-raiders-scraps', path: 'M0.472412 26.8813L48.9724 0.881348', x: 1152.5, y: 349 },
            { from: 'one-raiders-scraps', to: 'security-breach', path: 'M59.0808 1.11517C3.65559 46.7542 48.5806 100.115 0.579001 121.114', x: 1208, y: 223.53 },
            { from: 'one-raiders-scraps', to: 'minesweeper', path: 'M0.581299 7.96924C66.3092 -20.9222 59.8087 58.5292 153.706 7.96924', x: 1203.66, y: 341.06 },
            { from: 'agile-croucher', to: 'revitalizing-squat', path: 'M0.50293 34.2624C128.503 -40.2377 84.0029 37.2623 142.003 12.7624', x: 808.5, y: 573.24 },
            { from: 'revitalizing-squat', to: 'in-round-crafting', path: 'M0.47876 27.8779L49.9788 0.877896', x: 949.5, y: 556 },
            { from: 'in-round-crafting', to: 'good-as-new', path: 'M0.508057 41.8613L70.0081 0.861298', x: 1000.5, y: 513.5 },
            { from: 'good-as-new', to: 'traveling-tinkerer', path: 'M0.641357 134.731C64.6414 81.2307 14.1414 57.7307 75.1414 0.730652', x: 1076.5, y: 375.5 },
            { from: 'good-as-new', to: 'stubborn-mule', path: 'M0.500244 67.8659L116.5 0.865936', x: 1075.5, y: 444 },
            { from: 'stubborn-mule', to: 'three-deep-breaths', path: 'M0.489502 28.3721L49.4895 0.872055', x: 1190.5, y: 416.5 },
            { from: 'three-deep-breaths', to: 'minesweeper', path: 'M0.491943 63.8706L111.992 0.870636', x: 1241.5, y: 351 }
        ]
    }
};

// === STATE ===
let state = {
    skills: {},
    pointsSpent: { Conditioning: 0, Mobility: 0, Survival: 0 },
    maxTotalPoints: 76
};

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let hoveredNode = null;
let loadedImages = {};

// === TOUCH STATE (Mobile only - does not affect PC) ===
let touchStartPos = null;
let touchStartTime = 0;
let longPressTimeout = null;
let isTouchPanning = false;
let initialPinchDistance = 0;
let lastTouchCenter = null;
const LONG_PRESS_DURATION = 500; // ms for right-click equivalent
const TAP_THRESHOLD = 10; // pixels movement to still count as tap

// Tree layout constants
const TREE_WIDTH = 1392;
const TREE_HEIGHT = 613;
const NODE_OFFSET_X = 30;
const NODE_OFFSET_Y = 30;

// === PERFORMANCE OPTIMIZATION (Mobile) ===
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
let lastDrawTime = 0;
const MOBILE_FRAME_DELAY = 32; // ~30fps on mobile (vs 60fps desktop)
let pendingDraw = false;
let iconsLoaded = false;

// === MOBILE SMOOTHNESS STATE (Phase 3 Optimization) ===
let isMoving = false;                   // Motion state for shadow throttling
let velocityX = 0, velocityY = 0;       // For inertia panning
let lastTouchX = 0, lastTouchY = 0;     // Last touch position
let lastTouchMoveTime = 0;              // For velocity calculation
const FRICTION = 0.93;                  // Momentum decay per frame (higher = slides longer)
const VELOCITY_THRESHOLD = 0.5;         // Min velocity to start inertia
let targetScale = 1;                    // For smooth zoom lerp
const ZOOM_LERP_FACTOR = 0.15;          // Zoom smoothing factor
let inertiaAnimationId = null;          // RAF ID for cleanup

function initializeState() {
    state.skills = {};
    state.pointsSpent = { Conditioning: 0, Mobility: 0, Survival: 0 };

    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const skill of data.skills) {
            state.skills[skill.id] = {
                ...skill,
                currentLevel: 0,
                category: category
            };
        }
    }
}

// === PRELOAD ICONS ===
function preloadIcons() {
    const iconBasePath = 'assets/skill-icons/';
    const skillIds = Object.keys(state.skills);

    if (isMobile) {
        // Lazy load icons on mobile - load in batches
        let loadedCount = 0;
        const batchSize = 5;

        function loadBatch(startIndex) {
            const endIndex = Math.min(startIndex + batchSize, skillIds.length);
            for (let i = startIndex; i < endIndex; i++) {
                const skillId = skillIds[i];
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === skillIds.length) {
                        iconsLoaded = true;
                        draw(); // Redraw once all icons loaded
                    }
                };
                img.src = `${iconBasePath}${skillId}.png`;
                loadedImages[skillId] = img;
            }
            // Schedule next batch
            if (endIndex < skillIds.length) {
                setTimeout(() => loadBatch(endIndex), 50);
            }
        }
        loadBatch(0);
    } else {
        // Desktop: load all icons immediately
        for (const skillId of skillIds) {
            const img = new Image();
            img.src = `${iconBasePath}${skillId}.png`;
            loadedImages[skillId] = img;
        }
        iconsLoaded = true;
    }
}

// === SVG PATH PARSER ===
function parseSvgPath(pathStr) {
    const commands = [];
    const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
    let match;

    while ((match = regex.exec(pathStr)) !== null) {
        const cmd = match[1];
        const args = match[2].trim().split(/[\s,]+/).filter(s => s).map(parseFloat);
        commands.push({ cmd: cmd.toUpperCase(), args });
    }

    return commands;
}

function drawSvgPath(ctx, pathStr, offsetX, offsetY) {
    const commands = parseSvgPath(pathStr);

    ctx.beginPath();
    let currentX = 0, currentY = 0;

    for (const { cmd, args } of commands) {
        switch (cmd) {
            case 'M':
                currentX = args[0];
                currentY = args[1];
                ctx.moveTo(offsetX + currentX, offsetY + currentY);
                break;
            case 'L':
                currentX = args[0];
                currentY = args[1];
                ctx.lineTo(offsetX + currentX, offsetY + currentY);
                break;
            case 'H':
                currentX = args[0];
                ctx.lineTo(offsetX + currentX, offsetY + currentY);
                break;
            case 'V':
                currentY = args[0];
                ctx.lineTo(offsetX + currentX, offsetY + currentY);
                break;
            case 'C':
                ctx.bezierCurveTo(
                    offsetX + args[0], offsetY + args[1],
                    offsetX + args[2], offsetY + args[3],
                    offsetX + args[4], offsetY + args[5]
                );
                currentX = args[4];
                currentY = args[5];
                break;
            case 'Q':
                ctx.quadraticCurveTo(
                    offsetX + args[0], offsetY + args[1],
                    offsetX + args[2], offsetY + args[3]
                );
                currentX = args[2];
                currentY = args[3];
                break;
        }
    }
}

// === CANVAS RESIZE ===
function resize() {
    // On mobile, use reduced DPR (max 1.5) for better performance
    // On desktop, use full DPR for crisp rendering
    const fullDpr = window.devicePixelRatio || 1;
    const dpr = isMobile ? Math.min(fullDpr, 1.5) : fullDpr;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    drawImmediate(); // Bypass throttle for resize
}

// === GET NODE STATE ===
function getNodeState(skill) {
    const s = state.skills[skill.id];
    if (s.currentLevel >= s.maxPoints) return 'maxed';
    if (s.currentLevel > 0) return 'active';
    if (canUpgrade(skill)) return 'unlocked';
    return 'locked';
}

// === DEPENDENCY CHECKING ===
function canUpgrade(skill) {
    const s = state.skills[skill.id];

    // Already maxed
    if (s.currentLevel >= s.maxPoints) return false;

    // Check total points
    const totalSpent = state.pointsSpent.Conditioning + state.pointsSpent.Mobility + state.pointsSpent.Survival;
    if (totalSpent >= state.maxTotalPoints) return false;

    // Check point requirement in category
    if (s.requiredPoints !== null) {
        const categoryPoints = getPointsBeforeLevel(s.category, s.level);
        if (categoryPoints < s.requiredPoints) return false;
    }

    // Check required skills
    if (!s.requiredSkill) return true;

    const requiredSkills = Array.isArray(s.requiredSkill) ? s.requiredSkill : [s.requiredSkill];

    // For array of required skills, ANY one needs to be active
    return requiredSkills.some(reqId => {
        const req = state.skills[reqId];
        return req && req.currentLevel > 0;
    });
}

function getPointsBeforeLevel(category, level) {
    let points = 0;
    for (const skill of Object.values(state.skills)) {
        if (skill.category === category && skill.level < level) {
            points += skill.currentLevel;
        }
    }
    return points;
}

function canDowngrade(skill) {
    const s = state.skills[skill.id];
    if (s.currentLevel === 0) return false;

    // Check if any skill depends on this one
    for (const other of Object.values(state.skills)) {
        if (other.currentLevel === 0) continue;
        if (!other.requiredSkill) continue;

        const reqs = Array.isArray(other.requiredSkill) ? other.requiredSkill : [other.requiredSkill];
        if (!reqs.includes(skill.id)) continue;

        // Check if there's another path to this skill
        const otherPaths = reqs.filter(r => r !== skill.id && state.skills[r].currentLevel > 0);
        if (otherPaths.length === 0 && s.currentLevel <= 1) return false;
    }

    // Check point requirements
    if (s.currentLevel === 1) {
        for (const other of Object.values(state.skills)) {
            if (other.category !== s.category) continue;
            if (other.currentLevel === 0) continue;
            if (other.requiredPoints === null) continue;
            if (other.level <= s.level) continue;

            const wouldHave = getPointsBeforeLevel(s.category, other.level) - 1;
            if (wouldHave < other.requiredPoints) return false;
        }
    }

    return true;
}

// === GET COLOR FOR CATEGORY ===
function getCategoryColor(category) {
    switch (category) {
        case 'Conditioning': return COLORS.conditioning;
        case 'Mobility': return COLORS.mobility;
        case 'Survival': return COLORS.survival;
        default: return COLORS.disabled;
    }
}

// === DRAWING ===
// Throttled draw function for mobile performance
function draw() {
    if (isMobile) {
        // Throttle draw calls on mobile
        const now = performance.now();
        if (now - lastDrawTime < MOBILE_FRAME_DELAY) {
            // Schedule a draw if not already pending
            if (!pendingDraw) {
                pendingDraw = true;
                requestAnimationFrame(() => {
                    pendingDraw = false;
                    drawImmediate();
                });
            }
            return;
        }
        lastDrawTime = now;
    }
    drawImmediate();
}

// Actual draw implementation
function drawImmediate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Clear and fill background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, w, h);

    // Add subtle gradient (skip on mobile for performance)
    if (!isMobile) {
        const grd = ctx.createRadialGradient(w / 2, h * 0.8, 0, w / 2, h / 2, Math.max(w, h));
        grd.addColorStop(0, 'rgba(15, 18, 30, 0.3)');
        grd.addColorStop(1, 'rgba(6, 5, 5, 0.8)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
    }

    // Calculate transform - center the tree
    const tx = (w - TREE_WIDTH * scale) / 2 + offsetX;
    const ty = (h - TREE_HEIGHT * scale) / 2 + offsetY;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(scale, scale);

    // Draw root lines (the main trunk)
    drawRootLines();

    // Draw edges for each category - Pass 1: Inactive edges
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const edge of data.edges) {
            drawEdge(edge, category, false);
        }
    }

    // Draw edges for each category - Pass 2: Active edges (Bring to Front)
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const edge of data.edges) {
            drawEdge(edge, category, true);
        }
    }

    // Draw nodes for each category
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const skill of data.skills) {
            drawNode(skill, category);
        }
    }

    // Draw badges (after all nodes/edges to be on top)
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const skill of data.skills) {
            drawNodeBadge(skill, category);
        }
    }

    // Draw branch labels (on Canvas so they pan/zoom with tree)
    drawBranchLabels();

    ctx.restore();

    // Update branch counters (now drawn on canvas)
}

function drawRootLines() {
    // The main trunk lines connecting to the bottom - shortened by 70%
    ctx.save();
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Conditioning root line (green) - small arc then straight down
    ctx.strokeStyle = COLORS.conditioning;
    ctx.beginPath();
    ctx.moveTo(Math.round(590), Math.round(575)); // Start from root node
    ctx.arcTo(Math.round(660), Math.round(575), Math.round(660), Math.round(620), 40); // Small arc (radius 40)
    ctx.lineTo(Math.round(660), Math.round(2000)); // Straight down
    ctx.stroke();

    // Mobility root line (yellow) - straight down from node
    ctx.strokeStyle = COLORS.mobility;
    ctx.beginPath();
    ctx.moveTo(Math.round(676), Math.round(529)); // Start from root node
    ctx.lineTo(Math.round(676), Math.round(2000)); // Straight down (center line)
    ctx.stroke();

    // Survival root line (red) - small arc then straight down
    ctx.strokeStyle = COLORS.survival;
    ctx.beginPath();
    ctx.moveTo(Math.round(790), Math.round(600)); // Start from root node
    ctx.arcTo(Math.round(695), Math.round(600), Math.round(695), Math.round(660), 40); // Small arc (radius 40)
    ctx.lineTo(Math.round(695), Math.round(2000)); // Straight down
    ctx.stroke();

    ctx.restore();
}

function drawBranchLabels() {
    // Draw branch labels on the Canvas (inside transform, so they pan/zoom with tree)
    // Positions based on user request:
    // - Conditioning: under blast-born (x: 424, y: 539)
    // - Mobility: middle between four nodes around (658, 372)
    // - Survival: under revitalizing-squat (x: 930, y: 563), slightly left

    ctx.save();
    ctx.textAlign = 'center';

    // Conditioning label - under blast-born (bolder and bigger)
    ctx.fillStyle = COLORS.conditioning;
    ctx.font = '600 24px Urbanist, sans-serif';
    ctx.globalAlpha = 0.9;
    ctx.fillText('CONDITIONING', Math.round(454), Math.round(623));
    ctx.font = 'bold 38px Barlow, sans-serif';
    ctx.globalAlpha = 1;
    ctx.fillText(state.pointsSpent.Conditioning.toString(), Math.round(454), Math.round(668));

    // Mobility label - in the middle (bolder and bigger) - moved +3px right, +3px down
    ctx.fillStyle = COLORS.mobility;
    ctx.font = '600 24px Urbanist, sans-serif';
    ctx.globalAlpha = 0.9;
    ctx.fillText('MOBILITY', Math.round(681), Math.round(386));
    ctx.font = 'bold 38px Barlow, sans-serif';
    ctx.globalAlpha = 1;
    ctx.fillText(state.pointsSpent.Mobility.toString(), Math.round(681), Math.round(431));

    // Survival label - under revitalizing-squat, slightly left (bolder and bigger)
    ctx.fillStyle = COLORS.survival;
    ctx.font = '600 24px Urbanist, sans-serif';
    ctx.globalAlpha = 0.9;
    ctx.fillText('SURVIVAL', Math.round(908), Math.round(643));
    ctx.font = 'bold 38px Barlow, sans-serif';
    ctx.globalAlpha = 1;
    ctx.fillText(state.pointsSpent.Survival.toString(), Math.round(908), Math.round(688));

    ctx.restore();
}

function drawEdge(edge, category, activeFilter) {
    const fromSkill = state.skills[edge.from];
    const toSkill = state.skills[edge.to];

    // Edge is highlighted when:
    // 1. FROM skill has points (active)
    // 2. AND TO skill is either active/maxed OR is unlocked (can be upgraded)
    // This matches the reference website's logic
    const fromHasPoints = fromSkill.currentLevel > 0;
    const toIsActiveOrMaxed = toSkill.currentLevel > 0;

    // Check if TO skill is unlocked (can receive points from this connection)
    // TO skill must have FROM skill in its dependencies
    const toRequiresFrom = toSkill.requiredSkill &&
        (Array.isArray(toSkill.requiredSkill)
            ? toSkill.requiredSkill.includes(edge.from)
            : toSkill.requiredSkill === edge.from);

    // Get TO skill's current state
    const toSkillObj = Object.values(SKILL_DATA).flatMap(d => d.skills).find(s => s.id === edge.to);
    const toIsUnlocked = toSkillObj ? canUpgrade(toSkillObj) : false;

    // Line is highlighted when FROM has points AND (TO has points OR TO is unlocked)
    const isActive = fromHasPoints && (toIsActiveOrMaxed || (toRequiresFrom && toIsUnlocked));

    // Layering filter: only draw if it matches our current pass (if filter provided)
    if (activeFilter !== undefined && isActive !== activeFilter) return;

    const color = getCategoryColor(category);

    ctx.save();

    // Draw the path - solid line, no shadows
    drawSvgPath(ctx, edge.path, Math.round(edge.x), Math.round(edge.y));

    // Line style based on active state - active lines thicker, inactive thinner
    ctx.strokeStyle = isActive ? color : COLORS.lineDark;
    ctx.lineWidth = isActive ? 8 : 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
}

function drawNode(skill, category) {
    const s = state.skills[skill.id];
    const nodeState = getNodeState(skill);
    const color = getCategoryColor(category);
    const isLarge = skill.level === 0 || skill.maxPoints === 1 && skill.requiredPoints !== null;
    const size = isLarge ? 35 : 20;

    const x = Math.round(skill.x + NODE_OFFSET_X);
    const y = Math.round(skill.y + NODE_OFFSET_Y);

    const isHovered = hoveredNode && hoveredNode.id === skill.id;

    // Determine visual state based on user's 4-state logic:
    // 1. locked = grey border, grey icon
    // 2. unlocked (0 points but can upgrade) = branch color border, grey icon
    // 3. active (has points but not maxed) = branch color border, branch color icon bg
    // 4. maxed = branch color node bg, black icon bg, no counter

    const isLocked = nodeState === 'locked';
    const isMaxed = nodeState === 'maxed';
    const isActive = s.currentLevel > 0 && !isMaxed;
    const isUnlocked = !isLocked && s.currentLevel === 0;

    ctx.save();

    // For large nodes, draw outer ring when maxed
    if (isLarge && isMaxed) {
        // First fill the entire area (including gap between node and ring) with branch color
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw outer ring border
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Main node circle (node background)
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);

    // Node background fill based on state
    if (isMaxed) {
        // Maxed: node background is branch color
        ctx.fillStyle = color;
    } else {
        // All other states: dark background
        ctx.fillStyle = COLORS.skillBg;
    }
    ctx.fill();

    // Border color based on state and hover
    ctx.lineWidth = 3;
    if (isLocked) {
        // Locked: grey border
        ctx.strokeStyle = COLORS.disabled;
    } else if (isHovered && !isMaxed) {
        // Hover on non-maxed: grey border
        ctx.strokeStyle = COLORS.disabled;
    } else {
        // Normal state or maxed: branch color border
        ctx.strokeStyle = color;
    }
    ctx.stroke();

    // Draw icon with background
    const iconSize = size * 1.4;
    const img = loadedImages[skill.id];

    if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size - 3, 0, Math.PI * 2);
        ctx.clip();

        // Icon background color based on state:
        // Locked: grey icon (white/light grey on dark bg)
        // Unlocked: grey icon
        // Active: branch color icon background
        // Maxed: black icon background

        if (isMaxed) {
            // Use filter for crisp black icon (no shadow throttling for maxed - filter is not the main bottleneck)
            ctx.filter = 'brightness(0)';
            ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
            ctx.filter = 'none';
            ctx.restore();
        } else if (isActive) {
            // Active: branch color icon background
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = color;
            ctx.fill();

            // Use mask technique - icon acts as mask
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
            ctx.restore();
        } else {
            // Locked or Unlocked: grey icon (white on dark)
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = isLocked ? '#666666' : '#AAAAAA';
            ctx.fill();

            // Use mask technique - icon acts as mask
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
            ctx.restore();
        }
    }

    // Lock icon for locked skills with point requirements
    // Only show lock if the required points are NOT yet met
    if (isLocked && s.requiredPoints !== null) {
        const categoryPoints = getPointsBeforeLevel(s.category, s.level);
        const pointsNotMet = categoryPoints < s.requiredPoints;

        if (pointsNotMet) {
            const lockX = x - size + 8;
            const lockY = y + size - 17;

            ctx.fillStyle = COLORS.disabled;
            ctx.beginPath();
            ctx.arc(lockX, lockY, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = COLORS.disabled;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Lock symbol
            ctx.fillStyle = COLORS.skillBg;
            ctx.fillRect(lockX - 5, lockY - 2, 10, 8);
            ctx.strokeStyle = COLORS.skillBg;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(lockX, lockY - 5, 4, Math.PI, 0, false);
            ctx.stroke();
        }
    }

    ctx.restore();
}

function drawNodeBadge(skill, category) {
    const s = state.skills[skill.id];
    const nodeState = getNodeState(skill);
    const color = getCategoryColor(category);
    const isLarge = skill.level === 0 || skill.maxPoints === 1 && skill.requiredPoints !== null;
    const size = isLarge ? 35 : 20;

    const x = Math.round(skill.x + NODE_OFFSET_X);
    const y = Math.round(skill.y + NODE_OFFSET_Y);

    const isLocked = nodeState === 'locked';
    const isMaxed = nodeState === 'maxed';

    if (!isLocked && !isMaxed) {
        ctx.save();
        const badgeText = `${s.currentLevel}/${s.maxPoints}`;
        ctx.font = 'bold 10px Barlow';
        const textWidth = ctx.measureText(badgeText).width;
        const badgeWidth = textWidth + 10;
        const badgeHeight = 16;
        const badgeY = y + size; // Moved up by another 3px (was +3, original +8)

        // Badge background
        ctx.fillStyle = COLORS.skillBg;
        ctx.beginPath();
        roundRect(ctx, x - badgeWidth / 2, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, 8);
        ctx.fill();

        // Badge border - uses branch color
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Badge text - always yellow
        ctx.fillStyle = COLORS.mobility; // Yellow color
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, x, badgeY);
        ctx.restore();
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function updateCounters() {
    document.getElementById('conditioningCount').textContent = state.pointsSpent.Conditioning;
    document.getElementById('mobilityCount').textContent = state.pointsSpent.Mobility;
    document.getElementById('survivalCount').textContent = state.pointsSpent.Survival;
}

// === INTERACTION ===
function getNodeAt(clientX, clientY) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tx = (w - TREE_WIDTH * scale) / 2 + offsetX;
    const ty = (h - TREE_HEIGHT * scale) / 2 + offsetY;

    for (const skill of Object.values(state.skills)) {
        const isLarge = skill.level === 0 || skill.maxPoints === 1 && skill.requiredPoints !== null;
        const size = isLarge ? 35 : 20;

        const nodeX = (skill.x + NODE_OFFSET_X) * scale + tx;
        const nodeY = (skill.y + NODE_OFFSET_Y) * scale + ty;

        const dist = Math.hypot(clientX - nodeX, clientY - nodeY);
        if (dist <= size * scale + 5) {
            return skill;
        }
    }

    return null;
}

function showTooltip(skill) {
    const s = state.skills[skill.id];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tx = (w - TREE_WIDTH * scale) / 2 + offsetX;
    const ty = (h - TREE_HEIGHT * scale) / 2 + offsetY;

    const nodeX = (skill.x + NODE_OFFSET_X) * scale + tx;
    const nodeY = (skill.y + NODE_OFFSET_Y) * scale + ty;

    tooltipName.textContent = skill.name;

    // Build description with required points hint for locked nodes
    let description = skill.description;
    const nodeState = getNodeState(skill);

    if (nodeState === 'locked' && s.requiredPoints !== null) {
        const categoryPoints = getPointsBeforeLevel(s.category, s.level);
        if (categoryPoints < s.requiredPoints) {
            description += `\n\nRequires ${s.requiredPoints} points in ${s.category} (${categoryPoints}/${s.requiredPoints})`;
        }
    }

    tooltipDesc.textContent = description;

    const isLarge = skill.level === 0 || (skill.maxPoints === 1 && skill.requiredPoints !== null);
    const size = isLarge ? 35 : 20;

    // Position tooltip above the node
    tooltip.style.left = nodeX + 'px';
    tooltip.style.top = (nodeY - size * scale - 12) + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.classList.add('visible');
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

// === EVENT HANDLERS ===
canvas.addEventListener('mousemove', (e) => {
    const node = getNodeAt(e.clientX, e.clientY);

    if (node !== hoveredNode) {
        hoveredNode = node;
        draw();
    }

    if (node) {
        showTooltip(node);
        canvas.style.cursor = getNodeState(node) !== 'locked' ? 'pointer' : 'not-allowed';
    } else {
        hideTooltip();
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
    }

    if (isDragging) {
        offsetX = e.clientX - dragStart.x;
        offsetY = e.clientY - dragStart.y;
        draw();
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left click
        const node = getNodeAt(e.clientX, e.clientY);
        if (!node) {
            isDragging = true;
            dragStart = { x: e.clientX - offsetX, y: e.clientY - offsetY };
            canvas.style.cursor = 'grabbing';
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('click', (e) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node && canUpgrade(node)) {
        const s = state.skills[node.id];
        s.currentLevel++;
        state.pointsSpent[s.category]++;
        draw();
        showTooltip(node);
        updatePointsDisplay();
        updateURL();
    }
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const node = getNodeAt(e.clientX, e.clientY);
    if (node && canDowngrade(node)) {
        const s = state.skills[node.id];
        s.currentLevel--;
        state.pointsSpent[s.category]--;
        draw();
        showTooltip(node);
        updatePointsDisplay();
        updateURL();
    }
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Get mouse position relative to canvas
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate position in tree coordinates before zoom
    const w = window.innerWidth;
    const h = window.innerHeight;
    const oldTx = (w - TREE_WIDTH * scale) / 2 + offsetX;
    const oldTy = (h - TREE_HEIGHT * scale) / 2 + offsetY;
    const treeX = (mouseX - oldTx) / scale;
    const treeY = (mouseY - oldTy) / scale;

    // Apply zoom
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(2.5, scale + delta));

    // Calculate new offsets to keep mouse position over same tree point
    const newTx = mouseX - treeX * newScale;
    const newTy = mouseY - treeY * newScale;

    offsetX = newTx - (w - TREE_WIDTH * newScale) / 2;
    offsetY = newTy - (h - TREE_HEIGHT * newScale) / 2;
    scale = newScale;

    draw();
});

canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
    hideTooltip();
    draw();
});

// === TOUCH EVENT HANDLERS (Mobile only - does not affect PC mouse events) ===

// Helper: Get distance between two touch points
function getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Helper: Get center point between two touches
function getTouchCenter(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling

    if (e.touches.length === 1) {
        // Single touch - could be tap, long-press, or pan start
        const touch = e.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTime = Date.now();
        isTouchPanning = false;

        // Start long-press detection for right-click equivalent
        longPressTimeout = setTimeout(() => {
            const node = getNodeAt(touchStartPos.x, touchStartPos.y);
            if (node && canDowngrade(node)) {
                const s = state.skills[node.id];
                s.currentLevel--;
                state.pointsSpent[s.category]--;
                draw();
                updatePointsDisplay();
                updateURL();
                // Vibrate for feedback if available
                if (navigator.vibrate) navigator.vibrate(50);
            }
            touchStartPos = null; // Consumed by long-press
        }, LONG_PRESS_DURATION);

    } else if (e.touches.length === 2) {
        // Two-finger touch - pinch to zoom
        clearTimeout(longPressTimeout);
        touchStartPos = null;
        initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
        lastTouchCenter = getTouchCenter(e.touches[0], e.touches[1]);
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();

    if (e.touches.length === 1 && touchStartPos) {
        const touch = e.touches[0];
        const now = performance.now();
        const dx = touch.clientX - touchStartPos.x;
        const dy = touch.clientY - touchStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If moved beyond threshold, cancel long-press and start panning
        if (distance > TAP_THRESHOLD) {
            clearTimeout(longPressTimeout);

            // Cancel any running inertia animation
            if (inertiaAnimationId) {
                cancelAnimationFrame(inertiaAnimationId);
                inertiaAnimationId = null;
            }

            if (!isTouchPanning) {
                // Start panning from current position
                isTouchPanning = true;
                dragStart = { x: touch.clientX - offsetX, y: touch.clientY - offsetY };
                // Initialize velocity tracking
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                lastTouchMoveTime = now;
            } else {
                // Calculate velocity for inertia (mobile only)
                if (isMobile && lastTouchMoveTime > 0) {
                    const dt = now - lastTouchMoveTime;
                    if (dt > 0 && dt < 100) { // Ignore stale data
                        velocityX = (touch.clientX - lastTouchX) / dt * 16; // Normalize to ~60fps
                        velocityY = (touch.clientY - lastTouchY) / dt * 16;
                    }
                }
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                lastTouchMoveTime = now;

                // Set motion state for shadow throttling
                isMoving = true;

                // Continue panning
                offsetX = touch.clientX - dragStart.x;
                offsetY = touch.clientY - dragStart.y;
                draw();
            }
        }

    } else if (e.touches.length === 2 && initialPinchDistance > 0) {
        // Pinch to zoom
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
        const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);

        // Calculate zoom
        const zoomFactor = currentDistance / initialPinchDistance;
        const newScale = Math.max(0.5, Math.min(2.5, scale * zoomFactor));

        if (newScale !== scale) {
            // Set motion state
            isMoving = true;

            // Zoom towards pinch center
            const w = window.innerWidth;
            const h = window.innerHeight;
            const oldTx = (w - TREE_WIDTH * scale) / 2 + offsetX;
            const oldTy = (h - TREE_HEIGHT * scale) / 2 + offsetY;
            const treeX = (currentCenter.x - oldTx) / scale;
            const treeY = (currentCenter.y - oldTy) / scale;

            // Mobile: Use smooth lerp for zoom
            if (isMobile) {
                targetScale = newScale;
                scale += (targetScale - scale) * ZOOM_LERP_FACTOR;
            } else {
                scale = newScale;
            }

            const newTx = currentCenter.x - treeX * scale;
            const newTy = currentCenter.y - treeY * scale;

            offsetX = newTx - (w - TREE_WIDTH * scale) / 2;
            offsetY = newTy - (h - TREE_HEIGHT * scale) / 2;
            draw();
        }

        // Also allow panning while zooming
        if (lastTouchCenter) {
            offsetX += currentCenter.x - lastTouchCenter.x;
            offsetY += currentCenter.y - lastTouchCenter.y;
        }

        initialPinchDistance = currentDistance;
        lastTouchCenter = currentCenter;
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    clearTimeout(longPressTimeout);

    // Check if this was a quick tap (not a pan or long-press)
    if (touchStartPos && !isTouchPanning) {
        const tapDuration = Date.now() - touchStartTime;

        if (tapDuration < LONG_PRESS_DURATION) {
            // This is a tap - add skill point (left-click equivalent)
            const node = getNodeAt(touchStartPos.x, touchStartPos.y);
            if (node && canUpgrade(node)) {
                const s = state.skills[node.id];
                s.currentLevel++;
                state.pointsSpent[s.category]++;
                draw();
                updatePointsDisplay();
                updateURL();
            }
        }
        // No inertia for taps
        isMoving = false;
    } else if (isTouchPanning && isMobile) {
        // Start inertia animation if velocity is significant
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

        if (speed > VELOCITY_THRESHOLD) {
            function inertiaLoop() {
                velocityX *= FRICTION;
                velocityY *= FRICTION;
                offsetX += velocityX;
                offsetY += velocityY;

                const currentSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

                // Continue or stop
                if (currentSpeed > 0.1) {
                    draw();
                    inertiaAnimationId = requestAnimationFrame(inertiaLoop);
                } else {
                    // Motion stopped - render full quality
                    isMoving = false;
                    velocityX = velocityY = 0;
                    inertiaAnimationId = null;
                    draw(); // Final high-quality render
                }
            }
            inertiaAnimationId = requestAnimationFrame(inertiaLoop);
        } else {
            // No significant velocity - stop immediately
            isMoving = false;
            velocityX = velocityY = 0;
            draw();
        }
    } else {
        // Desktop or no panning - just reset
        isMoving = false;
    }

    // Reset touch state
    touchStartPos = null;
    isTouchPanning = false;
    initialPinchDistance = 0;
    lastTouchCenter = null;
    lastTouchMoveTime = 0;
});

canvas.addEventListener('touchcancel', (e) => {
    clearTimeout(longPressTimeout);
    // Cancel any running inertia
    if (inertiaAnimationId) {
        cancelAnimationFrame(inertiaAnimationId);
        inertiaAnimationId = null;
    }
    // Reset all touch and smoothness state
    touchStartPos = null;
    isTouchPanning = false;
    initialPinchDistance = 0;
    lastTouchCenter = null;
    lastTouchMoveTime = 0;
    isMoving = false;
    velocityX = velocityY = 0;
});

// === UI CONTROLS (Reset, Share, Points Counter) ===

// DOM Elements
const resetBtn = document.getElementById('resetBtn');
const shareBtn = document.getElementById('shareBtn');
const pointsCounter = document.getElementById('pointsCounter');
const pointsPopup = document.getElementById('pointsPopup');
const pointsRemainingEl = document.getElementById('pointsRemaining');
const maxPointsEl = document.getElementById('maxPoints');
const maxPointsInput = document.getElementById('maxPointsInput');
const decreaseMaxBtn = document.getElementById('decreaseMaxBtn');
const increaseMaxBtn = document.getElementById('increaseMaxBtn');

// Skill ID to letter encoding (for URL sharing)
const SKILL_IDS = [];
for (const [category, data] of Object.entries(SKILL_DATA)) {
    for (const skill of data.skills) {
        SKILL_IDS.push(skill.id);
    }
}
SKILL_IDS.sort();

function getSkillLetter(skillId) {
    const index = SKILL_IDS.indexOf(skillId);
    if (index < 26) {
        return String.fromCharCode(97 + index);
    } else {
        const first = String.fromCharCode(97 + Math.floor((index - 26) / 26));
        const second = String.fromCharCode(97 + (index - 26) % 26);
        return first + second;
    }
}

function getSkillFromLetter(letter) {
    let index;
    if (letter.length === 1) {
        index = letter.charCodeAt(0) - 97;
    } else {
        index = 26 + (letter.charCodeAt(0) - 97) * 26 + (letter.charCodeAt(1) - 97);
    }
    return SKILL_IDS[index] || null;
}

// Encode current skill state to URL string
function encodeSkillState() {
    const parts = [];

    // Get skills with points, sorted by letter
    const skillsWithPoints = Object.values(state.skills)
        .filter(s => s.currentLevel > 0)
        .sort((a, b) => getSkillLetter(a.id).localeCompare(getSkillLetter(b.id)));

    for (const skill of skillsWithPoints) {
        parts.push(getSkillLetter(skill.id) + skill.currentLevel);
    }

    let buildStr = parts.join('');

    // Add max points if not default
    if (state.maxTotalPoints !== 76) {
        buildStr += '_m' + state.maxTotalPoints;
    }

    return buildStr;
}

// Decode URL string to restore skill state
function decodeSkillState(buildStr) {
    if (!buildStr || buildStr.trim() === '') return false;

    // Check for max points modifier
    const maxMatch = buildStr.match(/_m(\d+)$/);
    if (maxMatch) {
        state.maxTotalPoints = parseInt(maxMatch[1], 10);
        buildStr = buildStr.replace(/_m\d+$/, '');
    }

    // Parse skill levels
    const regex = /([a-z]{1,2})(\d+)/g;
    let match;

    while ((match = regex.exec(buildStr)) !== null) {
        const letter = match[1];
        const level = parseInt(match[2], 10);
        const skillId = getSkillFromLetter(letter);

        if (skillId && state.skills[skillId]) {
            const skill = state.skills[skillId];
            const safeLevel = Math.min(level, skill.maxPoints);
            skill.currentLevel = safeLevel;
            state.pointsSpent[skill.category] += safeLevel;
        }
    }

    return true;
}

// Reset all skills
function resetSkillTree() {
    for (const skill of Object.values(state.skills)) {
        skill.currentLevel = 0;
    }
    state.pointsSpent = { Conditioning: 0, Mobility: 0, Survival: 0 };
    draw();
    updatePointsDisplay();
    updateURL();
}

// Update the points counter display
function updatePointsDisplay() {
    const totalSpent = state.pointsSpent.Conditioning +
        state.pointsSpent.Mobility +
        state.pointsSpent.Survival;
    const remaining = state.maxTotalPoints - totalSpent;

    pointsRemainingEl.textContent = remaining;
    maxPointsEl.textContent = state.maxTotalPoints;
    maxPointsInput.value = state.maxTotalPoints;

    // Update styling when all points spent
    if (remaining === 0) {
        pointsCounter.classList.add('all-spent');
    } else {
        pointsCounter.classList.remove('all-spent');
    }
}

// Update URL with current build state (without page reload)
function updateURL() {
    const buildStr = encodeSkillState();
    const newURL = buildStr ?
        window.location.pathname + '?build=' + buildStr :
        window.location.pathname;

    window.history.replaceState({}, '', newURL);
}

// Copy share URL to clipboard
async function shareSkillTree() {
    const buildStr = encodeSkillState();
    const shareURL = window.location.origin + window.location.pathname +
        (buildStr ? '?build=' + buildStr : '');

    try {
        await navigator.clipboard.writeText(shareURL);
        shareBtn.textContent = 'COPIED!';
        shareBtn.classList.add('copied');

        setTimeout(() => {
            shareBtn.textContent = 'SHARE';
            shareBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for mobile
        const textArea = document.createElement('textarea');
        textArea.value = shareURL;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            shareBtn.textContent = 'COPIED!';
            shareBtn.classList.add('copied');
            setTimeout(() => {
                shareBtn.textContent = 'SHARE';
                shareBtn.classList.remove('copied');
            }, 2000);
        } catch (e) {
            alert('Copy this URL: ' + shareURL);
        }
        document.body.removeChild(textArea);
    }
}

// Toggle points popup
function togglePointsPopup(e) {
    e.stopPropagation();
    pointsPopup.classList.toggle('visible');
}

// Change max points
function setMaxPoints(value) {
    const newMax = Math.max(1, parseInt(value, 10) || 76);
    state.maxTotalPoints = newMax;
    updatePointsDisplay();
    updateURL();
}

// Setup UI event handlers
function setupUIHandlers() {
    // Reset button
    resetBtn.addEventListener('click', resetSkillTree);

    // Share button
    shareBtn.addEventListener('click', shareSkillTree);

    // Points counter click to show popup
    pointsCounter.addEventListener('click', togglePointsPopup);

    // Prevent popup clicks from closing it
    pointsPopup.addEventListener('click', (e) => e.stopPropagation());

    // Close popup when clicking elsewhere
    document.addEventListener('click', () => {
        pointsPopup.classList.remove('visible');
    });

    // Max points controls
    decreaseMaxBtn.addEventListener('click', () => {
        setMaxPoints(state.maxTotalPoints - 1);
    });

    increaseMaxBtn.addEventListener('click', () => {
        setMaxPoints(state.maxTotalPoints + 1);
    });

    maxPointsInput.addEventListener('change', (e) => {
        setMaxPoints(e.target.value);
    });

    maxPointsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            setMaxPoints(e.target.value);
            pointsPopup.classList.remove('visible');
        }
    });
}

// Load build from URL on page load
function loadBuildFromURL() {
    const params = new URLSearchParams(window.location.search);
    const build = params.get('build');
    if (build) {
        decodeSkillState(build);
    }
}

// === INITIALIZE ===
window.addEventListener('resize', resize);

function init() {
    initializeState();
    loadBuildFromURL(); // Restore state from URL before preloading icons
    preloadIcons();
    resize();

    // Setup UI handlers
    setupUIHandlers();
    updatePointsDisplay();

    // Wait for icons to load
    setTimeout(draw, 200);
}

init();
