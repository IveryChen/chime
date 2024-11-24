import React from "react";
import { annotate } from "rough-notation";

import Text from "../Text";

export default class AnnotatedText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.textRef = React.createRef();
    this.annotation = null;
  }

  componentDidMount() {
    if (this.props.isSelected) {
      this.showAnnotation();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSelected !== this.props.isSelected) {
      if (this.props.isSelected) {
        this.showAnnotation();
      } else {
        if (this.annotation) {
          this.annotation.remove();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.annotation) {
      this.annotation.remove();
    }
  }

  showAnnotation() {
    if (this.textRef.current) {
      this.annotation = annotate(this.textRef.current, {
        type: "circle",
        color: "black",
        padding: 10,
      });
      this.annotation.show();
    }
  }

  render() {
    const { isSelected, children, ...restProps } = this.props;
    return (
      <Text ref={this.textRef} {...restProps}>
        {children}
      </Text>
    );
  }
}
