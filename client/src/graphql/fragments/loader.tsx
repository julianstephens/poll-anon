import { styled, css } from "twin.macro"
import { ReactComponent as LoadIcon } from "@assets/loader.svg";

const Loader = styled(LoadIcon)`
    ${css`
        svg {
            width: 100px;
        height: 100px;
            margin: 10px;
        display:inline-block;
        }
        .cls-1,.cls-2 {
            fill:none;
            stroke-linecap:bevel;
            stroke-linejoin:round;
        }
        .cls-1 {
            stroke-width:2px;
        }
        .cls-2 {
            fill:none;
            stroke:#fff;
            stroke-width:4px;
        }
    `}
`;

export default Loader;