import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";


export const AdminAuth = ({ children }) => {
    const { adminId, error } = useSelector(state => state.adminAuth);
    const navigate = useNavigate()

    if (!adminId) {
        return (<Navigate to={'/admin/login'} replace ></Navigate>)
    }
    else {
        return (<>
            {children}
        </>)
    }
}


export const AdminRequireAuth = ({ children }) => {
    const { adminId } = useSelector(state => state.adminAuth);

    if (adminId) {
        return (
            <Navigate to={'/admin/home'} replace />
        )
    }
    else {
        return children;
    }
}
