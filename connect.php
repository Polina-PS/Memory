<?php
$servername = "localhost";
$database = "cards";
$username = "root";
$password = "polina03112001";
// Создаем соединение
$conn = mysqli_connect($servername, $username, $password, $database);
 Проверяем соединение
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";
mysqli_close($conn);
?>