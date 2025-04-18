sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: POST /login (username, password)
    Server->>Database: Tìm user theo username
    Database-->>Server: Trả về user
    Server->>Server: Xác thực mật khẩu
    Server->>Server: Tạo JWT với role và permissions
    Server-->>Client: Trả về accessToken