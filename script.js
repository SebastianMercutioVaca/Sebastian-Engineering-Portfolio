import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// ============================================================
// VARIABLES
// ============================================================

let head;
let headGroup;

let leftEye;
let rightEye;

let leftPupil;
let rightPupil;

// NEW BLINK EYELIDS
let leftBlinkLid;
let rightBlinkLid;

let modelSize = 1;


// ============================================================
// BLINK VARIABLES
// ============================================================

let blinkAmount = 0;
let blinkState = "waiting";
let blinkStartTime = 0;

// First blink happens a few seconds after loading
let nextBlinkTime =
    performance.now() + randomBlinkDelay();


// ============================================================
// RANDOM BLINK DELAY
// ============================================================

function randomBlinkDelay() {

    // Random delay between 3 and 6 seconds
    return 3000 + Math.random() * 3000;

}


// ============================================================
// 3D CONTAINER
// ============================================================

const container =
    document.getElementById("head-model");


// ============================================================
// SCENE
// ============================================================

const scene =
    new THREE.Scene();


// ============================================================
// CAMERA
// ============================================================

const camera =
    new THREE.PerspectiveCamera(

        35,

        container.clientWidth /
        container.clientHeight,

        0.1,

        100000

    );


// ============================================================
// RENDERER
// ============================================================

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: true

    });


renderer.setSize(

    container.clientWidth,

    container.clientHeight

);


renderer.setPixelRatio(

    Math.min(
        window.devicePixelRatio,
        2
    )

);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


container.appendChild(
    renderer.domElement
);


// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
    new THREE.HemisphereLight(

        0xffffff,

        0x222222,

        1.4

    );


scene.add(
    ambientLight
);


const mainLight =
    new THREE.DirectionalLight(

        0xffffff,

        2

    );


mainLight.position.set(
    3,
    5,
    6
);


scene.add(
    mainLight
);


const sideLight =
    new THREE.DirectionalLight(

        0xffffff,

        0.7

    );


sideLight.position.set(
    -4,
    2,
    3
);


scene.add(
    sideLight
);


// ============================================================
// HEAD GROUP
// ============================================================

headGroup =
    new THREE.Group();


scene.add(
    headGroup
);


// ============================================================
// LOAD HEAD
// ============================================================

const loader =
    new GLTFLoader();


loader.load(

    "./assets/models/head.glb",


    function (gltf) {

        head =
            gltf.scene;


        // ====================================================
        // HEAD MATERIAL
        // ====================================================

        head.traverse(
            function (object) {

                if (object.isMesh) {

                    object.material =
                        new THREE.MeshStandardMaterial({

                            color: 0xc98f6b,

                            roughness: 0.8,

                            metalness: 0,

                            flatShading: true

                        });

                }

            }
        );


        // ====================================================
        // HEAD ORIENTATION
        // ====================================================

        head.rotation.y =
            Math.PI / 2;


        // ====================================================
        // ADD HEAD
        // ====================================================

        headGroup.add(
            head
        );


        // ====================================================
        // MEASURE HEAD
        // ====================================================

        let box =
            new THREE.Box3()
                .setFromObject(head);


        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        // ====================================================
        // CENTER HEAD
        // ====================================================

        head.position.x -=
            center.x;

        head.position.y -=
            center.y;

        head.position.z -=
            center.z;


        box =
            new THREE.Box3()
                .setFromObject(head);


        const centeredSize =
            box.getSize(
                new THREE.Vector3()
            );


        modelSize =
            Math.max(

                centeredSize.x,

                centeredSize.y,

                centeredSize.z

            );


        headGroup.userData.headSize =
            modelSize;


        // ====================================================
        // CREATE EYES
        // ====================================================

        createEyes(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CREATE IRIS + PUPILS
        // ====================================================

        createPupils(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CREATE EYEBROWS
        // ====================================================

        createEyebrows(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CREATE BLINK EYELIDS
        // ====================================================

        createBlinkEyelids(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CREATE NOSE
        // ====================================================

        createNose(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CREATE AFRO
        // ====================================================

        createAfro(

            centeredSize.x,

            centeredSize.y,

            centeredSize.z

        );


        // ====================================================
        // CAMERA
        // ====================================================

        const fov =
            camera.fov *
            (Math.PI / 180);


        let cameraDistance =
            modelSize /
            (
                2 *
                Math.tan(fov / 2)
            );


        cameraDistance *=
            1.55;


        camera.position.set(

            0,

            0,

            cameraDistance

        );


        camera.near =
            cameraDistance / 100;


        camera.far =
            cameraDistance * 100;


        camera.updateProjectionMatrix();


        camera.lookAt(
            0,
            0,
            0
        );


        console.log(

            "Head loaded!",

            "Model size:",

            modelSize

        );

    },


    undefined,


    function (error) {

        console.error(

            "Error loading head:",

            error

        );

    }

);


// ============================================================
// CREATE EYES
// ============================================================

function createEyes(
    headWidth,
    headHeight,
    headDepth
) {

    const eyeMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xd8d5cc,

            roughness: 0.75,

            metalness: 0

        });


    const eyeGeometry =
        new THREE.SphereGeometry(

            1,

            24,

            16

        );


    leftEye =
        new THREE.Mesh(

            eyeGeometry,

            eyeMaterial

        );


    rightEye =
        new THREE.Mesh(

            eyeGeometry,

            eyeMaterial

        );


    // ========================================================
    // EYE SIZE
    // ========================================================

    const eyeWidth =
        headWidth * 0.110;


    const eyeHeight =
        headHeight * 0.045;


    const eyeDepth =
        headDepth * 0.025;


    leftEye.scale.set(

        eyeWidth,

        eyeHeight,

        eyeDepth

    );


    rightEye.scale.set(

        eyeWidth,

        eyeHeight,

        eyeDepth

    );


    // ========================================================
    // EYE POSITION
    // ========================================================

    const eyeDistance =
        headWidth * 0.205;


    const eyeY =
        headHeight * 0.035;


    const eyeZ =
        headDepth * 0.455;


    leftEye.position.set(

        -eyeDistance,

        eyeY,

        eyeZ

    );


    rightEye.position.set(

        eyeDistance,

        eyeY,

        eyeZ

    );


    headGroup.add(
        leftEye
    );

    headGroup.add(
        rightEye
    );

}


// ============================================================
// CREATE PUPILS
// ============================================================

function createPupils(
    headWidth,
    headHeight,
    headDepth
) {

    const eyeDistance =
        headWidth * 0.205;


    const eyeY =
        headHeight * 0.035;


    const eyeZ =
        headDepth * 0.455;


    const eyeFrontZ =
        eyeZ +
        (
            headDepth *
            0.025
        );


    // ========================================================
    // IRIS
    // ========================================================

    const irisGeometry =
        new THREE.SphereGeometry(

            1,

            24,

            16

        );


    const irisMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x4a3221,

            roughness: 0.55,

            metalness: 0,

            flatShading: true

        });


    const irisWidth =
        headWidth * 0.082;


    const irisHeight =
        headHeight * 0.034;


    const irisDepth =
        headDepth * 0.012;


    // ========================================================
    // BLACK PUPIL
    // ========================================================

    const pupilGeometry =
        new THREE.SphereGeometry(

            1,

            24,

            16

        );


    const pupilMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x0a0a0a,

            roughness: 0.4,

            metalness: 0,

            flatShading: true

        });


    const pupilWidth =
        headWidth * 0.038;


    const pupilHeight =
        headHeight * 0.016;


    const pupilDepth =
        headDepth * 0.014;


    // ========================================================
    // EYE HIGHLIGHT
    // ========================================================

    const highlightGeometry =
        new THREE.SphereGeometry(

            1,

            12,

            8

        );


    const highlightMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xffffff,

            roughness: 0.3,

            metalness: 0,

            emissive: 0xffffff,

            emissiveIntensity: 0.4

        });


    const highlightSize =
        headWidth * 0.009;


    // ========================================================
    // BUILD PUPIL GROUP
    // ========================================================

    function buildPupilGroup(side) {

        const group =
            new THREE.Group();


        // IRIS

        const iris =
            new THREE.Mesh(

                irisGeometry,

                irisMaterial

            );


        iris.scale.set(

            irisWidth,

            irisHeight,

            irisDepth

        );


        group.add(
            iris
        );


        // PUPIL

        const pupil =
            new THREE.Mesh(

                pupilGeometry,

                pupilMaterial

            );


        pupil.scale.set(

            pupilWidth,

            pupilHeight,

            pupilDepth

        );


        pupil.position.z =
            headDepth * 0.006;


        group.add(
            pupil
        );


        // HIGHLIGHT

        const highlight =
            new THREE.Mesh(

                highlightGeometry,

                highlightMaterial

            );


        highlight.scale.set(

            highlightSize,

            highlightSize,

            highlightSize

        );


        highlight.position.set(

            side *
            -headWidth *
            0.012,

            headHeight *
            0.012,

            headDepth *
            0.010

        );


        group.add(
            highlight
        );


        return group;

    }


    // ========================================================
    // LEFT + RIGHT
    // ========================================================

    leftPupil =
        buildPupilGroup(-1);


    rightPupil =
        buildPupilGroup(1);


    const pupilYOffset =
        headHeight * 0.006;


    leftPupil.position.set(

        -eyeDistance,

        eyeY +
        pupilYOffset,

        eyeFrontZ

    );


    rightPupil.position.set(

        eyeDistance,

        eyeY +
        pupilYOffset,

        eyeFrontZ

    );


    headGroup.add(
        leftPupil
    );


    headGroup.add(
        rightPupil
    );

}


// ============================================================
// CREATE THICK RELAXED EYEBROWS
// ============================================================

function createEyebrows(
    headWidth,
    headHeight,
    headDepth
) {

    const eyeDistance =
        headWidth * 0.205;


    const eyeY =
        headHeight * 0.035;


    const eyeZ =
        headDepth * 0.455;


    const eyeWidth =
        headWidth * 0.110;


    const eyeHeight =
        headHeight * 0.045;


    const eyeDepth =
        headDepth * 0.025;


    const browMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x12100f,

            roughness: 1,

            metalness: 0,

            flatShading: true

        });


    const browGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    function buildBrow(
        xPosition
    ) {

        const brow =
            new THREE.Mesh(

                browGeometry,

                browMaterial

            );


        // ====================================================
        // YOUR CURRENT THICK EYEBROWS
        // ====================================================

        brow.scale.set(

            eyeWidth * 1.95,

            eyeHeight * 1.5,

            eyeDepth * 1.25

        );


        brow.position.set(

            xPosition,

            eyeY +
            (
                headHeight *
                0.078
            ),

            eyeZ +
            eyeDepth +
            (
                headDepth *
                0.008
            )

        );


        // STRAIGHT / RELAXED
        brow.rotation.z = 0;


        return brow;

    }


    const leftBrow =
        buildBrow(
            -eyeDistance
        );


    const rightBrow =
        buildBrow(
            eyeDistance
        );


    headGroup.add(
        leftBrow
    );


    headGroup.add(
        rightBrow
    );

}


// ============================================================
// CREATE BLINK EYELIDS
//
// These are NOT eye bags.
//
// They sit ABOVE the eyes while open and slide downward
// over the eyes during a blink.
// ============================================================

function createBlinkEyelids(
    headWidth,
    headHeight,
    headDepth
) {

    const eyeDistance =
        headWidth * 0.205;


    const eyeY =
        headHeight * 0.035;


    const eyeZ =
        headDepth * 0.455;


    const eyeWidth =
        headWidth * 0.110;


    const eyeHeight =
        headHeight * 0.045;


    // ========================================================
    // EYELID MATERIAL
    // ========================================================

    const eyelidMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xc98f6b,

            roughness: 0.8,

            metalness: 0,

            flatShading: true

        });


    // ========================================================
    // EYELID GEOMETRY
    //
    // Low-poly sphere so the eyelid follows the same visual
    // language as the rest of the face.
    // ========================================================

    const eyelidGeometry =
        new THREE.SphereGeometry(

            1,

            16,

            8

        );


    function buildEyelid(
        xPosition
    ) {

        const lid =
            new THREE.Mesh(

                eyelidGeometry,

                eyelidMaterial

            );


        // Wide enough to cover the whole eyeball
        lid.scale.set(

            eyeWidth * 1.08,

            eyeHeight * 0.62,

            headDepth * 0.018

        );


        // ====================================================
        // OPEN POSITION
        //
        // Eyelid starts just above the visible eye.
        // ====================================================

        lid.userData.openY =
            eyeY +
            eyeHeight *
            0.85;


        // ====================================================
        // CLOSED POSITION
        //
        // Moves down to approximately the center of the eye.
        // ====================================================

        lid.userData.closedY =
            eyeY;


        lid.position.set(

            xPosition,

            lid.userData.openY,

            eyeZ +
            headDepth *
            0.055

        );


        return lid;

    }


    leftBlinkLid =
        buildEyelid(
            -eyeDistance
        );


    rightBlinkLid =
        buildEyelid(
            eyeDistance
        );


    headGroup.add(
        leftBlinkLid
    );


    headGroup.add(
        rightBlinkLid
    );

}


// ============================================================
// UPDATE BLINK
// ============================================================

function updateBlink(
    currentTime
) {

    if (
        !leftBlinkLid ||
        !rightBlinkLid
    ) {

        return;

    }


    // ========================================================
    // WAITING
    // ========================================================

    if (
        blinkState ===
        "waiting"
    ) {

        if (
            currentTime >=
            nextBlinkTime
        ) {

            blinkState =
                "closing";


            blinkStartTime =
                currentTime;

        }

    }


    // ========================================================
    // CLOSING
    // ========================================================

    else if (
        blinkState ===
        "closing"
    ) {

        const duration =
            90;


        const progress =
            Math.min(

                (
                    currentTime -
                    blinkStartTime
                ) /
                duration,

                1

            );


        // Smooth movement
        blinkAmount =
            smoothStep(progress);


        if (
            progress >= 1
        ) {

            blinkState =
                "opening";


            blinkStartTime =
                currentTime;

        }

    }


    // ========================================================
    // OPENING
    // ========================================================

    else if (
        blinkState ===
        "opening"
    ) {

        const duration =
            120;


        const progress =
            Math.min(

                (
                    currentTime -
                    blinkStartTime
                ) /
                duration,

                1

            );


        blinkAmount =
            1 -
            smoothStep(progress);


        if (
            progress >= 1
        ) {

            blinkAmount =
                0;


            blinkState =
                "waiting";


            // =================================================
            // SMALL CHANCE OF DOUBLE BLINK
            // =================================================

            const doubleBlink =
                Math.random() <
                0.18;


            if (
                doubleBlink
            ) {

                nextBlinkTime =
                    currentTime +
                    180 +
                    Math.random() *
                    180;

            }

            else {

                nextBlinkTime =
                    currentTime +
                    randomBlinkDelay();

            }

        }

    }


    // ========================================================
    // APPLY EYELID POSITION
    // ========================================================

    const leftOpen =
        leftBlinkLid.userData.openY;


    const leftClosed =
        leftBlinkLid.userData.closedY;


    const rightOpen =
        rightBlinkLid.userData.openY;


    const rightClosed =
        rightBlinkLid.userData.closedY;


    leftBlinkLid.position.y =

        THREE.MathUtils.lerp(

            leftOpen,

            leftClosed,

            blinkAmount

        );


    rightBlinkLid.position.y =

        THREE.MathUtils.lerp(

            rightOpen,

            rightClosed,

            blinkAmount

        );

}


// ============================================================
// SMOOTH STEP
// ============================================================

function smoothStep(t) {

    return (
        t *
        t *
        (
            3 -
            2 * t
        )
    );

}


// ============================================================
// CREATE WIDE LOW-POLY NOSE
// ============================================================

function createNose(
    headWidth,
    headHeight,
    headDepth
) {

    const noseGroup =
        new THREE.Group();


    // ========================================================
    // NOSE MATERIAL
    // ========================================================

    const noseMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xc98f6b,

            roughness: 0.8,

            metalness: 0,

            flatShading: true

        });


    // ========================================================
    // WIDE NOSE BRIDGE
    // ========================================================

    const bridgeGeometry =
        new THREE.CylinderGeometry(

            0.72,

            1.05,

            1,

            6

        );


    const bridge =
        new THREE.Mesh(

            bridgeGeometry,

            noseMaterial

        );


    // ========================================================
    // YOUR CURRENT BRIDGE SETTINGS
    // ========================================================

    bridge.scale.set(

        headWidth * 0.085,

        headHeight * 0.20,

        headDepth * 0.13

    );


    bridge.position.set(

        0,

        -headHeight * 0.040,

        headDepth * 0.515

    );


    bridge.rotation.x =
        -0.04;


    noseGroup.add(
        bridge
    );


    // ========================================================
    // NOSE TIP
    // ========================================================

    const tipGeometry =
        new THREE.IcosahedronGeometry(

            1,

            1

        );


    const tip =
        new THREE.Mesh(

            tipGeometry,

            noseMaterial

        );


    // YOUR CURRENT TIP SETTINGS

    tip.scale.set(

        headWidth * 0.105,

        headHeight * 0.020,

        headDepth * 0.05

    );


    tip.position.set(

        0,

        -headHeight * 0.108,

        headDepth * 0.555

    );


    noseGroup.add(
        tip
    );


    // ========================================================
    // NOSE WINGS
    // ========================================================

    const wingGeometry =
        new THREE.IcosahedronGeometry(

            1,

            1

        );


    // LEFT

    const leftWing =
        new THREE.Mesh(

            wingGeometry,

            noseMaterial

        );


    leftWing.scale.set(

        headWidth * 0.060,

        headHeight * 0.028,

        headDepth * 0.050

    );


    leftWing.position.set(

        -headWidth * 0.078,

        -headHeight * 0.115,

        headDepth * 0.535

    );


    noseGroup.add(
        leftWing
    );


    // RIGHT

    const rightWing =
        new THREE.Mesh(

            wingGeometry,

            noseMaterial

        );


    rightWing.scale.set(

        headWidth * 0.060,

        headHeight * 0.028,

        headDepth * 0.050

    );


    rightWing.position.set(

        headWidth * 0.078,

        -headHeight * 0.115,

        headDepth * 0.535

    );


    noseGroup.add(
        rightWing
    );


    // ========================================================
    // NOSTRILS
    // ========================================================

    const nostrilMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x5a382b,

            roughness: 1,

            metalness: 0,

            flatShading: true

        });


    const nostrilGeometry =
        new THREE.SphereGeometry(

            1,

            12,

            8

        );


    // LEFT

    const leftNostril =
        new THREE.Mesh(

            nostrilGeometry,

            nostrilMaterial

        );


    leftNostril.scale.set(

        headWidth * 0.016,

        headHeight * 0.006,

        headDepth * 0.007

    );


    leftNostril.position.set(

        -headWidth * 0.067,

        -headHeight * 0.126,

        headDepth * 0.595

    );


    noseGroup.add(
        leftNostril
    );


    // RIGHT

    const rightNostril =
        new THREE.Mesh(

            nostrilGeometry,

            nostrilMaterial

        );


    rightNostril.scale.set(

        headWidth * 0.016,

        headHeight * 0.006,

        headDepth * 0.007

    );


    rightNostril.position.set(

        headWidth * 0.067,

        -headHeight * 0.126,

        headDepth * 0.595

    );


    noseGroup.add(
        rightNostril
    );


    // ========================================================
    // ADD NOSE
    // ========================================================

    headGroup.add(
        noseGroup
    );

}


// ============================================================
// CREATE LOW-POLY AFRO
// ============================================================

function createAfro(
    headWidth,
    headHeight,
    headDepth
) {

    const afroGroup =
        new THREE.Group();


    // ========================================================
    // HAIR MATERIAL
    // ========================================================

    const hairMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x12100f,

            roughness: 1,

            metalness: 0,

            flatShading: true

        });


    // ========================================================
    // PUFF GEOMETRY
    // ========================================================

    const afroGeometry =
        new THREE.IcosahedronGeometry(

            1,

            1

        );


    // ========================================================
    // PUFF HELPER
    // ========================================================

    function addPuff(
        x,
        y,
        z,
        scaleX,
        scaleY,
        scaleZ
    ) {

        const puff =
            new THREE.Mesh(

                afroGeometry,

                hairMaterial

            );


        puff.position.set(
            x,
            y,
            z
        );


        puff.scale.set(
            scaleX,
            scaleY,
            scaleZ
        );


        afroGroup.add(
            puff
        );

    }


    // ========================================================
    // AFRO SIZE
    // ========================================================

    const puffSize =
        headWidth * 0.165;


    const sidePuffSize =
        headWidth * 0.155;


    const hairlinePuffSize =
        headWidth * 0.105;


    // ========================================================
    // AFRO HEIGHT
    // ========================================================

    const topY =
        headHeight * 0.46;


    const upperY =
        headHeight * 0.37;


    const middleY =
        headHeight * 0.31;


    const hairlineY =
        headHeight * 0.105;


    // ========================================================
    // AFRO DEPTH
    // ========================================================

    const frontZ =
        headDepth * 0.20;


    const middleZ =
        headDepth * 0.24;


    const backZ =
        -headDepth * 0.18;


    // ========================================================
    // TOP ROW
    // ========================================================

    addPuff(
        -headWidth * 0.30,
        topY,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        -headWidth * 0.15,
        topY + headHeight * 0.035,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        0,
        topY + headHeight * 0.045,
        middleZ,
        puffSize * 1.05,
        puffSize * 1.05,
        puffSize
    );


    addPuff(
        headWidth * 0.15,
        topY + headHeight * 0.035,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        headWidth * 0.30,
        topY,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    // ========================================================
    // SECOND ROW
    // ========================================================

    addPuff(
        -headWidth * 0.36,
        upperY,
        middleZ,
        sidePuffSize,
        sidePuffSize,
        sidePuffSize
    );


    addPuff(
        -headWidth * 0.20,
        upperY + headHeight * 0.015,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        0,
        upperY + headHeight * 0.025,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        headWidth * 0.20,
        upperY + headHeight * 0.015,
        middleZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        headWidth * 0.36,
        upperY,
        middleZ,
        sidePuffSize,
        sidePuffSize,
        sidePuffSize
    );


    // ========================================================
    // MIDDLE FRONT ROW
    // ========================================================

    addPuff(
        -headWidth * 0.32,
        middleY,
        frontZ * 0.72,
        sidePuffSize,
        sidePuffSize * 0.88,
        sidePuffSize
    );


    addPuff(
        -headWidth * 0.16,
        middleY,
        frontZ * 0.78,
        sidePuffSize,
        sidePuffSize * 0.85,
        sidePuffSize
    );


    addPuff(
        0,
        middleY,
        frontZ * 0.82,
        sidePuffSize,
        sidePuffSize * 0.82,
        sidePuffSize
    );


    addPuff(
        headWidth * 0.16,
        middleY,
        frontZ * 0.78,
        sidePuffSize,
        sidePuffSize * 0.85,
        sidePuffSize
    );


    addPuff(
        headWidth * 0.32,
        middleY,
        frontZ * 0.72,
        sidePuffSize,
        sidePuffSize * 0.88,
        sidePuffSize
    );


    // ========================================================
    // FRONT HAIRLINE
    // ========================================================

    addPuff(
        -headWidth * 0.34,
        hairlineY + headHeight * 0.015,
        frontZ,
        hairlinePuffSize,
        hairlinePuffSize * 0.65,
        hairlinePuffSize * 0.72
    );


    addPuff(
        -headWidth * 0.17,
        hairlineY,
        frontZ,
        hairlinePuffSize,
        hairlinePuffSize * 0.62,
        hairlinePuffSize * 0.72
    );


    addPuff(
        0,
        hairlineY - headHeight * 0.008,
        frontZ,
        hairlinePuffSize * 1.05,
        hairlinePuffSize * 0.60,
        hairlinePuffSize * 0.72
    );


    addPuff(
        headWidth * 0.17,
        hairlineY,
        frontZ,
        hairlinePuffSize,
        hairlinePuffSize * 0.62,
        hairlinePuffSize * 0.72
    );


    addPuff(
        headWidth * 0.34,
        hairlineY + headHeight * 0.015,
        frontZ,
        hairlinePuffSize,
        hairlinePuffSize * 0.65,
        hairlinePuffSize * 0.72
    );


    // ========================================================
    // FRONT TEMPLES
    // ========================================================

    addPuff(
        -headWidth * 0.41,
        hairlineY + headHeight * 0.045,
        frontZ * 0.90,
        hairlinePuffSize * 0.90,
        hairlinePuffSize * 0.90,
        hairlinePuffSize
    );


    addPuff(
        headWidth * 0.41,
        hairlineY + headHeight * 0.045,
        frontZ * 0.90,
        hairlinePuffSize * 0.90,
        hairlinePuffSize * 0.90,
        hairlinePuffSize
    );


    // ========================================================
    // LEFT SIDE
    // ========================================================

    addPuff(
        -headWidth * 0.43,
        upperY,
        -headDepth * 0.04,
        sidePuffSize,
        sidePuffSize * 1.05,
        sidePuffSize
    );


    addPuff(
        -headWidth * 0.43,
        middleY,
        -headDepth * 0.01,
        sidePuffSize * 0.95,
        sidePuffSize,
        sidePuffSize
    );


    // ========================================================
    // RIGHT SIDE
    // ========================================================

    addPuff(
        headWidth * 0.43,
        upperY,
        -headDepth * 0.04,
        sidePuffSize,
        sidePuffSize * 1.05,
        sidePuffSize
    );


    addPuff(
        headWidth * 0.43,
        middleY,
        -headDepth * 0.01,
        sidePuffSize * 0.95,
        sidePuffSize,
        sidePuffSize
    );


    // ========================================================
    // BACK ROW
    // ========================================================

    addPuff(
        -headWidth * 0.30,
        upperY,
        backZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        -headWidth * 0.15,
        upperY + headHeight * 0.025,
        backZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        0,
        upperY + headHeight * 0.035,
        -headDepth * 0.22,
        puffSize * 1.05,
        puffSize,
        puffSize
    );


    addPuff(
        headWidth * 0.15,
        upperY + headHeight * 0.025,
        backZ,
        puffSize,
        puffSize,
        puffSize
    );


    addPuff(
        headWidth * 0.30,
        upperY,
        backZ,
        puffSize,
        puffSize,
        puffSize
    );


    // ========================================================
    // BACK / SIDE FILL
    // ========================================================

    addPuff(
        -headWidth * 0.37,
        middleY,
        -headDepth * 0.15,
        sidePuffSize,
        sidePuffSize,
        sidePuffSize
    );


    addPuff(
        headWidth * 0.37,
        middleY,
        -headDepth * 0.15,
        sidePuffSize,
        sidePuffSize,
        sidePuffSize
    );


    // ========================================================
    // POSITION ENTIRE AFRO
    // ========================================================

    afroGroup.position.y =
        -headHeight * 0.008;


    afroGroup.position.z =
        headDepth * 0.012;


    // ========================================================
    // ATTACH AFRO
    // ========================================================

    headGroup.add(
        afroGroup
    );

}


// ============================================================
// MOUSE TRACKING
// ============================================================

let mouseX = 0;
let mouseY = 0;


window.addEventListener(

    "mousemove",

    function (event) {

        mouseX =

            (
                event.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        mouseY =

            (
                event.clientY /
                window.innerHeight
            ) *
            2 -
            1;

    }

);


// ============================================================
// ANIMATION
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    const currentTime =
        performance.now();


    // ========================================================
    // UPDATE BLINK
    // ========================================================

    updateBlink(
        currentTime
    );


    if (
        headGroup &&
        head
    ) {

        const time =
            currentTime *
            0.001;


        // ====================================================
        // HEAD ROTATION
        // ====================================================

        const targetRotationY =
            mouseX * 0.38;


        const targetRotationX =
            mouseY * 0.13;


        headGroup.rotation.y +=

            (
                targetRotationY -
                headGroup.rotation.y
            ) *
            0.045;


        headGroup.rotation.x +=

            (
                targetRotationX -
                headGroup.rotation.x
            ) *
            0.045;


        // ====================================================
        // FLOATING
        // ====================================================

        const size =
            headGroup.userData.headSize ||
            1;


        headGroup.position.y =

            Math.sin(
                time * 1.25
            ) *

            size *

            0.025;


        headGroup.position.x =

            Math.sin(
                time * 0.65
            ) *

            size *

            0.006;

    }


    renderer.render(
        scene,
        camera
    );

}


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(

    "resize",

    function () {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        camera.aspect =
            width /
            height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }

);


/* ============================================================
   START ANIMATION
============================================================ */

animate();


/* ============================================================
   WINDOW RESIZE
============================================================ */

window.addEventListener("resize", function () {

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

});


/* ============================================================
   PROJECT CAROUSEL
============================================================ */

const projectSlides =
    document.querySelectorAll(".project-slide");

const projectDots =
    document.querySelectorAll(".project-dot");

const previousProjectButton =
    document.getElementById("project-prev");

const nextProjectButton =
    document.getElementById("project-next");

const currentProjectNumber =
    document.getElementById("current-project");

let currentProjectIndex = 0;

let projectCarouselAnimating = false;


/* ============================================================
   VIDEO CONTROL
============================================================ */

function stopAllProjectVideos() {

    projectSlides.forEach((slide) => {

        const video =
            slide.querySelector(".video-main");

        if (video) {

            video.pause();

        }

    });

}


function playActiveProjectVideo() {

    /*
        Stop every project video first.
    */

    stopAllProjectVideos();


    /*
        Find the currently active project.
    */

    const activeSlide =
        projectSlides[currentProjectIndex];

    if (!activeSlide) {
        return;
    }


    /*
        IMPORTANT:

        .video-main has a dot because video-main
        is a CLASS in the HTML.
    */

    const activeVideo =
        activeSlide.querySelector(".video-main");


    if (!activeVideo) {
        return;
    }


    /*
        Restart the active project's video.
    */

    activeVideo.currentTime = 0;


    /*
        Attempt playback.

        Because the videos are muted in the HTML,
        browsers should normally allow autoplay.
    */

    const playPromise =
        activeVideo.play();


    if (playPromise !== undefined) {

        playPromise.catch((error) => {

            console.log(
                "Project video could not autoplay:",
                error
            );

        });

    }

}


/* ============================================================
   UPDATE PROJECT COUNTER
============================================================ */

function updateProjectCounter() {

    if (!currentProjectNumber) {
        return;
    }

    currentProjectNumber.textContent =
        String(
            currentProjectIndex + 1
        ).padStart(2, "0");

}


/* ============================================================
   UPDATE PROJECT DOTS
============================================================ */

function updateProjectDots() {

    projectDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentProjectIndex
            );

        }
    );

}


/* ============================================================
   CHANGE PROJECT
============================================================ */

function changeProject(
    newIndex,
    direction
) {

    /*
        Prevent double-clicking while
        the carousel is moving.
    */

    if (projectCarouselAnimating) {
        return;
    }


    /*
        Don't reload the same project.
    */

    if (newIndex === currentProjectIndex) {
        return;
    }


    projectCarouselAnimating = true;


    const oldSlide =
        projectSlides[currentProjectIndex];

    const newSlide =
        projectSlides[newIndex];


    if (!oldSlide || !newSlide) {

        projectCarouselAnimating = false;

        return;

    }


    /*
        Stop the old project's video.
    */

    const oldVideo =
        oldSlide.querySelector(".video-main");

    if (oldVideo) {

        oldVideo.pause();

    }


    /*
        Remove leftover animation classes.
    */

    projectSlides.forEach((slide) => {

        slide.classList.remove(
            "exit-left",
            "exit-right",
            "enter-left",
            "enter-right"
        );

    });


    /*
        Determine carousel direction.
    */

    const oldExitClass =
        direction === "next"
            ? "exit-left"
            : "exit-right";

    const newEnterClass =
        direction === "next"
            ? "enter-right"
            : "enter-left";


    /*
        Position the incoming project.
    */

    newSlide.classList.add(
        newEnterClass
    );


    /*
        Force browser layout calculation.

        This allows the entrance animation
        to start from the correct position.
    */

    void newSlide.offsetWidth;


    /*
        Animate the old project away.
    */

    oldSlide.classList.add(
        oldExitClass
    );

    oldSlide.classList.remove(
        "active"
    );


    /*
        Bring the new project into view.
    */

    newSlide.classList.remove(
        newEnterClass
    );

    newSlide.classList.add(
        "active"
    );


    /*
        Update current project index.
    */

    currentProjectIndex =
        newIndex;


    updateProjectCounter();

    updateProjectDots();


    /*
        Play the NEW project's video.

        Small delay gives the browser time
        to activate the new slide first.
    */

    setTimeout(() => {

        playActiveProjectVideo();

    }, 100);


    /*
        Clean up animation classes
        after the CSS transition finishes.
    */

    setTimeout(() => {

        oldSlide.classList.remove(
            oldExitClass
        );

        projectCarouselAnimating = false;

    }, 750);

}


/* ============================================================
   NEXT PROJECT
============================================================ */

function showNextProject() {

    const nextIndex =
        (
            currentProjectIndex + 1
        ) % projectSlides.length;

    changeProject(
        nextIndex,
        "next"
    );

}


/* ============================================================
   PREVIOUS PROJECT
============================================================ */

function showPreviousProject() {

    const previousIndex =
        (
            currentProjectIndex -
            1 +
            projectSlides.length
        ) % projectSlides.length;

    changeProject(
        previousIndex,
        "previous"
    );

}


/* ============================================================
   ARROW BUTTON EVENTS
============================================================ */

if (nextProjectButton) {

    nextProjectButton.addEventListener(
        "click",
        showNextProject
    );

}


if (previousProjectButton) {

    previousProjectButton.addEventListener(
        "click",
        showPreviousProject
    );

}


/* ============================================================
   PROJECT DOT EVENTS
============================================================ */

projectDots.forEach(
    (dot, index) => {

        dot.addEventListener(
            "click",
            function () {

                if (
                    index ===
                    currentProjectIndex
                ) {
                    return;
                }


                const direction =
                    index >
                    currentProjectIndex
                        ? "next"
                        : "previous";


                changeProject(
                    index,
                    direction
                );

            }
        );

    }
);


/* ============================================================
   KEYBOARD CONTROLS
============================================================ */

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "ArrowRight"
        ) {

            showNextProject();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            showPreviousProject();

        }

    }
);


/* ============================================================
   PLAY VIDEO WHEN PROJECT SECTION IS VISIBLE
============================================================ */

const projectsSection =
    document.getElementById("projects");


if (projectsSection) {

    const projectObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            /*
                                User reached projects.
                                Play current video.
                            */

                            playActiveProjectVideo();

                        } else {

                            /*
                                User left projects.
                                Stop videos so they aren't
                                running in the background.
                            */

                            stopAllProjectVideos();

                        }

                    }
                );

            },

            {
                threshold: 0.25
            }

        );


    projectObserver.observe(
        projectsSection
    );

}


/* ============================================================
   INITIAL PROJECT STATE
============================================================ */

updateProjectCounter();

updateProjectDots();

// ============================================================
// ABOUT - REPLAYING SCROLL TEXT REVEAL
// ============================================================

const aboutSection = document.querySelector(".about-section");

if (aboutSection) {

    const aboutObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    // Play animation
                    aboutSection.classList.add("about-visible");

                } else {

                    // Reset animation when leaving About
                    aboutSection.classList.remove("about-visible");

                }

            });

        },
        {
            threshold: 0.3
        }
    );

    aboutObserver.observe(aboutSection);
}

// ============================================================
// EXPERIENCE - TIMELINE SCROLL PROGRESS
// ============================================================

const experienceSection = document.querySelector(".experience-section");
const timelineProgress = document.querySelector(".timeline-progress");

function updateExperienceTimeline() {

    if (!experienceSection || !timelineProgress) return;

    const rect = experienceSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start filling when Experience enters the viewport
    const start = windowHeight * 0.75;

    // Distance traveled through the Experience section
    const traveled = start - rect.top;

    // Amount of section available to travel
    const total = rect.height - windowHeight * 0.25;

    let progress = traveled / total;

    // Keep between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    timelineProgress.style.height = `${progress * 100}%`;

    // Activate timeline markers as the progress line reaches them
const experienceItems =
    document.querySelectorAll(".experience-item");

experienceItems.forEach((item) => {

    const marker = item.querySelector(".experience-marker");

    if (!marker) return;

    const markerRect = marker.getBoundingClientRect();

    if (markerRect.top <= windowHeight * 0.65) {
        item.classList.add("timeline-active");
    } else {
        item.classList.remove("timeline-active");
    }

});

}

window.addEventListener("scroll", updateExperienceTimeline);

window.addEventListener("resize", updateExperienceTimeline);

updateExperienceTimeline();