// mapbox-interop.js - Version complète avec support de tous les plugins Mapbox

// État global
let mapboxLoaded = false;
let mapboxLoadPromise = null;
const loadedPlugins = new Map();
const markers = new Map();
const popups = new Map();
const sources = new Map();
const layers = new Map();

// Chargement dynamique de Mapbox GL JS
async function loadMapboxGL() {
    if (mapboxLoaded) return;
    if (mapboxLoadPromise) return mapboxLoadPromise;

    mapboxLoadPromise = new Promise((resolve, reject) => {
        // CSS principal
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // JS principal
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
        script.onload = () => {
            mapboxLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('Erreur de chargement Mapbox GL JS'));
        document.head.appendChild(script);
    });

    return mapboxLoadPromise;
}

// Chargement des plugins
async function loadPlugin(pluginName, cssUrl, jsUrl) {
    if (loadedPlugins.has(pluginName)) return;

    return new Promise((resolve, reject) => {
        // CSS du plugin si fourni
        if (cssUrl) {
            const link = document.createElement('link');
            link.href = cssUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        // JS du plugin
        const script = document.createElement('script');
        script.src = jsUrl;
        script.onload = () => {
            loadedPlugins.set(pluginName, true);
            resolve();
        };
        script.onerror = () => reject(new Error(`Erreur chargement plugin ${pluginName}`));
        document.head.appendChild(script);
    });
}

// Initialisation de la carte
export async function initializeMap(options) {
    await loadMapboxGL();

    mapboxgl.accessToken = options.accessToken;

    const map = new mapboxgl.Map({
        container: options.container,
        style: options.style,
        center: options.center,
        zoom: options.zoom,
        minZoom: options.minZoom,
        maxZoom: options.maxZoom,
        bearing: options.bearing,
        pitch: options.pitch,
        interactive: options.interactive,
        attributionControl: options.attributionControl,
        scrollZoom: options.scrollZoom,
        boxZoom: options.boxZoom,
        dragRotate: options.dragRotate,
        dragPan: options.dragPan,
        keyboard: options.keyboard,
        doubleClickZoom: options.doubleClickZoom,
        touchZoomRotate: options.touchZoomRotate,
        preserveDrawingBuffer: true, // Pour les captures d'écran
        antialias: true,
        refreshExpiredTiles: true,
        maxBounds: options.maxBounds,
        renderWorldCopies: options.renderWorldCopies !== false
    });

    // Stockage de la référence de la carte
    map._blazorId = options.container;

    return map;
}

// Configuration des événements
export function setupMapEvents(map, dotNetHelper) {
    // Stocker la référence pour les callbacks du plugin Draw
    window.blazorDrawCallbacks = {
        onCreate: (features) => {
            dotNetHelper.invokeMethodAsync('OnDrawCreateCallback', JSON.stringify(features));
        },
        onUpdate: (features) => {
            dotNetHelper.invokeMethodAsync('OnDrawUpdateCallback', JSON.stringify(features));
        },
        onDelete: (features) => {
            dotNetHelper.invokeMethodAsync('OnDrawDeleteCallback', JSON.stringify(features));
        }
    };

    // Événements de clic
    map.on('click', (e) => {
        dotNetHelper.invokeMethodAsync('OnMapClickCallback', e.lngLat.lng, e.lngLat.lat);
    });

    map.on('dblclick', (e) => {
        dotNetHelper.invokeMethodAsync('OnMapDoubleClickCallback', e.lngLat.lng, e.lngLat.lat);
    });

    // Événements de mouvement
    map.on('move', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bearing = map.getBearing();
        const pitch = map.getPitch();
        dotNetHelper.invokeMethodAsync('OnMapMoveCallback', center.lng, center.lat, zoom, bearing, pitch);
    });

    // Événements de zoom
    map.on('zoom', () => {
        dotNetHelper.invokeMethodAsync('OnMapZoomCallback', map.getZoom());
    });

    // Événements de chargement
    map.on('load', () => {
        dotNetHelper.invokeMethodAsync('OnMapLoadCallback');
    });

    map.on('style.load', () => {
        dotNetHelper.invokeMethodAsync('OnStyleLoadCallback');
    });

    // Événements d'erreur
    map.on('error', (e) => {
        dotNetHelper.invokeMethodAsync('OnMapErrorCallback', e.error?.message || 'Erreur inconnue');
    });

    // Événements de souris
    map.on('mouseenter', () => {
        dotNetHelper.invokeMethodAsync('OnMouseEnterCallback');
    });

    map.on('mouseleave', () => {
        dotNetHelper.invokeMethodAsync('OnMouseLeaveCallback');
    });

    map.on('mousemove', (e) => {
        dotNetHelper.invokeMethodAsync('OnMouseMoveCallback', e.lngLat.lng, e.lngLat.lat);
    });

    // Événements tactiles
    map.on('touchstart', () => {
        dotNetHelper.invokeMethodAsync('OnTouchStartCallback');
    });

    map.on('touchend', () => {
        dotNetHelper.invokeMethodAsync('OnTouchEndCallback');
    });

    // Événements de rotation
    map.on('rotate', () => {
        dotNetHelper.invokeMethodAsync('OnRotateCallback', map.getBearing());
    });

    map.on('pitch', () => {
        dotNetHelper.invokeMethodAsync('OnPitchCallback', map.getPitch());
    });
}

// === CONTRÔLES ===

export function addNavigationControl(map, position = 'top-right') {
    map.addControl(new mapboxgl.NavigationControl(), position);
}

export function addGeolocateControl(map, position = 'top-right') {
    const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    map.addControl(geolocateControl, position);
    return geolocateControl;
}

export function addFullscreenControl(map, position = 'top-right') {
    map.addControl(new mapboxgl.FullscreenControl(), position);
}

export function addScaleControl(map, position = 'bottom-left', options = {}) {
    const scaleControl = new mapboxgl.ScaleControl({
        maxWidth: options.maxWidth || 100,
        unit: options.unit || 'metric'
    });
    map.addControl(scaleControl, position);
}

export function addAttributionControl(map, options = {}) {
    const control = new mapboxgl.AttributionControl({
        compact: options.compact || false,
        customAttribution: options.customAttribution
    });
    map.addControl(control);
}

// === PLUGINS ===

// Plugin Geocoder (recherche d'adresses)
export async function loadGeocoderPlugin(map, accessToken, options = {}) {
    await loadPlugin('geocoder',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js'
    );

    const geocoder = new MapboxGeocoder({
        accessToken: accessToken,
        mapboxgl: mapboxgl,
        marker: options.marker !== false,
        placeholder: options.placeholder || 'Rechercher...',
        proximity: options.proximity,
        trackProximity: options.trackProximity !== false,
        collapsed: options.collapsed || false,
        clearAndBlurOnEsc: options.clearAndBlurOnEsc !== false,
        clearOnBlur: options.clearOnBlur !== false,
        enableEventLogging: false,
        types: options.types,
        countries: options.countries,
        language: options.language || 'fr',
        limit: options.limit || 5
    });

    map.addControl(geocoder, options.position || 'top-left');
    return geocoder;
}

// Plugin Draw (outils de dessin)
export async function loadDrawPlugin(map, options = {}) {
    await loadPlugin('draw',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.css',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.js'
    );

    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: options.polygon !== false,
            line_string: options.line !== false,
            point: options.point !== false,
            trash: options.trash !== false,
            combine_features: options.combine !== false,
            uncombine_features: options.uncombine !== false
        },
        defaultMode: options.defaultMode || 'simple_select'
    });

    map.addControl(draw, options.position || 'top-right');

    // Événements de dessin avec callback vers Blazor
    map.on('draw.create', (e) => {
        if (window.blazorDrawCallbacks && window.blazorDrawCallbacks.onCreate) {
            window.blazorDrawCallbacks.onCreate(e.features);
        }
    });

    map.on('draw.update', (e) => {
        if (window.blazorDrawCallbacks && window.blazorDrawCallbacks.onUpdate) {
            window.blazorDrawCallbacks.onUpdate(e.features);
        }
    });

    map.on('draw.delete', (e) => {
        if (window.blazorDrawCallbacks && window.blazorDrawCallbacks.onDelete) {
            window.blazorDrawCallbacks.onDelete(e.features);
        }
    });

    return draw;
}

// Plugin Directions (itinéraires)
export async function loadDirectionsPlugin(map, accessToken, options = {}) {
    await loadPlugin('directions',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js'
    );

    const directions = new MapboxDirections({
        accessToken: accessToken,
        unit: options.unit || 'metric',
        profile: options.profile || 'mapbox/driving',
        alternatives: options.alternatives !== false,
        congestion: options.congestion !== false,
        language: options.language || 'fr',
        steps: options.steps !== false,
        controls: {
            inputs: options.inputs !== false,
            instructions: options.instructions !== false,
            profileSwitcher: options.profileSwitcher !== false
        }
    });

    map.addControl(directions, options.position || 'top-left');
    return directions;
}

// Plugin Compare (comparaison de cartes)
export async function loadComparePlugin(map, otherMap, options = {}) {
    await loadPlugin('compare',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-compare/v0.4.0/mapbox-gl-compare.css',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-compare/v0.4.0/mapbox-gl-compare.js'
    );

    const container = options.container || '#comparison-container';
    new mapboxgl.Compare(map, otherMap, container, {
        orientation: options.orientation || 'vertical',
        mousemove: options.mousemove !== false
    });
}

// === MARQUEURS ===

export function addMarker(map, markerOptions) {
    const markerId = markerOptions.id || `marker-${Date.now()}`;

    const markerElement = markerOptions.element || (() => {
        if (markerOptions.iconUrl) {
            const el = document.createElement('img');
            el.src = markerOptions.iconUrl;
            if (markerOptions.iconSize) {
                el.style.width = markerOptions.iconSize[0] + 'px';
                el.style.height = markerOptions.iconSize[1] + 'px';
            }
            return el;
        }
        return null;
    })();

    const marker = new mapboxgl.Marker({
        element: markerElement,
        color: markerOptions.color || '#3887be',
        scale: markerOptions.scale || 1,
        draggable: markerOptions.draggable || false,
        rotation: markerOptions.rotation || 0,
        pitchAlignment: markerOptions.pitchAlignment || 'auto',
        rotationAlignment: markerOptions.rotationAlignment || 'auto',
        anchor: markerOptions.anchor || 'center'
    })
        .setLngLat([markerOptions.longitude, markerOptions.latitude])
        .addTo(map);

    if (markerOptions.popupText) {
        const popup = new mapboxgl.Popup({
            offset: markerOptions.popupOffset || 25,
            className: markerOptions.popupClassName
        })
            .setHTML(markerOptions.popupText);
        marker.setPopup(popup);
    }

    markers.set(markerId, marker);
    return markerId;
}

export function removeMarker(map, markerId) {
    const marker = markers.get(markerId);
    if (marker) {
        marker.remove();
        markers.delete(markerId);
    }
}

export function updateMarker(map, markerId, markerOptions) {
    const marker = markers.get(markerId);
    if (marker) {
        if (markerOptions.longitude !== undefined && markerOptions.latitude !== undefined) {
            marker.setLngLat([markerOptions.longitude, markerOptions.latitude]);
        }
        if (markerOptions.draggable !== undefined) {
            marker.setDraggable(markerOptions.draggable);
        }
        if (markerOptions.rotation !== undefined) {
            marker.setRotation(markerOptions.rotation);
        }
        if (markerOptions.popupText !== undefined) {
            const popup = marker.getPopup();
            if (popup) {
                popup.setHTML(markerOptions.popupText);
            }
        }
    }
}

// === POPUPS ===

export function showPopup(map, longitude, latitude, html, options = {}) {
    const popupId = `popup-${Date.now()}`;

    const popup = new mapboxgl.Popup({
        closeButton: options.closeButton !== false,
        closeOnClick: options.closeOnClick !== false,
        closeOnMove: options.closeOnMove || false,
        anchor: options.anchor || 'bottom',
        offset: options.offset,
        className: options.className,
        maxWidth: options.maxWidth || '240px',
        focusAfterOpen: options.focusAfterOpen !== false
    })
        .setLngLat([longitude, latitude])
        .setHTML(html)
        .addTo(map);

    popups.set(popupId, popup);
    return popupId;
}

export function closePopup(map, popupId) {
    const popup = popups.get(popupId);
    if (popup) {
        popup.remove();
        popups.delete(popupId);
    }
}

// === SOURCES ET COUCHES ===

export function addSource(map, sourceId, sourceData) {
    if (!map.getSource(sourceId)) {
        map.addSource(sourceId, sourceData);
        sources.set(sourceId, sourceData);
    }
}

export function removeSource(map, sourceId) {
    if (map.getSource(sourceId)) {
        // Supprimer toutes les couches utilisant cette source
        const style = map.getStyle();
        if (style && style.layers) {
            style.layers.forEach(layer => {
                if (layer.source === sourceId) {
                    map.removeLayer(layer.id);
                }
            });
        }
        map.removeSource(sourceId);
        sources.delete(sourceId);
    }
}

export function updateSource(map, sourceId, data) {
    const source = map.getSource(sourceId);
    if (source && source.type === 'geojson') {
        source.setData(data);
    }
}

export function addLayer(map, layerDefinition, beforeLayerId) {
    if (!map.getLayer(layerDefinition.id)) {
        if (beforeLayerId) {
            map.addLayer(layerDefinition, beforeLayerId);
        } else {
            map.addLayer(layerDefinition);
        }
        layers.set(layerDefinition.id, layerDefinition);
    }
}

export function removeLayer(map, layerId) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        layers.delete(layerId);
    }
}

export function setLayerVisibility(map, layerId, visibility) {
    if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
    }
}

export function setPaintProperty(map, layerId, property, value) {
    if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, property, value);
    }
}

export function setLayoutProperty(map, layerId, property, value) {
    if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, property, value);
    }
}

export function setFilter(map, layerId, filter) {
    if (map.getLayer(layerId)) {
        map.setFilter(layerId, filter);
    }
}

// === STYLES ===

export function setStyle(map, styleUrl) {
    map.setStyle(styleUrl);
}

export function setLight(map, light) {
    map.setLight(light);
}

export function setFog(map, fog) {
    map.setFog(fog);
}

// === TERRAIN ET 3D ===

export function enableTerrain(map, options = {}) {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });

    map.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': options.exaggeration || 1.5
    });

    // Ajouter le ciel
    if (options.sky !== false) {
        map.setFog({
            'color': 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
        });
    }
}

export function disableTerrain(map) {
    map.setTerrain(null);
    if (map.getSource('mapbox-dem')) {
        map.removeSource('mapbox-dem');
    }
}

export function add3DBuildings(map) {
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
        }
    }, labelLayerId);
}

// === TRAFFIC ===

export function enableTrafficLayer(map) {
    if (!map.getSource('mapbox-traffic')) {
        map.addSource('mapbox-traffic', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-traffic-v1'
        });
    }

    const layers = [
        {
            'id': 'traffic-street',
            'type': 'line',
            'source': 'mapbox-traffic',
            'source-layer': 'traffic',
            'filter': ['all', ['==', '$type', 'LineString']],
            'paint': {
                'line-width': 2,
                'line-color': [
                    'case',
                    ['==', 'low', ['get', 'congestion']], 'green',
                    ['==', 'moderate', ['get', 'congestion']], 'yellow',
                    ['==', 'heavy', ['get', 'congestion']], 'orange',
                    ['==', 'severe', ['get', 'congestion']], 'red',
                    'blue'
                ]
            }
        }
    ];

    layers.forEach(layer => {
        if (!map.getLayer(layer.id)) {
            map.addLayer(layer);
        }
    });
}

export function disableTrafficLayer(map) {
    ['traffic-street'].forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
}

// === NAVIGATION ===

export function flyTo(map, longitude, latitude, zoom, bearing, pitch, duration) {
    map.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        bearing: bearing || 0,
        pitch: pitch || 0,
        duration: duration || 1000,
        essential: true
    });
}

export function jumpTo(map, longitude, latitude, zoom, bearing, pitch) {
    map.jumpTo({
        center: [longitude, latitude],
        zoom: zoom,
        bearing: bearing || 0,
        pitch: pitch || 0
    });
}

export function easeTo(map, longitude, latitude, zoom, bearing, pitch, duration) {
    map.easeTo({
        center: [longitude, latitude],
        zoom: zoom,
        bearing: bearing || 0,
        pitch: pitch || 0,
        duration: duration || 1000
    });
}

export function fitBounds(map, bounds, padding, maxZoom) {
    map.fitBounds(bounds, {
        padding: padding || 50,
        maxZoom: maxZoom || 15
    });
}

export function setZoom(map, zoom) {
    map.setZoom(zoom);
}

export function setBearing(map, bearing) {
    map.setBearing(bearing);
}

export function setPitch(map, pitch) {
    map.setPitch(pitch);
}

export function setMaxBounds(map, bounds) {
    map.setMaxBounds(bounds);
}

// === REQUÊTES ===

export function queryRenderedFeatures(map, point, options = {}) {
    return map.queryRenderedFeatures(point, options);
}

export function querySourceFeatures(map, sourceId, options = {}) {
    return map.querySourceFeatures(sourceId, options);
}

// === INFORMATIONS ===

export function getBounds(map) {
    const bounds = map.getBounds();
    return {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    };
}

export function getCenter(map) {
    const center = map.getCenter();
    return { lng: center.lng, lat: center.lat };
}

export function getZoom(map) {
    return map.getZoom();
}

export function getBearing(map) {
    return map.getBearing();
}

export function getPitch(map) {
    return map.getPitch();
}

export function getCanvas(map) {
    return map.getCanvas();
}

export function getContainer(map) {
    return map.getContainer();
}

export function isMoving(map) {
    return map.isMoving();
}

export function isZooming(map) {
    return map.isZooming();
}

export function isRotating(map) {
    return map.isRotating();
}

// === CAPTURE D'ÉCRAN ===

export function getMapImage(map, format = 'png', quality = 0.92) {
    const canvas = map.getCanvas();
    return canvas.toDataURL(`image/${format}`, quality);
}

// === ANIMATIONS ===

export function animateMarker(map, markerId, path, duration = 5000) {
    const marker = markers.get(markerId);
    if (!marker || !path || path.length < 2) return;

    let startTime;
    const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress > 1) return;

        const currentIndex = Math.floor(progress * (path.length - 1));
        const nextIndex = Math.min(currentIndex + 1, path.length - 1);
        const segmentProgress = (progress * (path.length - 1)) % 1;

        const lng = path[currentIndex][0] + (path[nextIndex][0] - path[currentIndex][0]) * segmentProgress;
        const lat = path[currentIndex][1] + (path[nextIndex][1] - path[currentIndex][1]) * segmentProgress;

        marker.setLngLat([lng, lat]);
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

// === MESURES ===

export function measureDistance(coordinates) {
    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        distance += turf.distance(
            turf.point(coordinates[i]),
            turf.point(coordinates[i + 1]),
            { units: 'kilometers' }
        );
    }
    return distance;
}

export function measureArea(coordinates) {
    const polygon = turf.polygon([coordinates]);
    return turf.area(polygon) / 1000000; // km²
}

// === GÉOLOCALISATION ===

export function trackUserLocation(map, geolocateControl, dotNetHelper) {
    geolocateControl.on('geolocate', (e) => {
        dotNetHelper.invokeMethodAsync('OnGeolocationCallback',
            e.coords.longitude,
            e.coords.latitude,
            e.coords.accuracy,
            e.coords.altitude,
            e.coords.altitudeAccuracy,
            e.coords.heading,
            e.coords.speed
        );
    });

    geolocateControl.on('error', (e) => {
        dotNetHelper.invokeMethodAsync('OnMapErrorCallback', 'Erreur de géolocalisation');
    });

    geolocateControl.trigger();
}

// === PLUGINS - MÉTHODES SPÉCIFIQUES ===

// Draw Plugin
export function getDrawnFeatures(draw) {
    return draw.getAll();
}

export function clearDrawnFeatures(draw) {
    draw.deleteAll();
}

export function setDrawMode(draw, mode) {
    draw.changeMode(mode);
}

// Directions Plugin
export function setDirectionsRoute(directions, origin, destination, profile) {
    directions.setOrigin(origin);
    directions.setDestination(destination);
    if (profile) {
        directions.setProfile(`mapbox/${profile}`);
    }
}

export function clearDirectionsRoute(directions) {
    directions.removeRoutes();
}

// Geocoder Plugin
export function setGeocoderInput(geocoder, value) {
    geocoder.setInput(value);
}

export function clearGeocoderInput(geocoder) {
    geocoder.clear();
}

// === UTILITAIRES ===

export function addCustomControl(map, controlHtml, position = 'top-right') {
    class CustomControl {
        onAdd(map) {
            this._map = map;
            this._container = document.createElement('div');
            this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
            this._container.innerHTML = controlHtml;
            return this._container;
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }

    const control = new CustomControl();
    map.addControl(control, position);
    return control;
}

export function triggerResize(map) {
    map.resize();
}

export function destroy(map) {
    markers.forEach(marker => marker.remove());
    popups.forEach(popup => popup.remove());
    markers.clear();
    popups.clear();
    sources.clear();
    layers.clear();
    map.remove();
}