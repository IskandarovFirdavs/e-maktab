import React from "react";
import styled, { keyframes } from "styled-components";
import Snowfall from "react-snowfall";

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: relative;
  overflow-x: hidden;

  /* Theme-based background and text colors */
  background: ${({ $dark, theme }) =>
    $dark ? theme.bg || "#0F172A" : theme.bg || "#ffffff"};

  color: ${({ $dark, theme }) =>
    $dark ? theme.text || "#F8FAFC" : theme.text || "#0F172A"};

  transition: background 0.5s ease, color 0.3s ease;

  /* Gradient overlay - adaptive based on theme */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $dark }) =>
          $dark ? "rgba(66, 153, 225, 0.15)" : "rgba(66, 153, 225, 0.05)"}
        50%,
      transparent 100%
    );
    background-size: 400% 400%;
    animation: ${gradient} 8s ease infinite;
    z-index: 0;
    opacity: ${({ $dark }) => ($dark ? 0.8 : 0.4)};
    transition: opacity 0.5s ease;
  }

  /* Content stays on top of gradient */
  > * {
    position: relative;
    z-index: 2;
  }
`;

export default function WeatherBackground({ children, dark = false }) {
  return (
    <AppWrapper $dark={dark}>
      {/* React Snowfall - qor yogishi */}
      <Snowfall
        // Theme-based snow settings
        snowflakeCount={dark ? 150 : 80}
        speed={dark ? [1, 3] : [0.5, 2]}
        wind={dark ? [-0.5, 2] : [-0.3, 1]}
        radius={dark ? [0.5, 4] : [0.5, 2.5]}
        opacity={dark ? [0.3, 0.9] : [0.2, 0.6]}
        // Qor ranglari
        color={dark ? "#E2E8F0" : "#90CDF4"}
        // Styling
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
        }}
        // Qo'shimcha effektlar
        rotationSpeed={[-0.5, 0.5]}
        changeFrequency={dark ? 100 : 200}
      />

      {/* Asosiy kontent */}
      {children}
    </AppWrapper>
  );
}
