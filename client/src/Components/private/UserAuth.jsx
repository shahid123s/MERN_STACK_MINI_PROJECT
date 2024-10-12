import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const UserAuth = ({ children }) => {
    const { userId, error } = useSelector((state) => state.auth); 

    if (!userId || error?.message === 'No access token : authorization rejected' ) {
        return <Navigate to='/login' replace />;
    } else {
        return children;
    }
};

export const UserRequireAuth = ({ children }) => {
    const { userId } = useSelector((state) => state.auth); 
    if (!userId) {
        return children;
    } else {
        return <Navigate to='/home' replace />;
    }
}