<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

if ($path === '/api/health') {
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'api_key_configured' => !empty($_ENV['GEMINI_API_KEY'] ?? 'AIzaSyBKtfSNNSKMc_p7kUV--ErX28kky78VGoY')
    ]);
} elseif ($path === '/api/generate' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['prompt'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Prompt is required']);
        exit();
    }
    
    // Call Gemini API
    $apiKey = 'AIzaSyBKtfSNNSKMc_p7kUV--ErX28kky78VGoY';
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;
    
    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $input['prompt']]
                ]
            ]
        ]
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        echo json_encode([
            'success' => false,
            'error' => 'API request failed: ' . $response
        ]);
        exit();
    }
    
    $result = json_decode($response, true);
    $geminiResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'No response generated';
    
    echo json_encode([
        'success' => true,
        'data' => $geminiResponse
    ]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
