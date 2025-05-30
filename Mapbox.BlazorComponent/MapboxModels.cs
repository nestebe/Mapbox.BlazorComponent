// MapboxModels.cs - Modèles complets pour le composant Mapbox Blazor

namespace Mapbox.BlazorComponent.Models
{
    #region Événements
    public class MapClickEventArgs
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public object? Features { get; set; }
    }

    public class MapMoveEventArgs
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double Zoom { get; set; }
        public double Bearing { get; set; }
        public double Pitch { get; set; }
    }

    public class MapZoomEventArgs
    {
        public double Zoom { get; set; }
        public double PreviousZoom { get; set; }
    }

    public class MapErrorEventArgs
    {
        public string Message { get; set; } = string.Empty;
        public string? Code { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }

    public class GeolocationEventArgs
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double Accuracy { get; set; }
        public double? Altitude { get; set; }
        public double? AltitudeAccuracy { get; set; }
        public double? Heading { get; set; }
        public double? Speed { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }

    public class DrawEventArgs
    {
        public string GeoJson { get; set; } = string.Empty;
        public string FeatureType { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public List<object>? Features { get; set; }
    }

    public class MarkerDragEventArgs
    {
        public string MarkerId { get; set; } = string.Empty;
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }

    public class LayerEventArgs
    {
        public string LayerId { get; set; } = string.Empty;
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public object? Features { get; set; }
    }

    public class DirectionsEventArgs
    {
        public object? Route { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
    }

    public class GeocoderEventArgs
    {
        public string PlaceName { get; set; } = string.Empty;
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public object? Result { get; set; }
    }

    public class MouseMoveEventArgs
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
    #endregion

    #region Géométrie et limites
    public class MapBounds
    {
        public double North { get; set; }
        public double South { get; set; }
        public double East { get; set; }
        public double West { get; set; }

        public double[] ToArray() => new[] { West, South, East, North };

        public static MapBounds FromArray(double[] bounds)
        {
            if (bounds.Length != 4) throw new ArgumentException("Bounds array must have 4 elements");
            return new MapBounds { West = bounds[0], South = bounds[1], East = bounds[2], North = bounds[3] };
        }
    }

    public class MapCenter
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        public double[] ToArray() => new[] { Longitude, Latitude };
    }

    public class LngLat
    {
        public double Lng { get; set; }
        public double Lat { get; set; }

        public double[] ToArray() => new[] { Lng, Lat };
    }
    #endregion

    #region Marqueurs et popups
    public class MapboxMarker
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string? PopupText { get; set; }
        public string Color { get; set; } = "#3887be";
        public bool Draggable { get; set; } = false;
        public double Scale { get; set; } = 1.0;
        public double Rotation { get; set; } = 0;
        public string? IconUrl { get; set; }
        public double[]? IconSize { get; set; }
        public double[]? IconAnchor { get; set; }
        public string Anchor { get; set; } = "center";
        public string? ClassName { get; set; }
        public double[]? Offset { get; set; }
        public string PitchAlignment { get; set; } = "auto";
        public string RotationAlignment { get; set; } = "auto";
        public Dictionary<string, object>? Properties { get; set; }
        public object? Element { get; set; }
        public double[]? PopupOffset { get; set; }
        public string? PopupClassName { get; set; }
    }

    public class PopupOptions
    {
        public bool CloseButton { get; set; } = true;
        public bool CloseOnClick { get; set; } = true;
        public bool CloseOnMove { get; set; } = false;
        public string Anchor { get; set; } = "bottom";
        public double[]? Offset { get; set; }
        public string? ClassName { get; set; }
        public string MaxWidth { get; set; } = "240px";
        public bool FocusAfterOpen { get; set; } = true;
    }
    #endregion

    #region Sources
    public static class SourceTypes
    {
        public const string Vector = "vector";
        public const string Raster = "raster";
        public const string RasterDem = "raster-dem";
        public const string GeoJson = "geojson";
        public const string Image = "image";
        public const string Video = "video";
    }

    public class GeoJsonSource
    {
        public string Type { get; set; } = SourceTypes.GeoJson;
        public object Data { get; set; } = new object();
        public int? MaxZoom { get; set; }
        public string? Attribution { get; set; }
        public int? Buffer { get; set; }
        public bool? LineMetrics { get; set; }
        public double? Tolerance { get; set; }
        public bool? Cluster { get; set; }
        public int? ClusterMaxZoom { get; set; }
        public int? ClusterRadius { get; set; }
        public Dictionary<string, object>? ClusterProperties { get; set; }
    }

    public class VectorSource
    {
        public string Type { get; set; } = SourceTypes.Vector;
        public string? Url { get; set; }
        public string[]? Tiles { get; set; }
        public double[]? Bounds { get; set; }
        public string? Scheme { get; set; }
        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }
        public string? Attribution { get; set; }
        public bool? Volatile { get; set; }
    }

    public class RasterSource
    {
        public string Type { get; set; } = SourceTypes.Raster;
        public string? Url { get; set; }
        public string[]? Tiles { get; set; }
        public double[]? Bounds { get; set; }
        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }
        public int TileSize { get; set; } = 512;
        public string? Scheme { get; set; }
        public string? Attribution { get; set; }
        public bool? Volatile { get; set; }
    }

    public class ImageSource
    {
        public string Type { get; set; } = SourceTypes.Image;
        public string Url { get; set; } = string.Empty;
        public double[][] Coordinates { get; set; } = new double[4][];
    }

    public class VideoSource
    {
        public string Type { get; set; } = SourceTypes.Video;
        public string[] Urls { get; set; } = Array.Empty<string>();
        public double[][] Coordinates { get; set; } = new double[4][];
    }
    #endregion

    #region Couches
    public static class LayerTypes
    {
        public const string Fill = "fill";
        public const string Line = "line";
        public const string Symbol = "symbol";
        public const string Circle = "circle";
        public const string Heatmap = "heatmap";
        public const string FillExtrusion = "fill-extrusion";
        public const string Raster = "raster";
        public const string Hillshade = "hillshade";
        public const string Background = "background";
        public const string Sky = "sky";
    }

    public class LayerDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string? SourceLayer { get; set; }
        public object? Filter { get; set; }
        public Dictionary<string, object>? Layout { get; set; }
        public Dictionary<string, object>? Paint { get; set; }
        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }

    public class FillLayer : LayerDefinition
    {
        public FillLayer()
        {
            Type = LayerTypes.Fill;
            Paint = new Dictionary<string, object>
            {
                ["fill-color"] = "#000000",
                ["fill-opacity"] = 0.5
            };
        }
    }

    public class LineLayer : LayerDefinition
    {
        public LineLayer()
        {
            Type = LayerTypes.Line;
            Paint = new Dictionary<string, object>
            {
                ["line-color"] = "#000000",
                ["line-width"] = 1
            };
        }
    }

    public class CircleLayer : LayerDefinition
    {
        public CircleLayer()
        {
            Type = LayerTypes.Circle;
            Paint = new Dictionary<string, object>
            {
                ["circle-radius"] = 5,
                ["circle-color"] = "#000000"
            };
        }
    }

    public class SymbolLayer : LayerDefinition
    {
        public SymbolLayer()
        {
            Type = LayerTypes.Symbol;
            Layout = new Dictionary<string, object>
            {
                ["text-field"] = "",
                ["text-font"] = new[] { "Open Sans Regular", "Arial Unicode MS Regular" },
                ["text-size"] = 12
            };
        }
    }

    public class HeatmapLayer : LayerDefinition
    {
        public HeatmapLayer()
        {
            Type = LayerTypes.Heatmap;
            Paint = new Dictionary<string, object>
            {
                ["heatmap-radius"] = 30,
                ["heatmap-intensity"] = 1
            };
        }
    }

    public class FillExtrusionLayer : LayerDefinition
    {
        public FillExtrusionLayer()
        {
            Type = LayerTypes.FillExtrusion;
            Paint = new Dictionary<string, object>
            {
                ["fill-extrusion-color"] = "#000000",
                ["fill-extrusion-height"] = 0,
                ["fill-extrusion-base"] = 0
            };
        }
    }
    #endregion

    #region Styles
    public static class MapboxStyles
    {
        public const string Streets = "mapbox://styles/mapbox/streets-v12";
        public const string Outdoors = "mapbox://styles/mapbox/outdoors-v12";
        public const string Light = "mapbox://styles/mapbox/light-v11";
        public const string Dark = "mapbox://styles/mapbox/dark-v11";
        public const string Satellite = "mapbox://styles/mapbox/satellite-v9";
        public const string SatelliteStreets = "mapbox://styles/mapbox/satellite-streets-v12";
        public const string NavigationDay = "mapbox://styles/mapbox/navigation-day-v1";
        public const string NavigationNight = "mapbox://styles/mapbox/navigation-night-v1";
    }

    public class LightOptions
    {
        public string Anchor { get; set; } = "viewport";
        public double[]? Position { get; set; }
        public string? Color { get; set; }
        public double? Intensity { get; set; }
    }

    public class FogOptions
    {
        public string? Color { get; set; }
        public string? HighColor { get; set; }
        public double? HorizonBlend { get; set; }
        public string? SpaceColor { get; set; }
        public double? StarIntensity { get; set; }
        public double[]? Range { get; set; }
    }

    public class TerrainOptions
    {
        public double Exaggeration { get; set; } = 1.5;
        public bool Sky { get; set; } = true;
    }
    #endregion

    #region Plugins Options
    public class DrawPluginOptions
    {
        public bool Polygon { get; set; } = true;
        public bool Line { get; set; } = true;
        public bool Point { get; set; } = true;
        public bool Trash { get; set; } = true;
        public bool Combine { get; set; } = true;
        public bool Uncombine { get; set; } = true;
        public string DefaultMode { get; set; } = "simple_select";
        public string Position { get; set; } = "top-right";

        // Utilisation de propriétés au lieu de Func pour éviter les problèmes de sérialisation
        [System.Text.Json.Serialization.JsonIgnore]
        public Action<object>? OnCreate { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Action<object>? OnUpdate { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Action<object>? OnDelete { get; set; }
    }

    public class GeocoderOptions
    {
        public bool Marker { get; set; } = true;
        public string Placeholder { get; set; } = "Rechercher...";
        public double[]? Proximity { get; set; }
        public bool TrackProximity { get; set; } = true;
        public bool Collapsed { get; set; } = false;
        public bool ClearAndBlurOnEsc { get; set; } = true;
        public bool ClearOnBlur { get; set; } = true;
        public string[]? Types { get; set; }
        public string[]? Countries { get; set; }
        public string Language { get; set; } = "fr";
        public int Limit { get; set; } = 5;
        public string Position { get; set; } = "top-left";
    }

    public class DirectionsOptions
    {
        public string Unit { get; set; } = "metric";
        public string Profile { get; set; } = "mapbox/driving";
        public bool Alternatives { get; set; } = true;
        public bool Congestion { get; set; } = true;
        public string Language { get; set; } = "fr";
        public bool Steps { get; set; } = true;
        public bool Inputs { get; set; } = true;
        public bool Instructions { get; set; } = true;
        public bool ProfileSwitcher { get; set; } = true;
        public string Position { get; set; } = "top-left";
    }
    #endregion

    #region Requêtes
    public class QueryOptions
    {
        public string[]? Layers { get; set; }
        public object? Filter { get; set; }
        public bool Validate { get; set; } = true;
    }
    #endregion

    #region GeoJSON
    public class Feature
    {
        public string Type { get; set; } = "Feature";
        public Geometry? Geometry { get; set; }
        public Dictionary<string, object>? Properties { get; set; }
        public string? Id { get; set; }
    }

    public class FeatureCollection
    {
        public string Type { get; set; } = "FeatureCollection";
        public List<Feature> Features { get; set; } = new();
    }

    public abstract class Geometry
    {
        public abstract string Type { get; }
        public abstract object Coordinates { get; }
    }

    public class Point : Geometry
    {
        public override string Type => "Point";
        public override object Coordinates => Position;
        public double[] Position { get; set; } = new double[2];
    }

    public class LineString : Geometry
    {
        public override string Type => "LineString";
        public override object Coordinates => Positions;
        public double[][] Positions { get; set; } = Array.Empty<double[]>();
    }

    public class Polygon : Geometry
    {
        public override string Type => "Polygon";
        public override object Coordinates => Rings;
        public double[][][] Rings { get; set; } = Array.Empty<double[][]>();
    }

    public class MultiPoint : Geometry
    {
        public override string Type => "MultiPoint";
        public override object Coordinates => Positions;
        public double[][] Positions { get; set; } = Array.Empty<double[]>();
    }

    public class MultiLineString : Geometry
    {
        public override string Type => "MultiLineString";
        public override object Coordinates => Lines;
        public double[][][] Lines { get; set; } = Array.Empty<double[][]>();
    }

    public class MultiPolygon : Geometry
    {
        public override string Type => "MultiPolygon";
        public override object Coordinates => Polygons;
        public double[][][][] Polygons { get; set; } = Array.Empty<double[][][]>();
    }
    #endregion

    #region Helpers
    public static class GeoJsonBuilder
    {
        public static Feature CreatePointFeature(double longitude, double latitude, Dictionary<string, object>? properties = null)
        {
            return new Feature
            {
                Geometry = new Point { Position = new[] { longitude, latitude } },
                Properties = properties
            };
        }

        public static Feature CreateLineFeature(double[][] coordinates, Dictionary<string, object>? properties = null)
        {
            return new Feature
            {
                Geometry = new LineString { Positions = coordinates },
                Properties = properties
            };
        }

        public static Feature CreatePolygonFeature(double[][][] coordinates, Dictionary<string, object>? properties = null)
        {
            return new Feature
            {
                Geometry = new Polygon { Rings = coordinates },
                Properties = properties
            };
        }

        public static FeatureCollection CreateFeatureCollection(params Feature[] features)
        {
            return new FeatureCollection { Features = features.ToList() };
        }
    }
    #endregion
}