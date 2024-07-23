<?php

include 'connect.php';

// Выполнение запроса к базе данных
$sql = "SELECT * FROM `card`";
$result = $conn->query($sql);

// Получение данных из базы данных и формирование массива
$cards = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
      $cards[] = array(
      	'id' => $row['id'],
      	'name' => $row['name'],
      	'point' => $row['point'],
      	'img' => $row['img']
    );
  }
}

// Закрытие соединения с базой данных
$conn->close();

// Возвращение данных в формате JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($cards, JSON_UNESCAPED_UNICODE);
?>