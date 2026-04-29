import { useContext } from "react";
import AuthStateContext from "../contexts/AuthStateContext";

export default function useAuth() {
    return useContext(AuthStateContext);
}
