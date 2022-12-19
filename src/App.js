import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import sunImg from "./textures/sun.jpg";
import mercuryImg from "./textures/mercury.jpg";
import venusImg from "./textures/venus.jpg";
import earthImg from "./textures/earth.jpg";
import marsImg from "./textures/mars.jpg";
import jupiterImg from "./textures/jupiter.jpg";
import saturnImg from "./textures/saturn.jpg";
import uranusImg from "./textures/uranus.jpg";
import neptuneImg from "./textures/neptune.jpg";
import spaceBackgroundImg from "./textures/stars.jpg";

const distanceUnit = 0.0000001;

export default function App() {
  const radiusUnit = 0.00005;
  const minifySizeUnit = 0.15;
  const minifydistanceUnit = 0.6;

  const [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune] =
    useLoader(THREE.TextureLoader, [
      mercuryImg,
      venusImg,
      earthImg,
      marsImg,
      jupiterImg,
      saturnImg,
      uranusImg,
      neptuneImg,
    ]);

  return (
    <>
      <Canvas camera={{ position: [0, 30, -80], fov: 40 }}>
        <Space/>
        <Sun />
        {/* Mercury */}
        <Planet
          planet={{
            texTure: mercury,
            xRadius: 579e5,
            zRadius: 579e5,
            size: (4878 / 2) * radiusUnit,
            orbitalPeriod: 0.24*365,
            rotationPeriod: 58.65
          }}
        />
        {/* Venus */}
        <Planet
          planet={{
            texTure: venus,
            xRadius: 1082e5,
            zRadius: 1082e5,
            size: (12104 / 2) * radiusUnit,
            orbitalPeriod: 0.62*365,
            rotationPeriod: 243
          }}
        />
        {/* Earth */}
        <Planet
          planet={{
            texTure: earth,
            xRadius: 1496e5,
            zRadius: 1496e5,
            size: (12756 / 2) * radiusUnit,
            orbitalPeriod: 1*365,
            rotationPeriod: 1
          }}
        />
        {/* Mars */}
        <Planet
          planet={{
            texTure: mars,
            xRadius: 2279e5,
            zRadius: 2279e5,
            size: (6787 / 2) * radiusUnit,
            orbitalPeriod: 1.88*365,
            rotationPeriod: 1.03
          }}
        />
        {/* Jupiter */}
        <Planet
          planet={{
            texTure: jupiter,
            xRadius: 7783e5 * minifydistanceUnit,
            zRadius: 7783e5 * minifydistanceUnit,
            size: (1427960 / 2) * radiusUnit * minifySizeUnit,
            orbitalPeriod: 11.86*365,
            rotationPeriod: 0.41
          }}
        />
        {/* Saturn */}
        <Planet
          planet={{
            texTure: saturn,
            xRadius: 1427e6 * minifydistanceUnit,
            zRadius: 1427e6 * minifydistanceUnit,
            size: (120660 / 2) * radiusUnit,
            orbitalPeriod: 29.46*365,
            rotationPeriod: 0.44
          }}
        />
        {/* Uranus */}
        <Planet
          planet={{
            texTure: uranus,
            xRadius: 2871e6 * minifydistanceUnit,
            zRadius: 2871e6 * minifydistanceUnit,
            size: (51118 / 2) * radiusUnit,
            orbitalPeriod: 84.01*365,
            rotationPeriod: 0.72
          }}
        />
        {/* Neptune */}
        <Planet
          planet={{
            texTure: neptune,
            xRadius: 44971e5 * minifydistanceUnit,
            zRadius: 44971e5 * minifydistanceUnit,
            size: (48600 / 2) * radiusUnit,
            orbitalPeriod: 164.8*365,
            rotationPeriod: 0.72
          }}
        />
        <Lights />
        <OrbitControls />
      </Canvas>
    </>
  );
}
function Sun() {
  const [sun] = useLoader(THREE.TextureLoader, [sunImg]);
  const sunRef = React.useRef();
  useFrame(() => {
    sunRef.current.rotation.y += 0.15;
  });
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial map={sun} />
    </mesh>
  );
}

function Space() {
  const [spaceBackgroun] = useLoader(THREE.TextureLoader, [spaceBackgroundImg]);
  const sunRef = React.useRef();
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[300, 50, 50]} />
      <meshStandardMaterial side={THREE.BackSide} map={spaceBackgroun} />
    </mesh>
  );
}

// eslint-disable-next-line react/prop-types
function Planet({ planet: { texTure, xRadius, zRadius, size, orbitalPeriod, rotationPeriod } }) {
  const planetRef = React.useRef();
  xRadius = distanceUnit * xRadius ;
  zRadius = distanceUnit * zRadius ;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() / (orbitalPeriod * 0.001);
    const x = xRadius * Math.sin(t);
    const z = zRadius * Math.cos(t);
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    planetRef.current.rotation.y += (0.1 / rotationPeriod);
  });
  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texTure} />
      </mesh>
      <Ecliptic xRadius={xRadius} zRadius={zRadius} />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
    </>
  );
}

// eslint-disable-next-line no-unused-vars, react/prop-types
function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  points.push(points[0]);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={10} />
    </line>
  );
}
