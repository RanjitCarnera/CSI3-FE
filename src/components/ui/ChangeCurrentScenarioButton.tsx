import {TkButtonLink} from "./TkButtonLink";
import {useNavigate} from "react-router-dom";

export const LOCAL_STORAGE_KEY_CURRENT_SCENARIO = "currentScenario";

interface OwnProps {
    scenarioId: string
}

export const ChangeCurrentScenarioButton = ({scenarioId}: OwnProps) => {
    const navigate = useNavigate();

    return <TkButtonLink
        className="ml-2"
        label={"Go to scenario"} onClick={() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_SCENARIO, scenarioId)
        navigate(`/scenarios/${scenarioId}/project-view`)
    }}/>
}
