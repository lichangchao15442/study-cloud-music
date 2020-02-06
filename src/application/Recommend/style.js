import styled from "styled-components"

export const Content = styled.div`
    position: fixed;
    width: 100%;
    top: 90px;
    left: 0;
    bottom: ${props => props.play > 0 ? "60px" : 0};
`