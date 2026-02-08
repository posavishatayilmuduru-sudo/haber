<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$feedUrl = $_GET['url'] ?? '';

if (empty($feedUrl)) {
    echo json_encode(['error' => 'URL parameter required']);
    exit;
}

// Fetch RSS
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $feedUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
$xml = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$xml) {
    echo json_encode(['error' => 'Failed to fetch RSS']);
    exit;
}

// Parse RSS
$rss = simplexml_load_string($xml);
if (!$rss) {
    echo json_encode(['error' => 'Invalid RSS']);
    exit;
}

$items = [];
foreach ($rss->channel->item as $item) {
    $description = (string)$item->description;
    
    // Extract image
    $image = null;
    if ($item->enclosure && $item->enclosure['type'] && strpos($item->enclosure['type'], 'image') !== false) {
        $image = (string)$item->enclosure['url'];
    } elseif (preg_match('/<img[^>]+src=["\'](https?:\/\/[^"\']+)["\']/i', $description, $matches)) {
        $image = $matches[1];
    }
    
    // Clean description
    $description = strip_tags($description);
    $description = substr($description, 0, 200);
    
    $items[] = [
        'title' => (string)$item->title,
        'link' => (string)$item->link,
        'description' => $description,
        'pubDate' => (string)$item->pubDate,
        'image' => $image
    ];
}

echo json_encode(['items' => $items]);
