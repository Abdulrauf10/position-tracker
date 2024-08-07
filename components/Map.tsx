import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  Marker,
  Popup,
  Polygon,
  Tooltip
} from "react-leaflet"
import { LatLng, LatLngBounds, LatLngTuple } from "leaflet"
import L from "leaflet"
import * as turf from "@turf/turf"
import "leaflet/dist/leaflet.css"
import "./Map.css"

const imageUrl = "/image/campus_sim.png"

const imageWidth = 1629
const imageHeight = 1245

// Coordinates from Google Maps
const centerLat = 1.300364802547795
const centerLng = 103.78020277662293

const latPixelRatio = 0.000002
const lngPixelRatio = 0.000002

const offsetLat = (imageHeight / 2) * latPixelRatio
const offsetLng = (imageWidth / 2) * lngPixelRatio

const bottomLeftLat = centerLat - offsetLat
const bottomLeftLng = centerLng - offsetLng
const topRightLat = centerLat + offsetLat
const topRightLng = centerLng + offsetLng

const imageBounds = new LatLngBounds(
  new LatLng(bottomLeftLat, bottomLeftLng), // Southwest corner
  new LatLng(topRightLat, topRightLng) // Northeast corner
)

const pixelToLatLng = (
  x: number,
  y: number,
  imageBounds: LatLngBounds,
  imageWidth: number,
  imageHeight: number
): LatLngTuple => {
  const southWest = imageBounds?.getSouthWest()
  const northEast = imageBounds?.getNorthEast()

  const southWestLat = southWest.lat
  const southWestLng = southWest.lng
  const northEastLat = northEast.lat
  const northEastLng = northEast.lng

  // Calculate latitude and longitude based on pixel position
  const lat =
    southWestLat + (northEastLat - southWestLat) * (1 - y / imageHeight)
  const lng = southWestLng + (northEastLng - southWestLng) * (x / imageWidth)

  return [lat, lng] as LatLngTuple
}

const Map: React.FC = () => {
  const robots = [
    { id: "001", x: 406, y: 334, heading: 0 },
    { id: "002", x: 1101, y: 613, heading: 60 },
    { id: "003", x: 922, y: 946, heading: 240 },
    { id: "004", x: 863, y: 324, heading: 330 }
  ]

  // Convert robot positions to LatLng based on image overlay
  const robotPositions = robots.map((robot) => {
    const [lat, lng] = pixelToLatLng(
      robot.x,
      robot.y,
      imageBounds,
      imageWidth,
      imageHeight
    )
    return { ...robot, lat, lng }
  })

  const customIcon = new L.Icon({
    iconUrl: "/image/location.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  const polygonCoords: [number, number][] = [
    [bottomLeftLat, bottomLeftLng],
    [bottomLeftLat, topRightLng],
    [topRightLat, topRightLng],
    [topRightLat, bottomLeftLng],
    [bottomLeftLat, bottomLeftLng]
  ]

  const polygonLatLngs: L.LatLngTuple[] = polygonCoords.map(([lat, lng]) => [
    lat,
    lng
  ])

  const polygon = turf?.polygon([polygonCoords])
  const area = turf?.area(polygon) // in square meters
  const perimeter = turf?.length(polygon, { units: "kilometers" })

  return (
    <>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={18}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* <ImageOverlay
          url={imageUrl}
          bounds={imageBounds}
          className="custom-image-overlay"
        /> */}

        <Polygon positions={polygonLatLngs} color="blue" opacity={0.5}>
          <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            Area: {(area / 1e6)?.toFixed(2)} km²
            <br />
            Perimeter: {perimeter?.toFixed(2)} km
          </Tooltip>
        </Polygon>

        {robotPositions?.map((robot) => (
          <Marker
            key={robot.id}
            position={[robot.lat, robot.lng]}
            icon={customIcon}
          >
            <Popup>
              Robot: {robot.id}
              <br />
              Heading: {robot.heading}°<br />
              Position: ({robot.x}px, {robot.y}px) <br />
              Latitude: {robot.lat} <br />
              Longtitude: {robot.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default Map
