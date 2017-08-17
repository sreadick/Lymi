export const getNextColor = (currentColor) => {
  // const colorsArray = ['#9FD69F', '#9FD6D6', '#B77979', '#79B679', '#9F9FD6', '#D69FD6', '79B779', '#D69F9F', '#D6D69F', '#79B679', '#9FBAD6', '#BA9FD6', '#D69FBA', '#D6BA9F'];
  const colorsArray = ['#E57373', '#5C6BC0', '#4DB6AC', '#BA68C8', '#D4E157', '#69F0AE', '#FF5722', '#795548', '#607D8B', '#FF8A80', '#8C9EFF', '#009688', '#7CB342', '#FFEB3B', '#00BCD4', '#5E35B1', '#3949AB', '#D50000', '#80CBC4', '#880E4F', '#2196F3', '#9E9D24', '#558B2F'];
  let currentIndex = colorsArray.indexOf(currentColor);

  if (currentIndex === colorsArray.length - 1) {
    return colorsArray[0];
  }
  return colorsArray[currentIndex + 1];
}
