/**
 * Generated by Verge3D Puzzles v.3.3.1
 * Thu Aug 20 2020 00:12:59 GMT+0800 (heure normale des Philippines)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.promiseValue = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.gamepadIndex = 0;

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.intervals = {};

_pGlob.wooProductInfo = {};

var _pPhysics = {};

_pPhysics.tickCallbacks = [];
_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};

PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    
// loadFont puzzle
function loadFont(url, family) {

    if (!url || !family)
        return;

    // register in CSS
    var elemStyle = document.createElement('style');
    elemStyle.innerHTML = '@font-face { font-family: ' + family
        + '; src: url(' + url + '); }';
    document.body.appendChild(elemStyle);

    // preload font
    var elemDiv = document.createElement('div');
    elemDiv.innerHTML = 'invisible text';
    elemDiv.style.visibility = 'hidden';
    elemDiv.style.fontFamily = family;
    document.body.appendChild(elemDiv);
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// setHTMLElemAttribute puzzle
function setHTMLElemAttribute(attr, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem[attr] = value;
    }
}




// initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = true;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = false;
_initGlob.output.initOptions.useFullscreen = true;

loadFont('./fonts/Bellefair-Regular.ttf', 'bellefair');

setHTMLElemStyle('backgroundColor', '#212121', ['BODY'], true);


// initPreloader puzzle
_initGlob.output.initOptions.useCustomPreloader = true;
_initGlob.output.initOptions.preloaderStartCb = function() {
    _initGlob.percentage = 0;
    (function() {
  setHTMLElemStyle('display', 'block', 'preloader_container', true);
})();
};
_initGlob.output.initOptions.preloaderProgressCb = function(percentage) {
    _initGlob.percentage = percentage;
    (function() {
  setHTMLElemStyle('height', String(Math.round(Math.round(_initGlob.percentage) / 4)) + '%', 'preloader_color', true);
  setHTMLElemAttribute('innerHTML', String(Math.round(Math.round(_initGlob.percentage) / 4)) + '%', 'preloader_percentage', true);
})();
};
_initGlob.output.initOptions.preloaderEndCb = function() {
    _initGlob.percentage = 100;
    (function() {
  setHTMLElemStyle('display', 'none', 'preloader_screen', true);
})();
};

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {
initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["do_inclinaison"] = do_inclinaison;

var frame;



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// show and hide puzzles
function changeVis(objNames, bool) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
    }
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
initObjectPicking(function(obj) {

    // save the object for the pickedObject block
    _pGlob.pickedObject = obj ? getPickedObjectName(obj) : '';

    _pGlob.objClickCallbacks.forEach(function(el) {
        var isPicked = obj && objectsIncludeObj(el.objNames, getPickedObjectName(obj));
        el.callbacks[isPicked ? 0 : 1]();
    });
}, 'mousedown');



// whenClicked puzzle
function registerOnClick(objNames, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });
    _pGlob.objClickCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback, false);
    }
}



function matGetColors(matName) {
    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat)
        return [];

    if (mat.isMeshNodeMaterial)
        return Object.keys(mat.nodeRGBMap);
    else if (mat.isMeshStandardMaterial)
        return ['color', 'emissive'];
    else
        return [];
}



// setMaterialColor puzzle
function setMaterialColor(matName, colName, r, g, b, cssCode) {

    var colors = matGetColors(matName);

    if (colors.indexOf(colName) < 0)
        return;

    if (cssCode) {
        var color = new v3d.Color(cssCode);
        color.convertSRGBToLinear();
        r = color.r;
        g = color.g;
        b = color.b;
    }

    var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
            var rgbIdx = mat.nodeRGBMap[colName];
            mat.nodeRGB[rgbIdx].x = r;
            mat.nodeRGB[rgbIdx].y = g;
            mat.nodeRGB[rgbIdx].z = b;
        } else {
            mat[colName].r = r;
            mat[colName].g = g;
            mat[colName].b = b;
        }
        mat.needsUpdate = true;

        if (mat === appInstance.worldMaterial)
            appInstance.updateEnvironment(mat);
    }
}



// getAnimations puzzle
function getAnimations(objNames) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    var animations = [];
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        // use objName as animName - for now we have one-to-one match
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, objName);
        if (action)
            animations.push(objName);
    }
    return animations;
}



/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}



/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && "v3d" in scene.userData && "animFrameRate" in scene.userData.v3d) {
        return scene.userData.v3d.animFrameRate;
    }
    return 24;
}



var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished))
            appInstance.mixer.addEventListener('finished', onMixerFinished);
    };

}();



// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, isPlayAnimCompat, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                // compatibility reasons: deprecated playAnimation puzzles don't
                // change repetitions
                if (!isPlayAnimCompat) {
                    action.repetitions = Infinity;
                }

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}


// Describe this function...
function do_inclinaison(frame) {

  operateAnimation('SET_FRAME', getAnimations('T70x10L200'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);


  operateAnimation('SET_FRAME', getAnimations('T70x10L201.001'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);


  operateAnimation('SET_FRAME', getAnimations('463.002'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);


  operateAnimation('SET_FRAME', getAnimations('Spot.1'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);


  operateAnimation('SET_FRAME', getAnimations('Spot.2'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);


  operateAnimation('SET_FRAME', getAnimations('Spot.3'), frame, null, 'AUTO', 1,
          function() {}, undefined, false);

      }


registerOnClick(['GROUP', 'route'], function() {
  changeVis(['GROUP', 'route'], false);
}, function() {});
registerOnClick(['GROUP', 'poteau'], function() {
  changeVis(['GROUP', 'route'], true);
}, function() {});

eventHTMLElem('click', 'button_nb_lamp_1', true, function(event) {
  changeVis(['GROUP', 'lamp2'], false);
  changeVis(['GROUP', 'lamp3'], false);
});
eventHTMLElem('click', 'button_nb_lamp_2', true, function(event) {
  changeVis(['GROUP', 'lamp2'], true);
  changeVis(['GROUP', 'lamp3'], false);
});
eventHTMLElem('click', 'button_nb_lamp_3', true, function(event) {
  changeVis(['GROUP', 'lamp2'], true);
  changeVis(['GROUP', 'lamp3'], true);
});
eventHTMLElem('click', 'button_curve_0', true, function(event) {
  do_inclinaison(30);
});
eventHTMLElem('click', 'button_curve_1', true, function(event) {
  do_inclinaison(15);
});
eventHTMLElem('click', 'button_curve_2', true, function(event) {
  do_inclinaison(0);
});

eventHTMLElem('click', 'button_material_1', true, function(event) {
  setMaterialColor('peinture brillan', 'Principled BSDF Color', 0.141, 0.141, 0.141, '');
  setMaterialColor('peinture brillan.001', 'Principled BSDF Color', 0.141, 0.141, 0.141, '');
  setMaterialColor('peinture brillan.002', 'Principled BSDF Color', 0.141, 0.141, 0.141, '');
});
eventHTMLElem('click', 'button_material_2', true, function(event) {
  setMaterialColor('peinture brillan', 'Principled BSDF Color', 0.38, 0.27, 0.06, '');
  setMaterialColor('peinture brillan.001', 'Principled BSDF Color', 0.38, 0.27, 0.06, '');
  setMaterialColor('peinture brillan.002', 'Principled BSDF Color', 0.38, 0.27, 0.06, '');
});
eventHTMLElem('click', 'button_material_3', true, function(event) {
  setMaterialColor('peinture brillan', 'Principled BSDF Color', 0.15, 0.26, 0.17, '');
  setMaterialColor('peinture brillan.001', 'Principled BSDF Color', 0.15, 0.26, 0.17, '');
  setMaterialColor('peinture brillan.002', 'Principled BSDF Color', 0.15, 0.26, 0.17, '');
});

eventHTMLElem('click', 'button_jour', true, function(event) {
  changeVis(['GROUP', 'spots'], false);
  changeVis(['GROUP', 'sun'], true);
});
eventHTMLElem('click', 'button_nuit', true, function(event) {
  changeVis(['GROUP', 'sun'], false);
  changeVis(['GROUP', 'spots'], true);
});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
