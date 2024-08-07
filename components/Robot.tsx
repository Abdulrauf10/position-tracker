import { Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface RobotProps {
  position: LatLngTuple;
  heading: number; 
}

const Robot: React.FC<RobotProps> = ({ position, heading }) => (
  <Marker position={position}>
    <Popup>
      Robot heading: {heading}°<br />
      Position: {position[0]}, {position[1]}
    </Popup>
  </Marker>
);

export default Robot;
