# Mapbox Blazor Component

A comprehensive Blazor component for integrating Mapbox GL JS into your Blazor WebAssembly and Server applications.

## 🚀 Installation

### 1. Prerequisites
- .NET 8.0 or higher
- A Mapbox account and access token

### 2. Installation via NuGet (coming soon)
```bash
dotnet add package MapboxBlazor
```

### 3. Manual Installation
1. Copy the following files to your project:
   - `Components/MapboxComponent.razor`
   - `Models/MapboxModels.cs`
   - `wwwroot/mapbox-interop.js`

2. Add references in `_Imports.razor`:
```csharp
@using YourProjectNamespace.Models
```

3. Ensure the JavaScript file is accessible:
```html
<!-- In index.html or _Host.cshtml -->
<script src="_content/MapboxBlazor/mapbox-interop.js"></script>
```

## 📋 Configuration

### Basic Configuration
```razor
<MapboxComponent @ref="mapComponent"
                 AccessToken="YOUR_MAPBOX_TOKEN"
                 Longitude="2.3522"
                 Latitude="48.8566"
                 Zoom="10"
                 Width="100%"
                 Height="500px" />
```

### Complete Configuration