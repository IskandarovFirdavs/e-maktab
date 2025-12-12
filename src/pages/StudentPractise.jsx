import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link, useParams } from "react-router-dom";
import ApiService from "../services/api";
import { FaLocationDot } from "react-icons/fa6";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Styled components - REMOVED ALL z-index: 1
const Main = styled.div`
  width: 100%;
  padding: 20px;
  a {
    color: blue;
  }
  position: relative;
    z-index: 0; 
`;

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: relative;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 95%;
  max-width: 1200px;
  gap: 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;

  @media (max-width: 500px) {
    font-size: 15px;
  }
`;

const StatusBadge = styled.div`
  background: ${(props) => props.bgColor || "#10b981"};
  padding: 6px 15px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;

  @media (max-width: 500px) {
    font-size: 12px;
    padding: 4px 12px;
  }
`;

const ContentRow = styled.div`
  display: flex;
  gap: 20px;
  height: 350px;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const MapSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const PhotoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PhotoContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NoImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
`;

const ReportSection = styled.div`
  margin-top: 10px;
  border-top: 2px solid #e5e7eb;
  padding-top: 15px;
  position: relative;
`;

const ReportHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextAreaContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
  }
`;

const ReportText = styled.div`
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
  position: relative;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  position: relative;
`;

// Parse location string from "SRID=4326;POINT (69.2401 41.2995)" format
const parseLocation = (locationString) => {
  if (!locationString) return { lat: 41.2995, lng: 69.2401 };

  try {
    const match = locationString.match(/POINT\s*\(([^)]+)\)/);
    if (match) {
      const coords = match[1].trim().split(" ");
      if (coords.length >= 2) {
        const lng = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    }
  } catch (error) {
    console.error("Error parsing location:", error);
  }

  return { lat: 41.2995, lng: 69.2401 };
};

export default function StudentPractise({ isDark = false }) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await ApiService.getMyReport(id);

        if (!data) {
          throw new Error("Hisobot ma'lumotlari topilmadi");
        }

        setReport(data);
      } catch (err) {
        console.error("API xatosi:", err);
        setError(err.message || "Hisobot ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    } else {
      setError("Hisobot ID si ko'rsatilmagan");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Main>
        <Layout>
          <Card>
            <LoadingContainer>
              Hisobot ma'lumotlari yuklanmoqda...
            </LoadingContainer>
          </Card>
        </Layout>
      </Main>
    );
  }

  if (error || !report) {
    return (
      <Main>
        <Layout>
          <Card>
            <ErrorMessage>
              <h3>Xatolik yuz berdi</h3>
              <p>{error || "Hisobot ma'lumotlari topilmadi"}</p>
            </ErrorMessage>
          </Card>
        </Layout>
      </Main>
    );
  }

  const coordinates = parseLocation(report.location);

  return (
    <Main>
      <Layout>
        <Card>
          {/* HEADER - Hisobot # and Status */}
          <Header>
            <HeaderLeft>
              <FaLocationDot color="#3b82f6" />
              Hisobot #{report.id}
            </HeaderLeft>
            <StatusBadge bgColor="#10b98134" color="#059669">
              Topshirilgan
            </StatusBadge>
          </Header>

          {/* CONTENT ROW - Map and Photo side by side */}
          <ContentRow>
            {/* LEFT - Map */}
            <MapSection>
              <MapWrapper>
                <MapContainer
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={15}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coordinates.lat, coordinates.lng]} />
                  <Circle
                    center={[coordinates.lat, coordinates.lng]}
                    radius={500}
                    color="#10b981"
                    weight={2}
                    fillOpacity={0.1}
                  />
                </MapContainer>
              </MapWrapper>
            </MapSection>

            {/* RIGHT - Photo */}
            <PhotoSection>
              <PhotoContainer>
                {report.image ? (
                  <img
                    src={report.image}
                    alt="Hisobot rasmi"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=Rasm+yuklanmadi";
                    }}
                  />
                ) : (
                  <NoImage>
                    <div>Rasm yuklanmagan</div>
                  </NoImage>
                )}
              </PhotoContainer>
            </PhotoSection>
          </ContentRow>

          {/* REPORT TEXT SECTION */}
          <ReportSection>
            <ReportHeader>Hisobot matni:</ReportHeader>
            <TextAreaContainer>
              <ReportText>
                {report.text || "Hisobot matni kiritilmagan"}
              </ReportText>
            </TextAreaContainer>
          </ReportSection>
        </Card>
      </Layout>
    </Main>
  );
}