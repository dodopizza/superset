import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'ol/ol.css';
import { Map, View, Feature, Collection } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import Select, { SelectEvent } from 'ol/interaction/Select';
import Modify from 'ol/interaction/Modify';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Fill } from 'ol/style';
import { click } from 'ol/events/condition';
import { Geometry, Polygon } from 'ol/geom';
import { useTheme } from '@superset-ui/core';
import { hexToRGB } from './utils/colors';

const NOOP = () => {};
export const DEFAULT_MAX_ZOOM = 16;
export const DEFAULT_POINT_RADIUS = 60;

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  aggregatorName: PropTypes.string,
  clusterer: PropTypes.object,
  globalOpacity: PropTypes.number,
  hasCustomMetric: PropTypes.bool,
  mapStyle: PropTypes.string,
  mapboxApiKey: PropTypes.string.isRequired,
  onViewportChange: PropTypes.func,
  pointRadius: PropTypes.number,
  pointRadiusUnit: PropTypes.string,
  renderWhileDragging: PropTypes.bool,
  rgb: PropTypes.array,
  bounds: PropTypes.array,
};

const defaultProps = {
  width: 400,
  height: 400,
  globalOpacity: 1,
  onViewportChange: NOOP,
  pointRadius: DEFAULT_POINT_RADIUS,
  pointRadiusUnit: 'Pixels',
};

interface IMapElementsRef {
  map: Map | null;
  drawInteraction: Draw | null;
  modifyInteraction: Modify | null;
  vectorSource: VectorSource<Feature<Geometry>> | null;
}

const OpenLayers = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Geometry> | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapElementsRef = useRef<IMapElementsRef>({
    map: null,
    drawInteraction: null,
    modifyInteraction: null,
    vectorSource: null,
  });
  const theme = useTheme();

  useEffect(() => {
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: theme.colors.primary.base,
          width: 2,
        }),
        fill: new Fill({
          color: hexToRGB(theme.colors.primary.base, 0.1),
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current!,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const drawInteraction = new Draw({
      source: vectorSource,
      type: 'Polygon',
      style: {
        'stroke-color': theme.colors.primary.base,
        'fill-color': hexToRGB(theme.colors.primary.base, 0.1),
      },
    });

    const modifyInteraction = new Modify({
      source: vectorSource,
    });

    drawInteraction.on('drawend', (event: DrawEvent) => {
      const polygon = event.feature.getGeometry();
      if (polygon) {
        const coordinates = (polygon as Polygon).getCoordinates();
        console.log('Polygon coordinates:', coordinates);
      }
    });

    const selectInteraction = new Select({
      condition: click,
    });
    map.addInteraction(selectInteraction);

    selectInteraction.on('select', (e: SelectEvent) => {
      const selectedFeatures = e.target.getFeatures() as Collection<
        Feature<Geometry>
      >;
      if (selectedFeatures.getLength() > 0) {
        setSelectedFeature(selectedFeatures.item(0));
      } else {
        setSelectedFeature(null);
        setIsEditing(false);
      }
    });

    mapElementsRef.current.map = map;
    mapElementsRef.current.drawInteraction = drawInteraction;
    mapElementsRef.current.modifyInteraction = modifyInteraction;
    mapElementsRef.current.vectorSource = vectorSource;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDrawing) {
        map.removeInteraction(drawInteraction);
        setIsDrawing(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      map.setTarget(undefined);
      document.removeEventListener('keydown', handleEscapeKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDrawing = () => {
    const { map, drawInteraction } = mapElementsRef.current;
    if (isDrawing) {
      map?.removeInteraction(drawInteraction!);
    } else {
      map?.addInteraction(drawInteraction!);
    }
    setIsDrawing(prev => !prev);
    setSelectedFeature(null);
  };

  const toggleEditing = () => {
    const { map, modifyInteraction } = mapElementsRef.current;
    if (isEditing) {
      map?.removeInteraction(modifyInteraction!);
    } else {
      map?.addInteraction(modifyInteraction!);
    }
    setIsEditing(prev => !prev);
  };

  const deletePolygon = () => {
    const { vectorSource } = mapElementsRef.current;
    if (selectedFeature && vectorSource) {
      vectorSource.removeFeature(selectedFeature);
      setSelectedFeature(null);
    }
  };

  return (
    <>
      <button type="button" onClick={toggleDrawing} disabled={isEditing}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing Polygon'}
      </button>
      <button
        type="button"
        onClick={toggleEditing}
        disabled={isDrawing || !selectedFeature}
      >
        {isEditing ? 'Stop Editing' : 'Edit Selected Polygon'}
      </button>
      <button
        type="button"
        onClick={deletePolygon}
        disabled={isDrawing || !selectedFeature || isEditing}
      >
        Delete Selected Polygon
      </button>

      {/* The map container */}
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
        className="map-container"
      />
    </>
  );
};

OpenLayers.propTypes = propTypes;
OpenLayers.defaultProps = defaultProps;

export default OpenLayers;
