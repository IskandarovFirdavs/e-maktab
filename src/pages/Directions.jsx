import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { lightTheme, darkTheme } from "../styles/theme.js";
import { FaBuilding } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

const colorFlow = keyframes`
  0% {
    background-position: -100% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: -100% 0%;
  }
`;

const DashboardContainer = styled.div`
  color: ${(p) => p.theme.text};
  padding: 30px 50px;
  transition: all 0.3s ease;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(66, 153, 225, 0.15) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: ${colorFlow} 4s linear infinite;
  margin-top: -3px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4299e1, transparent);
    background-size: 200% 100%;
    animation: ${colorFlow} 2s linear infinite;
  }

  @media (max-width: 1024px) {
    padding: 25px 30px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const CellIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: ${(props) => props.bgColor || "#f59e0b"};
  color: white;
  flex-shrink: 0;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0px;
  font-size: 26px;
  font-weight: 600;
  color: ${(props) => props.theme.text};

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const DirectionsSection = styled.div`
  background-color: ${(props) => props.theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px ${(props) => props.theme.cardShadow};

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    border-radius: 6px;
  }
`;

const HeaderRow = styled.div`
  padding: 0px 30px 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.inputBorder};

  @media (max-width: 768px) {
    padding: 0px 20px 10px 20px;
  }

  @media (max-width: 480px) {
    padding: 0px 10px 8px 10px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const Counter = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.text};

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const DirectionRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.inputBorder};
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background-color: #64646444;
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    margin: 8px 0;
    border: 1px solid ${(props) => props.theme.inputBorder};
    border-radius: 6px;
  }
`;

const DirectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px 0;
`;

const DirectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const DirectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8b5cf6;
  color: white;
  font-size: 18px;
`;

const DirectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DirectionName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const DirectionMeta = styled.span`
  font-size: 13px;
  opacity: 0.7;
  color: ${(props) => props.theme.text};
`;

const GroupsContainer = styled.div`
  margin-top: 15px;
  padding-left: 55px;
  display: ${(props) => (props.isOpen ? "block" : "none")};

  @media (max-width: 480px) {
    padding-left: 20px;
  }
`;

const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  margin: 8px 0;
  border-radius: 6px;
  background-color: ${(props) => props.theme.statCard};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #64646444;
    transform: translateX(5px);
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 12px;
  }
`;

const GroupIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3b82f6;
  color: white;
  font-size: 14px;
`;

const GroupContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

const GroupName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const GroupStats = styled.span`
  font-size: 12px;
  opacity: 0.7;
  color: ${(props) => props.theme.text};
`;

const ChevronIcon = styled.div`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  color: ${(props) => props.theme.text};
  opacity: 0.7;
`;

const CellContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    gap: 2px;
    width: 100%;
  }
`;

const CellLabel = styled.span`
  font-size: 13px;
  opacity: 0.7;
  display: block;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const CellValue = styled.span`
  font-weight: 600;
  display: block;
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    word-break: break-word;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: ${(props) => props.theme.text};
  padding: 8px 0;

  @media (max-width: 860px) {
    gap: 10px;
    font-size: 14px;
    display: none;
  }

  @media (max-width: 480px) {
    gap: 8px;
    font-size: 13px;
  }
`;

export default function Directions({ isDark = false }) {
  const { id } = useParams();
  const departmentId = id;

  const theme = isDark ? darkTheme : lightTheme;
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedTheme === "dark" && !isDark && onThemeChange) {
      onThemeChange(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredTheme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (!departmentId) return;
    let aborded = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getDepartment(departmentId, {
          signal: controller.signal,
        });
        if (!aborded) setDepartment(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        if (!aborded) setError(err.message || String(err));
      } finally {
        if (!aborded) setLoading(false);
      }
    }
    load();
    return () => {
      aborded = true;
      controller.abort();
    };
  }, [departmentId]);

  // render
  if (!departmentId) return <div className="p-4">No id provided .</div>;
  if (loading) return <div className="p-4">Loading . .</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!department)
    return <div className="p-4">No data found for id: {departmentId}</div>;

  return (
    <DashboardContainer>
      {/* Directions Section */}
      <DirectionsSection>
        <HeaderRow>
          <SectionTitle>{department.abbr} kafedra yo'nalishlari</SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "100%",
            }}
          >
            <Counter>{department.directions?.length || 0} ta yo'nalish</Counter>
          </div>
        </HeaderRow>

        {department.directions?.length === 0 && (
          <div style={{ padding: "20px", color: theme.text }}>
            Hozircha yo'nalishlar mavjud emas.
          </div>
        )}
        {department.directions?.map((dir) => (
          <DirectionRow
            key={dir.id}
            onClick={() => navigate(`/direction/${dir.id}`)}
          >
            <TableCell>
              <CellIcon bgColor="#3B82F6">
                <FaBuilding />
              </CellIcon>

              <CellContent>
                <CellLabel>Yo'nalish</CellLabel>
                <CellValue>{dir.name}</CellValue>{" "}
                <CellLabel>{dir.abbr}</CellLabel>
              </CellContent>
            </TableCell>
          </DirectionRow>
        ))}
      </DirectionsSection>
    </DashboardContainer>
  );
}
