# Web_ETU_labs

## Инструкция по запуску

**Важно:** Все команды необходимо выполнять из директории `2381_Bogatov_Ilya_3_src`.

Сначала перейдите в нужную директорию:
```bash
cd 2381_Bogatov_Ilya_3_src
```

1.  **Установите зависимости:**
    ```bash
    npm install
    ```

2.  **Сгенерируйте SSL сертификат и ключ:**

    Выполните следующие команды, чтобы создать файлы `server.key` и `server.crt`:

    ```bash
    # Шаг 1: Создаем приватный ключ и запрос на подписание сертификата (CSR)
    openssl req -newkey rsa:2048 -nodes -keyout server.key -out server.csr -subj "/C=US/ST=California/L=San Francisco/O=My Company/OU=IT/CN=localhost/emailAddress=test@test.com"

    # Шаг 2: Создаем самоподписанный сертификат из ключа и CSR
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

    # Шаг 3: Удаляем ненужный CSR
    rm server.csr
    ```

3.  **Добавьте сертификат и ключ в `.gitignore`:**
    Убедитесь, что файл `.gitignore` содержит следующие строки, чтобы не добавлять секретные ключи в репозиторий:
    ```
    server.key
    server.crt
    ```

4.  **Запустите приложение:**
    ```bash
    npm run dev
    ```

5.  Откройте в браузере `https://localhost:3000`