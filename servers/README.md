# Giới thiệu

Ứng dụng được viết dưới nền tảng [Node.js](https://nodejs.org/en/) và [ExpressJS](https://expressjs.), với sự hỗ trợ của [TypeScript](https://typescriptlang.org). Để chạy ứng dụng, yêu cầu tiên quyết cần có:

- [Node.js](https://nodejs.org/en/) và [npm](https://www.npmjs.com/) phiên bản 12 trở lên hoặc [Yarn](https://yarnpkg.com/).

# Hướng dẫn

## Cài đặt

Để chạy ứng dụng, trước hết hãy chắc chắn rằng bạn đã cài đặt Node.js và npm. Sau đó, sử dụng lệnh `npm install` để cài đặt các gói dependencies. Sau đó tạo file `.env` vào thư mục gốc của `./servers`.

```
|-- servers
    |-- .env
```

Có thể tham khảo `.default.env` để thiết lập file `.env` cho ứng dụng. Xem tiếp phần môi trường

## Môi trường

Mặc định, tệp môi trường là tệp `.env` trong thư mục gốc của ứng dụng (`./servers`). Ứng dụng server sử dụng môi trường này để thiết lập các thông số cần thiết cho ứng dụng. Tệp `.env` được đọc thông qua [dotenv](https://www.npmjs.com/package/dotenv).

Tệp môi trường mặc định sẽ như sau:

```env
# Bcrypt salt length
USER_PASSWORD_SALT_ROUNDING = 12

# The host to display a path prefix.
# Example: http://localhost, http://google.com
PATH_PREFIX =


# A JWT token secret
# Default:
JWT_SECRET = ''

# Expiration time of a JWT token
JWT_EXPIRATION_TIME = '1h'

# -------- mysql configuration ----------
# For production
MYSQL_HOST = 'localhost'
MYSQL_PORT = '3306'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DATABASE = 'comics_paper'

# For dev
MYSQL_DEV_HOST = 'localhost'
MYSQL_DEV_PORT = '3306'
MYSQL_DEV_USER = 'root'
MYSQL_DEV_PASSWORD = ''
MYSQL_DEV_DATABASE = 'comics_paper'

# For test
MYSQL_TEST_HOST = 'localhost'
MYSQL_TEST_PORT = '3306'
MYSQL_TEST_USER = 'root'
MYSQL_TEST_PASSWORD = ''
MYSQL_TEST_DATABASE = 'comics_paper_test'
MYSQL_TEST_ENABLE_LOGGING = false

```

Ngoài ra, khi chạy bạn có thể chỉnh các thông số môi trường truyền vào trong file `package.json` của ứng dụng.

## Thông số

Các biến môi trường có thể cần thiết cho bạn

- `PORT`: Port mặc định của ứng dụng.
- `NODE_ENV`: Môi trường ứng dụng. Ứng dụng có có 3 môi trường: `development`, `production` và `test`. Nếu bạn khai báo môi trường khác, hãy chắc chắn rằng bạn nhìn vào file `./src/v1/Configuration.ts` để config môi trường.

## Thực thi

Sử dụng các lệnh sau đây để chay ứng dụng, thay thế `npm` thành `yarn` nếu bạn sử dụng [yarn](https//yarnpkg.com/):

- `npm run dev`: chạy ứng dụng với thông số của nhà phát triển trên localhost:3000.
- `npm test`: thực thi test unit và integration.
- `npm run build`: dùng để xây dựng ứng dụng. Vì ứng dụng xây dựng thông qua [TypeScript](https://www.typescriptlang.org/). Ứng dụng sau khi build sẽ nằm ở `./dist/`.

## Tải lên

Mục tải lên cơ bản sẽ nằm ở `./tmp/uploads`. Bạn có thể thay thế cho nó bằng thư mục khác nếu bạn muốn thông qua tệp `.env` ở mục `OUTPUT_DIR`. Hãy chắc chắn rằng bạn có quyền ghi vào thư mục này và đủ dung lượng lưu trữ.

# Hệ thống

## Sơ đồ quan hệ dữ liệu

https://dbdiagram.io/d/612dda98825b5b0146ec23a4
