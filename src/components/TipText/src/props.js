const componentSizes = ["", "default", "small", "large"];
const componentRenders = ["span", "div"];

export default {
  size: {
    type: String,
    values: componentSizes,
    default: "",
  },
  render: {
    type: String,
    values: componentRenders,
    default: "div",
  },
};
