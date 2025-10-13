# Web_ETU_labs

## Инструкция по запуску

1.  **Установите зависимости:**
    ```bash
    npm install
    ```

2.  **Сгенерируйте SSL сертификат:**
    ```bash
    cd 2381_Bogatov_Ilya_3_src
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.csr -subj "/C=US/ST=California/L=San Francisco/O=My Company/OU=IT/CN=localhost/emailAddress=test@test.com"
    openssl x509 -req -in server.csr -signkey server.key -out server.crt
    rm server.csr
    cd ..
    ```

3.  **Добавьте сертификат и ключ в `.gitignore`:**
    Откройте файл `.gitignore` в директории `2381_Bogatov_Ilya_3_src` и добавьте следующие строки:
    ```
    server.key
    server.crt
    ```

4.  **Запустите приложение:**
    ```bash
    npm run dev
    ```

5.  Откройте в браузере `https://localhost:3000`