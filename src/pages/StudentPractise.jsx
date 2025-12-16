import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link, useParams } from "react-router-dom";
import {
  FaLocationDot,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaClock,
} from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import api from "../services/api";

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

// Styled components
const Main = styled.div`
  width: 100%;
  padding: 20px;
  position: relative;
  z-index: 0;

  a {
    text-decoration: none;
    color: #3b82f6;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Breadcrumb = styled.div`
  width: 100%;
  max-width: 1200px;
  text-align: left;
  margin-bottom: 20px;
  font-size: 14px;
  margin: 0 auto 20px;
`;

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 95%;
  max-width: 1200px;
  gap: 25px;
  position: relative;
  background-color: ${(props) => props.theme.cardBg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
  flex-wrap: wrap;
  gap: 15px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const StatusBadge = styled.div`
  background: ${(props) => {
    switch (props.status) {
      case "success":
      case "approved":
        return "#d1fae5";
      case "pending":
        return "#fef3c7";
      case "rejected":
        return "#fee2e2";
      case "completed":
        return "#dbeafe";
      case "no_permission":
        return "#f3f4f6";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#065f46";
      case "pending":
        return "#92400e";
      case "rejected":
        return "#991b1b";
      case "no_permission":
        return "#374151";
      default:
        return "#374151";
    }
  }};
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid currentColor;
  opacity: 0.8;

  @media (max-width: 500px) {
    font-size: 12px;
    padding: 6px 15px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const InfoCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.5;
`;

const InfoIcon = styled.div`
  font-size: 18px;
  margin-top: 2px;
  flex-shrink: 0;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  min-width: 120px;
`;

const InfoValue = styled.span`
  flex: 1;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 30px;
  min-height: 400px;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const MapSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 300px;
`;

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
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
  min-height: 300px;
`;

const PhotoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const PhotoContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-height: 100%;
  }
`;

const NoImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  gap: 10px;
`;

const ReportSection = styled.div`
  margin-top: 10px;
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
  position: relative;
`;

const ReportHeader = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TextAreaContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a1a1a1;
    }
  }
`;

const ReportText = styled.div`
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  margin: 20px 0;
  border: 1px solid #fecaca;
  position: relative;

  h3 {
    margin-bottom: 10px;
    font-size: 18px;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 16px;
  position: relative;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.success {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }
  }

  &.reject {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }
  }

  &.pending {
    background: #f59e0b;
    color: white;

    &:hover {
      background: #d97706;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

// Get status display text
const getStatusDisplay = (status) => {
  switch (status) {
    case "success":
      return "Tasdiqlangan";
    case "pending":
      return "Kutilmoqda";
    case "rejected":
      return "Rad etilgan";
    case "no_permission":
      return "Ruxsat yo'q";
    default:
      return status;
  }
};

// Check if user can update status
const canUpdateStatus = (userRole, reportStatus) => {
  // Only teachers/admins can update status
  const allowedRoles = ["teacher", "admin", "dekan", "rector"];
  if (!allowedRoles.includes(userRole)) return false;

  // Only pending or completed reports can be updated
  return ["pending", "completed"].includes(reportStatus);
};

export default function StudentPractise() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState("student"); // Default role

  useEffect(() => {
    fetchReport();
    fetchCurrentUser();
  }, [id]);

  // Fetch current user to get role
  const fetchCurrentUser = async () => {
    try {
      const user = await api.getCurrentUser();
      setUserRole(user.role || "student");
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;

      // Check what type of ID we have - report ID or practice day ID
      // First try to get as a report
      try {
        if (api.getMyReport) {
          data = await api.getMyReport(id);
        } else {
          throw new Error("getMyReport method not available");
        }
      } catch (reportError) {
        console.log("Not a report, trying practice day...", reportError);

        // If not a report, try as practice day
        try {
          if (api.getPracticeDay) {
            data = await api.getPracticeDay(id);
            // Convert practice day to report format if needed
            if (data && !data.practice_day) {
              data = {
                ...data,
                practice_day: data,
                id: data.id,
                text: data.duty_name || data.target || "",
                location: data.location,
                status: data.status || "pending",
                created_at: data.created_at,
                // Try to extract image from nested data if available
                image:
                  data.image || (data.student_data && data.student_data.image),
              };
            }
          } else {
            throw new Error("getPracticeDay method not available");
          }
        } catch (practiceError) {
          console.log("Not a practice day either...", practiceError);

          // Last resort: try to get from practice days list
          try {
            const practiceDays = await api.getPracticeDays();
            const practiceDay = practiceDays.find(
              (pd) => pd.id === parseInt(id)
            );
            if (practiceDay) {
              data = {
                ...practiceDay,
                practice_day: practiceDay,
                id: practiceDay.id,
                text: practiceDay.duty_name || practiceDay.target || "",
                location: practiceDay.location,
                status: practiceDay.status || "pending",
                created_at: practiceDay.created_at,
              };
            } else {
              throw new Error("Hisobot yoki amaliyot kuni topilmadi");
            }
          } catch (listError) {
            throw new Error("Hisobot ma'lumotlarini yuklab bo'lmadi");
          }
        }
      }

      if (!data) {
        throw new Error("Ma'lumotlar topilmadi");
      }

      console.log("Loaded data:", data);
      setReport(data);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      setError(err.message || "Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!canUpdateStatus(userRole, report.status)) {
      alert("Sizga statusni o'zgartirish ruxsati yo'q");
      return;
    }

    try {
      setUpdating(true);

      // Check if it's a practice day (not a report)
      const isPracticeDay = report && report.practice_day && !report.id;
      const targetId = isPracticeDay ? report.practice_day.id : report.id;

      let response;

      if (isPracticeDay) {
        // Update practice day status
        response = await api.partialUpdatePracticeDay(targetId, {
          status: newStatus,
        });
      } else {
        // Try to update report status
        try {
          response = await api.updateReport(targetId, { status: newStatus });
        } catch (reportError) {
          console.log(
            "Cannot update report, trying practice day...",
            reportError
          );
          // If report update fails, try practice day
          const practiceDayId = report.practice_day?.id;
          if (practiceDayId) {
            response = await api.partialUpdatePracticeDay(practiceDayId, {
              status: newStatus,
            });
          } else {
            throw new Error("Statusni yangilash mumkin emas");
          }
        }
      }

      if (response) {
        // Update local state
        setReport((prev) => ({
          ...prev,
          status: newStatus,
          practice_day: prev.practice_day
            ? {
                ...prev.practice_day,
                status: newStatus,
              }
            : prev.practice_day,
        }));

        alert(`Status "${getStatusDisplay(newStatus)}" ga o'zgartirildi`);
      }
    } catch (err) {
      console.error("Statusni yangilashda xatolik:", err);
      alert(`Statusni yangilashda xatolik: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Main>
        <Layout>
          <Card>
            <LoadingContainer>Ma'lumotlar yuklanmoqda...</LoadingContainer>
          </Card>
        </Layout>
      </Main>
    );
  }

  if (error || !report) {
    return (
      <Main>
        <Breadcrumb>
          <Link to="/home">Bosh sahifa</Link> / <strong>Xatolik</strong>
        </Breadcrumb>
        <Layout>
          <Card>
            <ErrorMessage>
              <h3>Xatolik yuz berdi</h3>
              <p>{error || "Ma'lumotlar topilmadi"}</p>
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={fetchReport}
                  style={{
                    padding: "8px 16px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Qayta yuklash
                </button>
                <button
                  onClick={() => window.history.back()}
                  style={{
                    padding: "8px 16px",
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Orqaga qaytish
                </button>
              </div>
            </ErrorMessage>
          </Card>
        </Layout>
      </Main>
    );
  }

  const coordinates = parseLocation(report.location);
  const practiceDay = report.practice_day || report;
  const studentData = practiceDay.student_data || {};
  const teacherData = practiceDay.teacher || {};
  const isPracticeDayView = !report.id && practiceDay.id; // Check if we're viewing a practice day

  return (
    <Main>
      <Layout>
        <Card>
          {/* HEADER */}
          <Header>
            <HeaderLeft>
              <FaLocationDot color="#3b82f6" size={24} />
              {isPracticeDayView
                ? `Amaliyot kuni #${practiceDay.id}`
                : `Hisobot #${report.id}`}
            </HeaderLeft>
            <StatusBadge status={report.status}>
              {getStatusDisplay(report.status)}
            </StatusBadge>
          </Header>

          {/* CONTENT ROW - Map and Photo side by side */}
          <ContentRow>
            {/* LEFT - Map */}
            {coordinates && (
              <MapSection>
                <MapHeader>
                  <FaLocationDot color="#3b82f6" />
                  Lokatsiya
                </MapHeader>
                <MapWrapper>
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[coordinates.lat, coordinates.lng]}
                      icon={customIcon}
                    >
                      <Popup>
                        <strong>Joylashuv</strong>
                        <br />
                        Kenglik: {coordinates.lat.toFixed(6)}
                        <br />
                        Uzunlik: {coordinates.lng.toFixed(6)}
                      </Popup>
                    </Marker>
                    <Circle
                      center={[coordinates.lat, coordinates.lng]}
                      radius={500}
                      pathOptions={{
                        color: "#3b82f6",
                        weight: 2,
                        fillColor: "#3b82f6",
                        fillOpacity: 0.1,
                      }}
                    />
                  </MapContainer>
                </MapWrapper>
              </MapSection>
            )}

            {/* RIGHT - Photo */}
            <PhotoSection>
              <PhotoHeader>
                <FaFileAlt color="#3b82f6" />
                {isPracticeDayView ? "Amaliyot kuni" : "Hisobot rasmi"}
              </PhotoHeader>
              <PhotoContainer>
                {/* Try multiple possible image field names */}
                {report.image || report.photo || report.image_url ? (
                  <img
                    src={report.image || report.photo || report.image_url}
                    alt="Hisobot rasmi"
                    onError={(e) => {
                      e.target.onerror = null;
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
            <ReportHeader>
              <FaFileAlt color="#3b82f6" />
              {isPracticeDayView ? "Amaliyot vazifasi" : "Hisobot matni"}
            </ReportHeader>
            <TextAreaContainer>
              <ReportText>
                {report.text ||
                  practiceDay.duty_name ||
                  practiceDay.target ||
                  "Ma'lumot kiritilmagan"}
              </ReportText>
            </TextAreaContainer>
          </ReportSection>

          {/* ACTION BUTTONS FOR TEACHERS/ADMINS */}
          {canUpdateStatus(userRole, report.status) && (
            <ActionButtons>
              <ActionButton
                className="success"
                onClick={() => updateStatus("approved")}
                disabled={updating || report.status === "approved"}
              >
                {updating ? "Jarayonda..." : "Tasdiqlash"}
              </ActionButton>

              <ActionButton
                className="reject"
                onClick={() => updateStatus("rejected")}
                disabled={updating || report.status === "rejected"}
              >
                {updating ? "Jarayonda..." : "Rad etish"}
              </ActionButton>

              {report.status === "pending" && (
                <ActionButton
                  className="pending"
                  onClick={() => updateStatus("completed")}
                  disabled={updating}
                >
                  {updating ? "Jarayonda..." : "Yakunlash"}
                </ActionButton>
              )}
            </ActionButtons>
          )}
        </Card>
      </Layout>
    </Main>
  );
}
