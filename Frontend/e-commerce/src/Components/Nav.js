import { useLocation } from "react-router-dom";

export const Nav = () => {
    const location = useLocation();
    const { response } = location.state 

    

    return (
        <>
            <h1>Welcome {response.id}</h1>
        </>
    );
}
