import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import React from "react";
import {
  background,
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  system,
} from "styled-system";

const appearance = system({ appearace: true });
const aspectRatio = system({ aspectRatio: true });
const boxSizing = system({ boxSizing: true });
const cursor = system({ cursor: true });
const filter = system({ filter: true });
const gap = system({ gap: true });
const objectFit = system({ objectFit: true });
const objectPosition = system({ objectPosition: true });
const opacity = system({ opacity: true });
const outline = system({ outline: true });
const overflow = system({ overflow: true });
const pointerEvents = system({ pointerEvents: true });
const resize = system({ resize: true });
const transform = system({ transform: true });
const transformOrigin = system({ transformOrigin: true });
const transition = system({ transition: true });
const userSelect = system({ userSelect: true });
const visibility = system({ visibility: true });
const willChange = system({ willChange: true });

const Box = styled("div", { shouldForwardProp })(
  compose(
    appearance,
    aspectRatio,
    background,
    border,
    boxSizing,
    color,
    cursor,
    filter,
    flexbox,
    gap,
    grid,
    layout,
    objectFit,
    objectPosition,
    opacity,
    outline,
    overflow,
    pointerEvents,
    position,
    resize,
    shadow,
    space,
    transform,
    transformOrigin,
    transition,
    userSelect,
    visibility,
    willChange
  )
);

function render(props, ref) {
  return <Box boxSizing="border-box" minWidth={0} ref={ref} {...props} />;
}

export default React.forwardRef(render);
