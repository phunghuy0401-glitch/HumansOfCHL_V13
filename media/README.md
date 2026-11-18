# Thư mục media — 19.11 Chuyên Hạ Long

## Thay video demo bằng MP4 chính thức

Video đang được cấu hình là **bản demo**. Khi có clip chính thức, bạn không cần thiết kế lại trang hoặc sửa các tệp HTML/CSS/JavaScript.

1. Cách đơn giản nhất: đặt tên clip mới là `thuoc-phim-19-11.mp4` rồi thay tệp demo cùng tên trong `media/`.
2. Mở `media/video-config.js`, đổi `caption` thành nội dung chính thức và đổi `isDemo` thành `false`.
3. Nếu dùng tên tệp khác, sửa thêm `src`; nếu có poster mới, sửa `poster`.
4. Tải toàn bộ thư mục website lên GitHub Pages/hosting.

Ví dụ:

```js
window.MEMORY_VIDEO_CONFIG = Object.freeze({
  type: 'file',
  src: 'media/clip-19-11.mp4',
  poster: 'media/poster-19-11.jpg',
  title: 'THƯỚC PHIM 19/11',
  caption: 'Chuyên Hạ Long · 19.11.2026',
  isDemo: false
});
```

Website tự đọc kích thước khung hình khi video tải metadata, vì vậy hỗ trợ video ngang, dọc hoặc vuông mà không kéo méo hình. Không cố định thời lượng, độ phân giải hay tỷ lệ của clip demo. Trình phát dùng `preload="metadata"`, không tự phát khi khách vừa mở trang.

## Dùng công cụ thiết lập video

Mở website với `?media-admin=1`, chọn YouTube hoặc MP4/WebM, kiểm tra xem thử rồi tải `video-config.js`. Với MP4, bạn vẫn cần đặt tệp video thực tế vào `media/` và tải cùng website lên hosting. Trình duyệt không thể tự tải video lên GitHub Pages khi không có backend.

## Lưu ý tốc độ

- Ưu tiên MP4 mã hóa H.264 và âm thanh AAC để tương thích rộng.
- Dung lượng càng gọn, khách dùng 4G càng dễ xem; nên xuất bản hợp lý thay vì giữ một tệp quá lớn.
- Ảnh poster nên nén nhẹ (JPG/WebP).
