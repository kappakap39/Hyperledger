# การสร้าง compose เพื่อใช้ในการสร้างฐานข้อมูลจำลอง

## ขั้นตอนการสร้างโฟลเดอร์และไฟล์ที่จำเป็น

1. สร้างโฟลเดอร์ใหม่ชื่ออะไรก็ได้และสร้างไฟล์ต่าง ๆ ดังนี้:

    - **app.py**: มีข้อมูลในไฟล์ดังนี้:
    ```python
    import time

    import redis
    from flask import Flask

    app = Flask(__name__)
    cache = redis.Redis(host='redis', port=6379)

    def get_hit_count():
        retries = 5
        while True:
            try:
                return cache.incr('hits')
            except redis.exceptions.ConnectionError as exc:
                if retries == 0:
                    raise exc
                retries -= 1
                time.sleep(0.5)

    @app.route('/')
    def hello():
        count = get_hit_count()
        return 'Hello World! I have been seen {} times.\n'.format(count)
    ```

    - **compose.yaml**: มีข้อมูลในไฟล์ดังนี้:
    ```yaml
    include:
      - infra.yaml
    services:
      web:
        build: .
        ports:
          - "8000:5000"
        develop:
          watch:
            - action: sync
              path: .
              target: /code
      redis:
        image: "redis:alpine"
      
      postgres:
        image: postgres:15
        restart: always
        environment:
          POSTGRES_DB: db_test
          POSTGRES_USER: admin
          POSTGRES_PASSWORD: password
        ports:
          - "5432:5432"
        volumes:
          - postgres_data:/var/lib/postgresql/data
    volumes:
      postgres_data:
    ```

    - **Dockerfile**: มีข้อมูลในไฟล์ดังนี้:
    ```Dockerfile
    # syntax=docker/dockerfile:1
    FROM python:3.10-alpine
    WORKDIR /code
    ENV FLASK_APP=app.py
    ENV FLASK_RUN_HOST=0.0.0.0
    RUN apk add --no-cache gcc musl-dev linux-headers
    COPY requirements.txt requirements.txt
    RUN pip install -r requirements.txt
    EXPOSE 5000
    COPY . .
    CMD ["flask", "run", "--debug"]
    ```

    - **infra.yaml**: มีข้อมูลในไฟล์ดังนี้:
    ```yaml
    services:
      redis:
        image: "redis:alpine"
    ```

    - **requirements.txt**: มีข้อมูลในไฟล์ดังนี้:
    ```
    flask
    redis
    ```

## การใช้งานคำสั่ง Docker Compose

- **`docker compose up`**: สร้างและเริ่มต้นบริการตามที่กำหนดในไฟล์ `compose.yaml`.
- **`docker image ls`**: แสดงรายการ Docker images ทั้งหมดในระบบ.
- **`docker compose watch`** หรือ **`docker compose up --watch`**: ติดตามไฟล์และดำเนินการอัปเดตเมื่อมีการเปลี่ยนแปลง.
- **`docker compose up -d`**: รันบริการในโหมด background (detached mode).
- **`docker compose ps`**: แสดงรายการบริการที่กำลังรันอยู่.

หลังจากทำขั้นตอนเหล่านี้ให้ลองไปที่โปรแกรม Docker เพื่อดูบริการที่กำลังรันอยู่และตรวจสอบผลลัพธ์ตามที่คาดหวัง

## ข้อสำคัญ
- ก่อนเริ่มกระบวนการนี้ ต้องติดตั้ง Docker ให้เรียบร้อยก่อน
- หรือจะดูในเว็บ => https://docs.docker.com/compose/gettingstarted/ แต่อาจไม่มีขั้นตอนคำสั่ง จาก compose.yml ครบ