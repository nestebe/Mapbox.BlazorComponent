# Mapbox Blazor Component

A comprehensive Blazor component for integrating Mapbox GL JS into your Blazor WebAssembly and Server applications.


## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Plugins](#-plugins)
- [Events](#-events)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🗺️ **Full Mapbox GL JS Integration** - Access to all Mapbox features
- 🎯 **Interactive Maps** - Pan, zoom, rotate, and tilt with smooth animations
- 📍 **Markers & Popups** - Customizable markers with HTML popups
- 🎨 **Multiple Styles** - 8 built-in Mapbox styles
- 📸 **Map Capture** - Export maps as PNG/JPEG images
- 🌍 **Geolocation** - Track user location with high accuracy
- 📏 **Measurements** - Calculate distances and areas

### Advanced Features
- 🏔️ **3D Terrain** - Realistic terrain with customizable exaggeration
- 🏢 **3D Buildings** - Extruded building footprints
- 🚗 **Real-time Traffic** - Live traffic layer
- 🔍 **Geocoding** - Address search with autocomplete
- 🧭 **Directions** - Turn-by-turn routing
- ✏️ **Drawing Tools** - Draw points, lines, and polygons
- 📊 **Data Visualization** - Support for GeoJSON, vector tiles, and raster sources

### Technical Features
- 💻 **Blazor Server & WebAssembly** - Works with both hosting models
- 🔄 **Two-way Data Binding** - Reactive updates between C# and JavaScript
- 📱 **Responsive** - Mobile-friendly with touch support
- ⚡ **Performance Optimized** - Efficient marker management and clustering
- 🛠️ **Fully Typed** - Complete C# models for all Mapbox features
- 🎪 **Event System** - Rich event handling for all interactions

## 🚀 Installation

### Prerequisites
- .NET 6.0, 7.0, 8.0, or 9.0
- A Mapbox account with an access token (get one at [mapbox.com](https://account.mapbox.com/))

### Install via NuGet

```bash
dotnet add package MapboxBlazor
```

Or via Package Manager Console:

```powershell
Install-Package MapboxBlazor
```

### Manual Installation

1. Copy these files to your project:
   - `Components/MapboxComponent.razor`
   - `Models/MapboxModels.cs`
   - `wwwroot/mapbox-interop.js`

2. Add to `_Imports.razor`:
```csharp
@using MapboxBlazor.Components
@using MapboxBlazor.Models
```

## 🎯 Quick Start

### Basic Map

```razor
@page "/map"
@using MapboxBlazor.Components
@using MapboxBlazor.Models

<MapboxComponent AccessToken="YOUR_MAPBOX_TOKEN"
                 Longitude="2.3522"
                 Latitude="48.8566"
                 Zoom="10"
                 Width="100%"
                 Height="500px" />
```

### Interactive Map with Controls

```razor
@page "/interactive-map"

<MapboxComponent @ref="map"
                 AccessToken="@mapboxToken"
                 Longitude="@longitude"
                 Latitude="@latitude"
                 Zoom="12"
                 ShowNavigationControl="true"
                 ShowGeolocateControl="true"
                 ShowScaleControl="true"
                 OnMapClick="HandleMapClick"
                 OnMapLoad="HandleMapLoad" />

@code {
    private MapboxComponent? map;
    private string mapboxToken = "YOUR_MAPBOX_TOKEN";
    private double longitude = -74.0060;
    private double latitude = 40.7128;

    private async Task HandleMapClick(MapClickEventArgs args)
    {
        // Add marker where user clicked
        await map!.AddMarker(new MapboxMarker
        {
            Longitude = args.Longitude,
            Latitude = args.Latitude,
            PopupText = "You clicked here!"
        });
    }

    private void HandleMapLoad()
    {
        Console.WriteLine("Map loaded successfully!");
    }
}
```

## 📋 Configuration

### Component Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `AccessToken` | string | Required | Your Mapbox access token |
| `Longitude` | double | 2.3522 | Initial longitude |
| `Latitude` | double | 48.8566 | Initial latitude |
| `Zoom` | int | 9 | Initial zoom level (0-24) |
| `Style` | string | Streets | Map style URL |
| `Width` | string | "100%" | Map width (CSS value) |
| `Height` | string | "400px" | Map height (CSS value) |
| `MinZoom` | double | 0 | Minimum zoom level |
| `MaxZoom` | double | 24 | Maximum zoom level |
| `Bearing` | double | 0 | Initial bearing (rotation) |
| `Pitch` | double | 0 | Initial pitch (tilt) |

### Control Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ShowNavigationControl` | bool | true | Show zoom and rotation controls |
| `ShowGeolocateControl` | bool | true | Show geolocation button |
| `ShowScaleControl` | bool | false | Show scale bar |
| `ShowFullscreenControl` | bool | false | Show fullscreen button |
| `ShowAttributionControl` | bool | true | Show attribution |

### Interaction Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ScrollZoom` | bool | true | Enable scroll wheel zoom |
| `BoxZoom` | bool | true | Enable box zoom |
| `DragRotate` | bool | true | Enable drag to rotate |
| `DragPan` | bool | true | Enable drag to pan |
| `Keyboard` | bool | true | Enable keyboard shortcuts |
| `DoubleClickZoom` | bool | true | Enable double click zoom |
| `TouchZoomRotate` | bool | true | Enable touch gestures |

### Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `EnableDrawPlugin` | bool | false | Enable drawing tools |
| `EnableGeocoder` | bool | false | Enable address search |
| `EnableDirections` | bool | false | Enable routing |
| `EnableTrafficPlugin` | bool | false | Enable traffic layer |
| `EnableTerrain` | bool | false | Enable 3D terrain |
| `Enable3DBuildings` | bool | false | Enable 3D buildings |

## 📚 API Reference

### Navigation Methods

```csharp
// Animate to location
await map.FlyTo(longitude, latitude, zoom, bearing, pitch, duration);

// Instant jump
await map.JumpTo(longitude, latitude, zoom, bearing, pitch);

// Smooth transition
await map.EaseTo(longitude, latitude, zoom, bearing, pitch, duration);

// Fit to bounds
await map.FitBounds(bounds, padding, maxZoom);

// Set individual properties
await map.SetZoom(15);
await map.SetBearing(45);
await map.SetPitch(60);
await map.SetMaxBounds(bounds);
```

### Marker Management

```csharp
// Add a marker
var marker = new MapboxMarker
{
    Longitude = -74.0060,
    Latitude = 40.7128,
    Color = "#FF0000",
    Scale = 1.2,
    Draggable = true,
    PopupText = "<strong>New York</strong><br/>The Big Apple"
};
var markerId = await map.AddMarker(marker);

// Update marker
marker.Color = "#00FF00";
await map.UpdateMarker(markerId, marker);

// Remove marker
await map.RemoveMarker(markerId);

// Animate marker along path
var path = new double[][] {
    new[] { -74.0060, 40.7128 },
    new[] { -74.0160, 40.7228 },
    new[] { -74.0260, 40.7328 }
};
await map.AnimateMarker(markerId, path, 5000);

// Clear all markers
await map.ClearAllMarkers();
```

### Popup Management

```csharp
// Show popup
var popupOptions = new PopupOptions
{
    CloseButton = true,
    CloseOnClick = true,
    Anchor = "bottom",
    MaxWidth = "300px"
};
var popupId = await map.ShowPopup(lng, lat, "<p>Hello World!</p>", popupOptions);

// Close popup
await map.ClosePopup(popupId);

// Close all popups
await map.CloseAllPopups();
```

### Layers and Sources

```csharp
// Add GeoJSON source
var geojson = new GeoJsonSource
{
    Data = featureCollection,
    Cluster = true,
    ClusterRadius = 50,
    ClusterMaxZoom = 14
};
await map.AddSource("earthquakes", geojson);

// Add circle layer
var layer = new CircleLayer
{
    Id = "earthquake-circles",
    Source = "earthquakes",
    Paint = new Dictionary<string, object>
    {
        ["circle-radius"] = new Dictionary<string, object>
        {
            ["base"] = 1.75,
            ["stops"] = new[] {
                new object[] { 12, 2 },
                new object[] { 22, 180 }
            }
        },
        ["circle-color"] = new[] {
            "step",
            new[] { "get", "mag" },
            "#51bbd6",
            5, "#f1f075",
            7, "#ff0000"
        }
    }
};
await map.AddLayer(layer);

// Update source data
await map.UpdateSource("earthquakes", newData);

// Toggle layer visibility
await map.SetLayerVisibility("earthquake-circles", false);

// Remove layer and source
await map.RemoveLayer("earthquake-circles");
await map.RemoveSource("earthquakes");
```

### 3D Features

```csharp
// Enable 3D terrain
await map.EnableTerrainLayer(new TerrainOptions 
{ 
    Exaggeration = 1.5,
    Sky = true 
});

// Add 3D buildings
await map.Add3DBuildingsLayer();

// Set lighting
await map.SetLight(new LightOptions
{
    Anchor = "viewport",
    Color = "white",
    Intensity = 0.4
});

// Set fog
await map.SetFog(new FogOptions
{
    Color = "rgb(186, 210, 235)",
    HighColor = "rgb(36, 92, 223)",
    HorizonBlend = 0.02
});
```

### Drawing Tools

```csharp
// Set drawing mode
await map.SetDrawMode("draw_polygon");
// Modes: "draw_point", "draw_line_string", "draw_polygon", "simple_select"

// Get drawn features
var drawnGeoJson = await map.GetDrawnFeatures();

// Clear all drawings
await map.ClearDrawnFeatures();
```

### Utilities

```csharp
// Capture map as image
var imageDataUrl = await map.GetMapImage("png", 0.92);
var imageBytes = await map.GetMapImageBytes("jpeg", 0.85);

// Measure distance
var coordinates = new double[][] {
    new[] { -74.0060, 40.7128 },
    new[] { -118.2437, 34.0522 }
};
var distanceKm = await map.MeasureDistance(coordinates);

// Measure area
var polygonCoords = new double[][] {
    new[] { -74.0, 40.7 },
    new[] { -74.1, 40.7 },
    new[] { -74.1, 40.8 },
    new[] { -74.0, 40.8 },
    new[] { -74.0, 40.7 }
};
var areaKm2 = await map.MeasureArea(polygonCoords);

// Get map information
var bounds = await map.GetBounds();
var center = await map.GetCenter();
var zoom = await map.GetZoom();
var bearing = await map.GetBearing();
var pitch = await map.GetPitch();

// Query features
var features = await map.QueryRenderedFeatures(point, new QueryOptions
{
    Layers = new[] { "my-layer" }
});
```

## 🎨 Examples

### 1. Map with Multiple Markers

```razor
@page "/markers-demo"

<MapboxComponent @ref="map"
                 AccessToken="@token"
                 Zoom="10"
                 OnMapLoad="LoadMarkers" />

@code {
    private MapboxComponent? map;
    private string token = "YOUR_TOKEN";

    private async Task LoadMarkers()
    {
        var cities = new[]
        {
            new { Name = "Paris", Lng = 2.3522, Lat = 48.8566 },
            new { Name = "London", Lng = -0.1276, Lat = 51.5074 },
            new { Name = "Berlin", Lng = 13.4050, Lat = 52.5200 }
        };

        foreach (var city in cities)
        {
            await map!.AddMarker(new MapboxMarker
            {
                Longitude = city.Lng,
                Latitude = city.Lat,
                PopupText = $"<strong>{city.Name}</strong>",
                Color = "#3887be"
            });
        }

        // Fit map to show all markers
        await map.FitBounds(new[] { -0.5, 48.5, 14, 53 }, 50);
    }
}
```

### 2. Interactive Drawing

```razor
@page "/drawing-demo"

<div class="mb-3">
    <button class="btn btn-primary" @onclick="() => SetMode(\"draw_polygon\")">
        Draw Polygon
    </button>
    <button class="btn btn-secondary" @onclick="ClearDrawings">
        Clear
    </button>
    <button class="btn btn-info" @onclick="CalculateArea">
        Calculate Area
    </button>
</div>

<MapboxComponent @ref="map"
                 AccessToken="@token"
                 EnableDrawPlugin="true"
                 OnDrawCreate="OnShapeCreated" />

<p>Area: @area km²</p>

@code {
    private MapboxComponent? map;
    private string token = "YOUR_TOKEN";
    private double area = 0;

    private async Task SetMode(string mode)
    {
        await map!.SetDrawMode(mode);
    }

    private async Task ClearDrawings()
    {
        await map!.ClearDrawnFeatures();
        area = 0;
    }

    private void OnShapeCreated(DrawEventArgs args)
    {
        Console.WriteLine($"Created: {args.GeoJson}");
    }

    private async Task CalculateArea()
    {
        var features = await map!.GetDrawnFeatures();
        // Parse GeoJSON and calculate area
        // area = ...
    }
}
```

### 3. Real-time Location Tracking

```razor
@page "/tracking-demo"

<MapboxComponent @ref="map"
                 AccessToken="@token"
                 ShowGeolocateControl="true"
                 OnGeolocation="UpdateLocation" />

<div class="mt-3">
    <p>Your location: @($"{userLat:F6}, {userLng:F6}")</p>
    <p>Accuracy: @accuracy meters</p>
</div>

@code {
    private MapboxComponent? map;
    private string token = "YOUR_TOKEN";
    private double userLat, userLng, accuracy;

    private async Task UpdateLocation(GeolocationEventArgs args)
    {
        userLat = args.Latitude;
        userLng = args.Longitude;
        accuracy = args.Accuracy;

        // Center map on user location
        await map!.FlyTo(args.Longitude, args.Latitude, 15);
    }
}
```

### 4. Custom Style with 3D Buildings

```razor
@page "/3d-demo"

<MapboxComponent @ref="map"
                 AccessToken="@token"
                 Style="@MapboxStyles.Dark"
                 Pitch="60"
                 Bearing="45"
                 Zoom="15"
                 Enable3DBuildings="true"
                 EnableTerrain="true"
                 OnMapLoad="Setup3D" />

@code {
    private MapboxComponent? map;
    private string token = "YOUR_TOKEN";

    private async Task Setup3D()
    {
        // Enable 3D terrain with exaggeration
        await map!.EnableTerrainLayer(new TerrainOptions 
        { 
            Exaggeration = 2.0 
        });

        // Set atmospheric lighting
        await map.SetLight(new LightOptions
        {
            Anchor = "viewport",
            Color = "#ffd700",
            Intensity = 0.5,
            Position = new[] { 1.15, 210.0, 30.0 }
        });

        // Add fog for depth
        await map.SetFog(new FogOptions
        {
            Color = "rgb(160, 180, 200)",
            HorizonBlend = 0.1
        });
    }
}
```

## 🔌 Plugins

### Geocoder (Address Search)

```csharp
// Enable in component
EnableGeocoder="true"

// Configure options
GeocoderOptions = new GeocoderOptions
{
    Placeholder = "Search for places...",
    Countries = new[] { "us", "ca" },
    Types = new[] { "place", "address" },
    Limit = 10
}

// Programmatically search
await map.SetGeocoderInput("Times Square");
```

### Directions (Routing)

```csharp
// Enable in component
EnableDirections="true"

// Set route programmatically
await map.SetDirectionsRoute(
    origin: new[] { -73.9857, 40.7484 },      // Times Square
    destination: new[] { -73.9681, 40.7851 }, // Central Park
    profile: "walking"
);

// Clear route
await map.ClearDirectionsRoute();
```

### Draw (Drawing Tools)

```csharp
// Enable in component
EnableDrawPlugin="true"

// Configure options
DrawOptions = new DrawPluginOptions
{
    Polygon = true,
    Line = true,
    Point = true,
    Trash = true,
    Combine = true
}

// Handle events
OnDrawCreate="HandleDrawCreate"
OnDrawUpdate="HandleDrawUpdate"
OnDrawDelete="HandleDrawDelete"
```

## 📅 Events

### Map Events

| Event | Args Type | Description |
|-------|-----------|-------------|
| `OnMapLoad` | - | Fired when map is fully loaded |
| `OnMapClick` | `MapClickEventArgs` | Fired on map click |
| `OnMapDoubleClick` | `MapClickEventArgs` | Fired on double click |
| `OnMapMove` | `MapMoveEventArgs` | Fired during pan/zoom |
| `OnMapZoom` | `MapZoomEventArgs` | Fired on zoom change |
| `OnStyleLoad` | - | Fired when style is loaded |
| `OnMapError` | `MapErrorEventArgs` | Fired on map error |

### Interaction Events

| Event | Args Type | Description |
|-------|-----------|-------------|
| `OnMouseEnter` | - | Mouse enters map |
| `OnMouseLeave` | - | Mouse leaves map |
| `OnMouseMove` | `MouseMoveEventArgs` | Mouse moves over map |
| `OnTouchStart` | - | Touch interaction starts |
| `OnTouchEnd` | - | Touch interaction ends |
| `OnRotate` | `double` | Map rotation changes |
| `OnPitch` | `double` | Map pitch changes |

### Feature Events

| Event | Args Type | Description |
|-------|-----------|-------------|
| `OnMarkerDragEnd` | `MarkerDragEventArgs` | Marker drag completes |
| `OnLayerClick` | `LayerEventArgs` | Layer feature clicked |
| `OnGeolocation` | `GeolocationEventArgs` | User location updated |
| `OnStyleChange` | `string` | Map style changed |

### Plugin Events

| Event | Args Type | Description |
|-------|-----------|-------------|
| `OnDrawCreate` | `DrawEventArgs` | Drawing created |
| `OnDrawUpdate` | `DrawEventArgs` | Drawing updated |
| `OnDrawDelete` | `DrawEventArgs` | Drawing deleted |
| `OnDirectionsRoute` | `DirectionsEventArgs` | Route calculated |
| `OnGeocoderResult` | `GeocoderEventArgs` | Geocoding result |

## 🐛 Troubleshooting

### Common Issues

#### Map doesn't display
- ✅ Verify your Mapbox access token is valid
- ✅ Check browser console for JavaScript errors
- ✅ Ensure the component has explicit width and height
- ✅ Verify `mapbox-interop.js` is loaded

#### Compilation errors
- ✅ Add required `@using` statements
- ✅ Ensure .NET 8.0 or higher is installed
- ✅ Check that all NuGet packages are restored

#### Performance issues
- ✅ Use marker clustering for large datasets
- ✅ Implement viewport-based loading
- ✅ Disable unused features
- ✅ Use appropriate image tile size

### Console Commands

```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore

# Clean and rebuild
dotnet clean
dotnet build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies
4. Create a feature branch
5. Make your changes
6. Run tests
7. Submit a pull request

### Building from Source

```bash
# Clone repository
git clone https://github.com/yourusername/mapbox-blazor.git
cd mapbox-blazor

# Build
dotnet build

# Run tests
dotnet test

# Pack NuGet package
dotnet pack -c Release
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-party Licenses

- Mapbox GL JS is licensed under the [Mapbox Terms of Service](https://www.mapbox.com/legal/tos/)
- Icons from [Lucide](https://lucide.dev/) (MIT License)

## 🙏 Acknowledgments

- Thanks to the Mapbox team for their excellent mapping platform
- Thanks to the Blazor team at Microsoft
- Thanks to all contributors
