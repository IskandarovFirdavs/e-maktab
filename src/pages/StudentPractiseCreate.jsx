import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/api.js";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useParams } from "react-router-dom";

// Fix for Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-height: 85vh;
  padding: 20px;
  box-sizing: border-box;
  z-index: 0;

  @media (max-width: 768px) {
    padding: 15px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  box-shadow: 0px 4px 20px ${(p) => p.theme.inputBorder};
  border-radius: 20px;
  padding: 30px;
  box-sizing: border-box;
  gap: 30px;

  @media (max-width: 1024px) {
    padding: 25px;
    gap: 25px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    gap: 15px;
    border-radius: 12px;
  }
`;

const Side = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px 0;
    gap: 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
    gap: 15px;
  }

  h1 {
    margin: 0 0 15px 0;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 24px;

    @media (max-width: 1024px) {
      font-size: 22px;
    }

    @media (max-width: 768px) {
      font-size: 20px;
      margin-bottom: 12px;
    }

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  h2 {
    margin: 0 0 10px 0;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 18px;

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }

  p {
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

const ImageUploadBox = styled.label`
  width: 100%;
  height: 280px;
  border-radius: 16px;
  border: 1.8px dashed #90c2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 48px;
  color: #3a8dfd;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 10px;
  border-color: ${(props) => (props.hasError ? "#ef4444" : "#90c2ff")};

  &:hover {
    background: #d9ebff51;
    border-color: ${(props) => (props.hasError ? "#ef4444" : "#3b82f6")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  input {
    display: none;
  }

  @media (max-width: 768px) {
    height: 240px;
    font-size: 42px;
  }

  @media (max-width: 480px) {
    height: 200px;
    font-size: 36px;
    border-radius: 12px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 16px;
  border: 1.6px solid #d0d7e2;
  border-radius: 12px;
  outline: none;
  resize: vertical;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
  border-color: ${(props) => (props.hasError ? "#ef4444" : "#d0d7e2")};
  background: ${(props) =>
    props.hasError ? "#fef2f2" : props.theme.inputBorder};

  &:focus {
    border-color: ${(props) => (props.hasError ? "#ef4444" : "#3b82f6")};
    box-shadow: ${(props) =>
      props.hasError ? "0 0 8px #ef444455" : "0 0 8px #3b82f655"};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    height: 120px;
    padding: 14px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    height: 100px;
    padding: 12px;
    font-size: 14px;
    border-radius: 10px;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Btn = styled.button`
  background: ${(p) => p.theme.buttonBg};
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 12px;
  transition: all 0.3s ease;
  font-family: "Poppins", sans-serif;

  &:hover {
    background: ${(p) => p.theme.buttonHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
    margin-left: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 14px;
    margin-left: 8px;
    border-radius: 8px;
    width: 100%;
    margin: 5px 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    margin-top: 15px;
  }
`;

const LocationInfo = styled.div`
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  margin: 10px 0;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 13px;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &::before {
    content: "⚠";
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &::before {
    content: "✓";
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const RequiredStar = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const PracticeDayInfo = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 5px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      min-width: 120px;
      display: inline-block;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;

    h3 {
      font-size: 15px;
    }
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 15px;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;

  &.pending {
    background: #fef3c7;
    color: #d97706;
    border: 1px solid #f59e0b40;
  }

  &.completed {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #10b98140;
  }

  &.approved {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #3b82f640;
  }

  &.rejected {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #ef444440;
  }
`;

const LocationNotice = styled.div`
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #92400e;

  strong {
    color: #78350f;
  }
`;

const getStatusDisplay = (status) => {
  switch (status) {
    case "pending":
      return "Kutilmoqda";
    case "completed":
      return "Yakunlangan";
    case "approved":
      return "Tasdiqlangan";
    case "rejected":
      return "Rad etilgan";
    default:
      return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "pending";
    case "completed":
      return "completed";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

// Helper function to parse WKT (Well-Known Text) POINT format
const parseLocation = (locationString) => {
  if (!locationString) return null;

  try {
    // Extract coordinates from "SRID=4326;POINT (69.2401 41.2995)"
    const match = locationString.match(/POINT\s*\(([^)]+)\)/);
    if (match) {
      const coords = match[1].trim().split(" ");
      if (coords.length >= 2) {
        return {
          lng: parseFloat(coords[0]),
          lat: parseFloat(coords[1]),
        };
      }
    }
  } catch (error) {
  }
  return null;
};

// Function to calculate distance between two coordinates in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

export default function Create({ onSubmissionSuccess }) {
  const { practiceDayId } = useParams(); // Get practice day ID from URL
  const [isInsideRadius, setIsInsideRadius] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [practiceDay, setPracticeDay] = useState(null); // Store the practice day
  const [practiceDayLoading, setPracticeDayLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [locationAttempted, setLocationAttempted] = useState(false);
  const navigate = useNavigate();

  // Load practice day by ID from URL
  useEffect(() => {
    async function loadPracticeDay() {
      if (!practiceDayId) {
        setErrors((prev) => ({
          ...prev,
          practiceDay: "Amaliyot kuni ID si topilmadi",
        }));
        setPracticeDayLoading(false);
        return;
      }

      try {
        setPracticeDayLoading(true);

        // Get current user
        const user = await api.getCurrentUser();
        setUserData(user);

        // Get specific practice day by ID
        const fetchedPracticeDay = await api.getPracticeDay(practiceDayId);

        if (!fetchedPracticeDay) {
          throw new Error("Amaliyot kuni topilmadi");
        }

        setPracticeDay(fetchedPracticeDay);
        setErrors((prev) => ({ ...prev, practiceDay: null }));
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          practiceDay: "Amaliyot kunini yuklashda xatolik: " + err.message,
        }));
      } finally {
        setPracticeDayLoading(false);
      }
    }

    loadPracticeDay();
  }, [practiceDayId]);

  // Get target coordinates from practice day
  const getTargetCoords = () => {
    if (!practiceDay || !practiceDay.location) {
      return null;
    }
    return parseLocation(practiceDay.location);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Rasm hajmi 5MB dan oshmasligi kerak!",
        }));
        return;
      }
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const targetCoords = getTargetCoords();

    if (!practiceDay) {
      newErrors.practiceDay = "Amaliyot kuni topilmadi";
    }

    if (!imageFile) {
      newErrors.image = "Iltimos, surat yuklang";
    }

    if (!notes.trim()) {
      newErrors.notes = "Iltimos, amaliyot haqida ma'lumot kiriting";
    }

    if (!coords.lat || !coords.lng) {
      newErrors.location =
        "Iltimos, lokatsiyangizni olish uchun 'Lokatsiyani olish' tugmasini bosing";
    }

    if (practiceDay && !targetCoords) {
      newErrors.location = "Bu amaliyot kuni uchun lokatsiya aniqlanmagan";
    }

    if (coords.lat && coords.lng && targetCoords && !isInsideRadius) {
      const distance = getDistanceFromLatLonInM(
        coords.lat,
        coords.lng,
        targetCoords.lat,
        targetCoords.lng
      );
      newErrors.radius = `Siz amaliyot joyidan ${distance.toFixed(
        0
      )} metr uzoqlikdasiz! Iltimos, amaliyot joyiga yaqinroq bo'ling.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add required fields
      formData.append("practice_day", practiceDay.id);
      formData.append("text", notes);

      // Add location in POINT format
      const locationString = `POINT(${coords.lng} ${coords.lat})`;
      formData.append("location", locationString);

      // Add image if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Submit the report
      await api.createReport(formData);

      setSuccess("Hisobotingiz muvaffaqiyatli yuborildi!");

      // Show success message for 2 seconds then navigate
      setTimeout(() => {
        if (onSubmissionSuccess) {
          onSubmissionSuccess();
        }
        navigate("/student/dashboard");
      }, 2000);
    } catch (err) {

      let errorMessage = "Hisobot yuborishda xatolik yuz berdi";
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data) {
            const data = err.response.data;
            if (data.practice_day)
              errorMessage = `Amaliyot kuni: ${data.practice_day}`;
            else if (data.text) errorMessage = `Matn: ${data.text}`;
            else if (data.location)
              errorMessage = `Lokatsiya: ${data.location}`;
            else if (data.image) errorMessage = `Rasm: ${data.image}`;
          }
        } else if (err.response.status === 403) {
          errorMessage = "Sizga hisobot yuborish uchun ruxsat yo'q";
        } else if (err.response.status === 409) {
          errorMessage = "Bugun uchun hisobot allaqachon yuborilgan";
        }
      }

      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location: "Sizning brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.",
      }));
      return;
    }

    setLocationLoading(true);
    setLocationAttempted(true);
    setErrors((prev) => ({ ...prev, location: null, radius: null }));

    // Use faster, less accurate location for better user experience
    const options = {
      enableHighAccuracy: false, // Changed to false for faster results
      timeout: 5000, // Shorter timeout
      maximumAge: 60000, // Accept cached location up to 1 minute old
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));

        setCoords({ lat, lng });
        setLocationLoading(false);

        // Get target coordinates from practice day
        const targetCoords = getTargetCoords();

        if (targetCoords) {
          // Calculate distance to the actual practice location
          const dist = getDistanceFromLatLonInM(
            lat,
            lng,
            targetCoords.lat,
            targetCoords.lng
          );

          const isInside = dist <= 500;
          setIsInsideRadius(isInside);

          if (!isInside) {
            setErrors((prev) => ({
              ...prev,
              radius: `Siz amaliyot joyidan ${dist.toFixed(
                0
              )} metr uzoqlikdasiz (500 metr chegaradan tashqarida)!`,
            }));
          }
        } else {
          // No target coordinates available, just set location
          setIsInsideRadius(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        setLocationAttempted(true);

        let errorMessage = "Lokatsiyani olishda xatolik";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Lokatsiya ruxsatini rad etdingiz. Iltimos, brauzer sozlamalaridan ruxsat bering yoki 'Lokatsiyani olish' tugmasini qayta bosing.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Lokatsiya ma'lumotlari mavjud emas. Internet aloqangizni tekshiring.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Lokatsiya olish vaqti tugadi. Iltimos, 'Lokatsiyani olish' tugmasini qayta bosing.";
            break;
          default:
            errorMessage = "Noma'lum xatolik: " + error.message;
        }

        setErrors((prev) => ({ ...prev, location: errorMessage }));
      },
      options
    );
  };

  // Custom icons for Leaflet map
  const studentIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const targetIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const targetCoords = getTargetCoords();

  // Determine map center
  const getMapCenter = () => {
    if (coords.lat && coords.lng) {
      return [coords.lat, coords.lng];
    }
    if (targetCoords) {
      return [targetCoords.lat, targetCoords.lng];
    }
    return [41.215805, 69.226242]; // Default fallback
  };

  // Show loading state while fetching practice day
  if (practiceDayLoading) {
    return (
      <Layout>
        <FormContainer>
          <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
            <LoadingSpinner />
            <p>Amaliyot kuni yuklanmoqda...</p>
          </div>
        </FormContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <FormContainer>
        {/* LEFT SIDE */}
        <Side>
          <div>
            {practiceDay ? (
              <PracticeDayInfo>
                <h3>
                  Amaliyot kuni #{practiceDay.id}
                  <StatusBadge className={getStatusClass(practiceDay.status)}>
                    {getStatusDisplay(practiceDay.status)}
                  </StatusBadge>
                </h3>
                <p>
                  <strong>Sana:</strong> {practiceDay.date}
                </p>
                <p>
                  <strong>Vazifa:</strong> {practiceDay.duty_name}
                </p>
                <p>
                  <strong>Tashkilot:</strong> {practiceDay.org_name}
                </p>
                <p>
                  <strong>Manzil:</strong>{" "}
                  {practiceDay.address || "Körsätilmegän"}
                </p>
                <p>
                  <strong>Vaqt:</strong> {practiceDay.start_time} -{" "}
                  {practiceDay.end_time}
                </p>
                {targetCoords && (
                  <p>
                    <strong>Joylashuv:</strong> {targetCoords.lat.toFixed(6)},{" "}
                    {targetCoords.lng.toFixed(6)}
                  </p>
                )}
                {practiceDay.student_data && (
                  <p>
                    <strong>Talaba:</strong>{" "}
                    {practiceDay.student_data.first_name}{" "}
                    {practiceDay.student_data.last_name}
                  </p>
                )}
              </PracticeDayInfo>
            ) : (
              <ErrorMessage>
                {errors.practiceDay || "Amaliyot kuni topilmadi"}
              </ErrorMessage>
            )}

            <h1>
              2. Suratingizni yuklang
              <RequiredStar>*</RequiredStar>
            </h1>

            <ImageUploadBox htmlFor="image-upload" hasError={errors.image}>
              {!image ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                    +
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Surat yuklash uchun bosing
                  </div>
                </div>
              ) : (
                <PreviewImg src={image} alt="Ko'rib chiqish" />
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                capture="environment"
              />
            </ImageUploadBox>

            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}

            <p>
              * Iltimos, yuklangan suratda yuzingiz aniq ko'rinishini
              tekshiring.
            </p>
          </div>
        </Side>

        {/* RIGHT SIDE */}
        <Side>
          <div>
            <h1>
              3. Amaliyot davomida bajarilgan ishlar
              <RequiredStar>*</RequiredStar>
            </h1>

            <TextArea
              placeholder="Bugungi kun davomida bajargan ishlaringizni batafsil yozing..."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (errors.notes) {
                  setErrors((prev) => ({ ...prev, notes: null }));
                }
              }}
              hasError={errors.notes}
            />

            {errors.notes && <ErrorMessage>{errors.notes}</ErrorMessage>}

            <h1>4. Lokatsiyangiz</h1>

            {!coords.lat && !locationAttempted && (
              <LocationNotice>
                <strong>Diqqat:</strong> Hisobot yuborish uchun lokatsiyangizni
                olishingiz kerak. "Lokatsiyani olish" tugmasini bosing.
              </LocationNotice>
            )}

            {coords.lat && coords.lng && targetCoords && (
              <>
                <LocationInfo>
                  <p>
                    <strong>Sizning joylashuvingiz:</strong>
                  </p>
                  <p>
                    <strong>Kenglik:</strong> {coords.lat}
                  </p>
                  <p>
                    <strong>Uzunlik:</strong> {coords.lng}
                  </p>
                  <p>
                    <strong>Amaliyot joyi:</strong>{" "}
                    {targetCoords.lat.toFixed(6)}, {targetCoords.lng.toFixed(6)}
                  </p>
                  <p>
                    <strong>Masofa:</strong>{" "}
                    {getDistanceFromLatLonInM(
                      coords.lat,
                      coords.lng,
                      targetCoords.lat,
                      targetCoords.lng
                    ).toFixed(0)}{" "}
                    metr
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {isInsideRadius
                      ? "✅ Amaliyot joyi radius ichida"
                      : "❌ Amaliyot joyidan tashqarida"}
                  </p>
                </LocationInfo>

                <MapWrapper>
                  <MapContainer
                    center={getMapCenter()}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Student location marker */}
                    <Marker
                      position={[coords.lat, coords.lng]}
                      icon={studentIcon}
                    >
                      <Popup>
                        <strong>Sizning joylashuvingiz</strong>
                        <br />
                        Kenglik: {coords.lat}
                        <br />
                        Uzunlik: {coords.lng}
                      </Popup>
                    </Marker>

                    {/* Target location marker */}
                    <Marker
                      position={[targetCoords.lat, targetCoords.lng]}
                      icon={targetIcon}
                    >
                      <Popup>
                        <strong>Amaliyot joyi</strong>
                        <br />
                        {practiceDay?.org_name || "Amaliyot joyi"}
                        <br />
                        {practiceDay?.address || ""}
                        <br />
                        Kenglik: {targetCoords.lat.toFixed(6)}
                        <br />
                        Uzunlik: {targetCoords.lng.toFixed(6)}
                      </Popup>
                    </Marker>

                    {/* 500m radius circle */}
                    <Circle
                      center={[targetCoords.lat, targetCoords.lng]}
                      radius={500}
                      pathOptions={{
                        color: isInsideRadius ? "#10b981" : "#ef4444",
                        fillColor: isInsideRadius ? "#10b981" : "#ef4444",
                        fillOpacity: 0.2,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        500 metr radius
                        <br />
                        {isInsideRadius
                          ? "Siz radius ichidasiz"
                          : "Siz radiusdan tashqaridasiz"}
                      </Popup>
                    </Circle>

                    {/* Line between student and target */}
                    <Polyline
                      positions={[
                        [coords.lat, coords.lng],
                        [targetCoords.lat, targetCoords.lng],
                      ]}
                      pathOptions={{
                        color: "#3b82f6",
                        weight: 2,
                        dashArray: "5, 10",
                      }}
                    />
                  </MapContainer>
                </MapWrapper>
              </>
            )}

            {!targetCoords && practiceDay && (
              <ErrorMessage>
                Bu amaliyot kuni uchun lokatsiya aniqlanmagan. Iltimos,
                administrator bilan bog'laning.
              </ErrorMessage>
            )}

            {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
            {errors.radius && <ErrorMessage>{errors.radius}</ErrorMessage>}
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <p>
              * Hisobot yuborish uchun amaliyot joyidan 500 metr radius ichida
              bo'lishingiz kerak.
            </p>
          </div>

          <Buttons>
            <Btn
              onClick={getLocation}
              disabled={locationLoading || loading || !practiceDay}
              style={{
                cursor:
                  locationLoading || loading || !practiceDay
                    ? "not-allowed"
                    : "pointer",
                opacity: locationLoading || loading || !practiceDay ? 0.7 : 1,
              }}
            >
              {locationLoading ? (
                <>
                  <LoadingSpinner />
                  Lokatsiya olinmoqda...
                </>
              ) : (
                "Lokatsiyani olish"
              )}
            </Btn>
            <Btn
              onClick={handleSubmit}
              disabled={
                loading ||
                locationLoading ||
                !practiceDay ||
                !targetCoords ||
                !coords.lat
              }
              style={{
                cursor:
                  !loading &&
                  !locationLoading &&
                  practiceDay &&
                  targetCoords &&
                  coords.lat
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  !loading &&
                  !locationLoading &&
                  practiceDay &&
                  targetCoords &&
                  coords.lat
                    ? 1
                    : 0.5,
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Yuborilmoqda...
                </>
              ) : (
                "Hisobotni jo'natish"
              )}
            </Btn>
          </Buttons>
        </Side>
      </FormContainer>
    </Layout>
  );
}
