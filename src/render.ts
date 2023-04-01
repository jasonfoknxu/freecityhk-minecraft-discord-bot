// Reference: https://github.com/crafatar/crafatar/

import * as cvs from 'canvas';

const removeOpacity = (canvas: cvs.Canvas) => {
  let ctx = canvas.getContext('2d');
  let imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imagedata.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = 255;
  }
  ctx.putImageData(imagedata, 0, 0);
  return canvas;
};

const containsOpacity = (canvas: cvs.Canvas) => {
  let ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] < 255) {
      return true;
    }
  }
  return false;
};

const resize = (src: cvs.Canvas, scale: number) => {
  let dst = cvs.createCanvas(scale * src.width, scale * src.height);
  let context = dst.getContext('2d');
  context.patternQuality = 'fast';
  context.drawImage(src, 0, 0, src.width * scale, src.height * scale);
  return dst;
};

function getPart(src: cvs.Image, x: number, y: number, width: number, height: number, scale: number) {
  let dst = cvs.createCanvas(scale * width, scale * height);
  let context = dst.getContext('2d');
  context.patternQuality = 'fast';
  context.drawImage(src, x, y, width, height, 0, 0, width * scale, height * scale);
  return dst;
}

function flip(src: cvs.Canvas) {
  let dst = cvs.createCanvas(src.width, src.height);
  let context = dst.getContext('2d');
  context.scale(-1, 1);
  context.drawImage(src, -src.width, 0);
  return dst;
}

const skewA = 26 / 45; // 0.57777777
const skewB = skewA * 2; // 1.15555555

const render = async (
  img: string,
  scale: number = 6,
  overlay: boolean = true,
  renderBody: boolean = true,
  slim: boolean = false
) => {
  let canvas = cvs.createCanvas(scale * 20, scale * (renderBody ? 45.1 : 18.5));
  let ctx = canvas.getContext('2d');
  const skin = await cvs.loadImage(img);
  let oldSkin = skin.height === 32;
  let armWidth = slim ? 3 : 4;

  let headTop = resize(removeOpacity(getPart(skin, 8, 0, 8, 8, 1)), scale);
  let headFront = resize(removeOpacity(getPart(skin, 8, 8, 8, 8, 1)), scale);
  let headRight = resize(removeOpacity(getPart(skin, 0, 8, 8, 8, 1)), scale);

  let armRightTop = resize(removeOpacity(getPart(skin, 44, 16, armWidth, 4, 1)), scale);
  let armRightFront = resize(removeOpacity(getPart(skin, 44, 20, armWidth, 12, 1)), scale);
  let armRightSide = resize(removeOpacity(getPart(skin, 40, 20, 4, 12, 1)), scale);

  let armLeftTop = oldSkin ? flip(armRightTop) : resize(removeOpacity(getPart(skin, 36, 48, armWidth, 4, 1)), scale);
  let armLeftFront = oldSkin
    ? flip(armRightFront)
    : resize(removeOpacity(getPart(skin, 36, 52, armWidth, 12, 1)), scale);

  let legRightFront = resize(removeOpacity(getPart(skin, 4, 20, 4, 12, 1)), scale);
  let legRightSide = resize(removeOpacity(getPart(skin, 0, 20, 4, 12, 1)), scale);

  let legLeftFront = oldSkin ? flip(legRightFront) : resize(removeOpacity(getPart(skin, 20, 52, 4, 12, 1)), scale);

  let bodyFront = resize(removeOpacity(getPart(skin, 20, 20, 8, 12, 1)), scale);

  if (overlay) {
    if (containsOpacity(getPart(skin, 32, 0, 32, 32, 1))) {
      // render head overlay
      headTop.getContext('2d').drawImage(getPart(skin, 40, 0, 8, 8, scale), 0, 0);
      headFront.getContext('2d').drawImage(getPart(skin, 40, 8, 8, 8, scale), 0, 0);
      headRight.getContext('2d').drawImage(getPart(skin, 32, 8, 8, 8, scale), 0, 0);
    }

    if (!oldSkin) {
      let bodyArea = getPart(skin, 16, 32, 32, 16, 1);
      let rightArm = getPart(skin, 48, 48, 16, 16, 1);
      let leftArm = getPart(skin, 40, 32, 16, 16, 1);
      let rightLeg = getPart(skin, 0, 32, 16, 16, 1);
      let leftLeg = getPart(skin, 0, 48, 16, 16, 1);

      if (containsOpacity(bodyArea)) {
        // render body overlay
        bodyFront.getContext('2d').drawImage(getPart(skin, 20, 36, 8, 12, scale), 0, 0);
      }

      if (containsOpacity(rightArm)) {
        // render right arm overlay
        armRightTop.getContext('2d').drawImage(getPart(skin, 44, 32, armWidth, 4, scale), 0, 0);
        armRightFront.getContext('2d').drawImage(getPart(skin, 44, 36, armWidth, 12, scale), 0, 0);
        armRightSide.getContext('2d').drawImage(getPart(skin, 40, 36, 4, 12, scale), 0, 0);
      }

      if (containsOpacity(leftArm)) {
        // render left arm overlay
        armLeftTop.getContext('2d').drawImage(getPart(skin, 36 + 16, 48, armWidth, 4, scale), 0, 0);
        armLeftFront.getContext('2d').drawImage(getPart(skin, 36 + 16, 52, armWidth, 12, scale), 0, 0);
      }

      if (containsOpacity(rightLeg)) {
        // render right leg overlay
        legRightFront.getContext('2d').drawImage(getPart(skin, 4, 36, 4, 12, scale), 0, 0);
        legRightSide.getContext('2d').drawImage(getPart(skin, 0, 36, 4, 12, scale), 0, 0);
      }

      if (containsOpacity(leftLeg)) {
        // render left leg overlay
        legLeftFront.getContext('2d').drawImage(getPart(skin, 4, 52, 4, 12, scale), 0, 0);
      }
    }
  }

  let x = 0;
  let y = 0;
  let z = 0;

  let zOffset = scale * 3;
  let xOffset = scale * 2;

  if (renderBody) {
    // pre-render front onto separate canvas
    let front = cvs.createCanvas(scale * 16, scale * 24);
    let frontCtx = front.getContext('2d');
    frontCtx.patternQuality = 'fast';

    frontCtx.drawImage(armRightFront, (4 - armWidth) * scale, 0 * scale, armWidth * scale, 12 * scale);
    frontCtx.drawImage(armLeftFront, 12 * scale, 0 * scale, armWidth * scale, 12 * scale);
    frontCtx.drawImage(bodyFront, 4 * scale, 0 * scale, 8 * scale, 12 * scale);
    frontCtx.drawImage(legRightFront, 4 * scale, 12 * scale, 4 * scale, 12 * scale);
    frontCtx.drawImage(legLeftFront, 8 * scale, 12 * scale, 4 * scale, 12 * scale);

    // top
    x = xOffset + scale * 2;
    y = scale * -armWidth;
    z = zOffset + scale * 8;
    ctx.setTransform(new cvs.DOMMatrix([1, -skewA, 1, skewA, 0, 0]));
    ctx.drawImage(armRightTop, y - z - 0.5, x + z, armRightTop.width + 1, armRightTop.height + 1);

    y = scale * 8;
    ctx.drawImage(armLeftTop, y - z, x + z, armLeftTop.width, armLeftTop.height + 1);

    // right side
    ctx.setTransform(new cvs.DOMMatrix([1, skewA, 0, skewB, 0, 0]));
    x = xOffset + scale * 2;
    y = 0;
    z = zOffset + scale * 20;
    ctx.drawImage(legRightSide, x + y, z - y, legRightSide.width, legRightSide.height);

    x = xOffset + scale * 2;
    y = scale * -armWidth;
    z = zOffset + scale * 8;
    ctx.drawImage(armRightSide, x + y, z - y - 0.5, armRightSide.width, armRightSide.height + 1);

    // front
    z = zOffset + scale * 12;
    y = 0;
    ctx.setTransform(new cvs.DOMMatrix([1, -skewA, 0, skewB, 0, skewA]));
    ctx.drawImage(front, y + x, x + z - 0.5, front.width, front.height);
  }

  // head top
  x = xOffset;
  y = -0.5;
  z = zOffset;
  ctx.setTransform(new cvs.DOMMatrix([1, -skewA, 1, skewA, 0, 0]));
  ctx.drawImage(headTop, y - z, x + z, headTop.width, headTop.height + 1);

  // head front
  x = xOffset + 8 * scale;
  y = 0;
  z = zOffset - 0.5;
  ctx.setTransform(new cvs.DOMMatrix([1, -skewA, 0, skewB, 0, skewA]));
  ctx.drawImage(headFront, y + x, x + z, headFront.width, headFront.height);

  // head right
  x = xOffset;
  y = 0;
  z = zOffset;
  ctx.setTransform(new cvs.DOMMatrix([1, skewA, 0, skewB, 0, 0]));
  ctx.drawImage(headRight, x + y, z - y - 0.5, headRight.width + 0.5, headRight.height + 1);

  return canvas.toBuffer();
};

export { render };
