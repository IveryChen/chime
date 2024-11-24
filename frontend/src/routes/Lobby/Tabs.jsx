import styled from "@emotion/styled";
import { List, Trigger } from "@radix-ui/react-tabs";
import React from "react";

import AnnotatedText from "../../components/AnnotatedText";
import Box from "../../components/Box";

const StyledTrigger = styled(Trigger)`
  all: unset;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  &[data-state="active"] {
    all: unset;
    color: red;
  }

  &[data-state="inactive"] {
    all: unset;
  }

  &:hover {
  }
`;

export default class Tabs extends React.PureComponent {
  render() {
    const { tab } = this.props;

    return (
      <Box display="grid" gap="24px">
        <List>
          <Box display="flex" gap="24px" justifyContent="center">
            <StyledTrigger value="join">
              <AnnotatedText
                isSelected={tab === "join"}
                color={tab === "join" ? "black" : "#806B01"}
                fontFamily="Bebas Neue"
                fontSize="24px"
                pointer="cursor"
              >
                JOIN
              </AnnotatedText>
            </StyledTrigger>
            <StyledTrigger value="create">
              <AnnotatedText
                isSelected={tab === "create"}
                color={tab === "create" ? "black" : "#806B01"}
                fontFamily="Bebas Neue"
                fontSize="24px"
                pointer="cursor"
              >
                CREATE
              </AnnotatedText>
            </StyledTrigger>
          </Box>
        </List>
      </Box>
    );
  }
}
