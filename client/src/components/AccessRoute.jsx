import { useSelector } from "react-redux";
import { Outlet, Navigate, useParams } from "react-router-dom";

export default function AccessRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const checkAccess = (userId, sensorId) => {
    return userId === sensorId;
  };

  const accessAllowed = checkAccess(currentUser._id, id);

  return accessAllowed ? <Outlet /> : <Navigate to="/unknown" />;
}
