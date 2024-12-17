import React from "react";

export default class FontLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
    };
  }

  componentDidMount() {
    const bebasNeue = new FontFace(
      "Bebas Neue",
      "url(https://fonts.gstatic.com/s/bebasneue/v10/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2)"
    );

    // Load multiple Oswald weights
    const oswaldFonts = [
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2)",
        { weight: "200" }
      ),
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs169vsUZiZQ.woff2)",
        { weight: "300" }
      ),
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2)",
        { weight: "400" }
      ),
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs18NvsUZiZQ.woff2)",
        { weight: "500" }
      ),
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1y9osUZiZQ.woff2)",
        { weight: "600" }
      ),
      new FontFace(
        "Oswald",
        "url(https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1xZosUZiZQ.woff2)",
        { weight: "700" }
      ),
    ];

    Promise.all([bebasNeue.load(), ...oswaldFonts.map((font) => font.load())])
      .then((fonts) => {
        fonts.forEach((font) => document.fonts.add(font));
        this.setState({ fontsLoaded: true });
      })
      .catch((err) => {
        console.error("Failed to load fonts:", err);
        this.setState({ fontsLoaded: true });
      });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }

    return this.props.children;
  }
}
