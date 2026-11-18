/*
 * VIDEO 19.11 — CẤU HÌNH TẬP TRUNG
 * Video hiện tại là BẢN DEMO. Khi có clip chính thức, chỉ cần thay src,
 * poster (nếu có), title và caption tại đây; không cần sửa HTML/CSS/JS.
 * Tỷ lệ khung hình được tự đọc từ metadata của MP4/WebM.
 */
window.MEMORY_VIDEO_CONFIG = Object.freeze({
  type: 'file',
  src: 'media/thuoc-phim-19-11.mp4',
  poster: 'media/poster-19-11.jpg',
  title: 'THƯỚC PHIM 19/11',
  caption: 'Bản demo · Có thể thay bằng MP4 chính thức',
  isDemo: true
});
