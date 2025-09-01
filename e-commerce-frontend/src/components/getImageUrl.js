import API_BASE from "../utils/API_BASE";

export default function getImageUrl(image) {
  if (!image) return '';
  if (/^https?:\/\//.test(image)) return image;
  let imgPath = image.replace(/^\/+/, '');
  imgPath = imgPath.replace(/^public[\\/]/, '');
  imgPath = imgPath.replace(/\\/g, '/');
  return `${API_BASE}/${imgPath}`;
}