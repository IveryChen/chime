import styled from "@emotion/styled";
import React from "react";
import { compose, system, typography } from "styled-system";

import Box from "../Box";

const letterSpacing = system({ letterSpacing: true });
const textDecoration = system({ textDecoration: true });
const textOverflow = system({ textOverflow: true });
const textTransform = system({ textTransform: true });
const whiteSpace = system({ whiteSpace: true });
const wordBreak = system({ wordBreak: true });

const truncateProps = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const Text = styled(Box)(
  compose(
    letterSpacing,
    textDecoration,
    textOverflow,
    textTransform,
    typography,
    whiteSpace,
    wordBreak
  ),
  (props) => {
    const config = [
      props.ss03 && "'ss03'",
      props.ss05 && "'ss05'",
      props.ss06 && "'ss06'",
      props.cv01 && "'cv01'",
      props.cv02 && "'cv02'",
      props.cv03 && "'cv03'",
      props.cv04 && "'cv04'",
      props.cv05 && "'cv05'",
      props.cv06 && "'cv06'",
      props.cv07 && "'cv07'",
      props.cv08 && "'cv08'",
      props.cv09 && "'cv09'",
      props.cv10 && "'cv10'",
      props.cv11 && "'cv11'",
      props.cv12 && "'cv12'",
      props.cv13 && "'cv13'",
      props.zero && "'zero'",
      props.tnum && "'tnum'",
      props.dlig && "'dlig'",
    ]
      .filter(Boolean)
      .join(",");

    const result = {};

    if (config) {
      result.fontFeatureSettings = config;
    }

    if (props.truncate) {
      return { ...truncateProps, ...result };
    }

    return result;
  }
);

function render(props, ref) {
  return (
    <Text
      color="gray.0"
      fontSize="14px"
      fontWeight={600}
      lineHeight={1.5}
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(render);
