import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface OwnProps {
    to: string
}

export const RedirectTo = ({to}: OwnProps) => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(to)
        // eslint-disable-next-line
    }, [])

    return null
}