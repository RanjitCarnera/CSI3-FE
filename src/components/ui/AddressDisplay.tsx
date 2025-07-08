import {Address} from "./AddressField";


interface OwnProps {
    value?: Address | null
}

export const AddressDisplay = ({value}: OwnProps) => {
    return value ? <>
        {[value.lineOne, value.city, value.state, value.postalCode].join(", ")}
    </> : null

}
