import colors, { Color } from './colors';

/* Function to generate an sprite with the given name and size.
   If no data is provided, an empty sprite is created*/
export function generateSprite(name: string, width: number, height: number, dataArray?: number[]) {
  const header = `\n# image\n${name}:byte[${width}*${height}] = [\n`;

  let data = '';
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      data += dataArray ? `${dataArray[i * width + j]},` : `0,`;
    }
    data += '\n';
  }
  data = data.slice(0, -2);

  const footer = `\n]\n`;

  const sprite = header + data + footer;

  return sprite;
}

const getDiffColor = (colorA: Color, colorIndex: number) => {
  return Math.sqrt(
    Math.pow(colorA[0] - colors[colorIndex][0], 2) +
      Math.pow(colorA[1] - colors[colorIndex][1], 2) +
      Math.pow(colorA[2] - colors[colorIndex][2], 2)
  );
};

/* This function returns the closest color in the colors table of a given RGB color */
export const getClosestColor = (color: Color) => {
  let colorCode = 0;
  let minDiff = -1;

  for (let i = 0; i < 255; i++) {
    if (minDiff == -1) {
      minDiff = getDiffColor(color, i);
      colorCode = i;
    } else if (getDiffColor(color, i) < minDiff) {
      minDiff = getDiffColor(color, i);
      colorCode = i;
    }
  }
  return colorCode;
};
