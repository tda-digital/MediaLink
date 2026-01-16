<?php
$id = $_GET['id'];
if (!$id) {
    die("Falta el ID del canal.");
}
$url = "https://www.youtube.com/channel/$id/live";
$response = file_get_contents($url);
if (preg_match('/hlsManifestUrl\\\\":\\\\"(https:[^" ]*?\.m3u8)/', $response, $matches)) {
    $m3u8 = str_replace('\\\\/', '/', $matches[1]);
    header("Location: $m3u8");
} else {
    echo "No se encontró transmisión en vivo.";
}
?>
