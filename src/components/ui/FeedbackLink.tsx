import {TkButton} from "./TkButton";

interface OwnProps {
    className?: string
}

export const FeedbackLink = ({className}: OwnProps) => {
    return <a
        className={className}
        href="mailto:teambuilder@constructionintelligence.com"
    >
        <TkButton
            icon="pi pi-envelope"
            label="Feedback"
        />
    </a>

}