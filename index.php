<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

  <title>WebPiano</title>
  <meta name="description" content="不需要安裝、隨時隨地都可以在任何裝置使用的簡易鍵盤樂器。">
  <meta name="keywords" content="piano app, keyboard, music, web application, web piano">
  <meta name="author" content="Yu-Chun Chang">

  <link rel="shortcut icon" href="assets/images/favicon.ico">
  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
  <meta name="apple-mobile-web-app-title" content="WebPiano">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="format-detection" content="telephone=no">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="WebPiano">
  <meta name="twitter:description" content="不需要安裝、隨時隨地都可以在任何裝置使用的簡易鍵盤樂器。">
  <meta name="twitter:image" content="http://app.boggy.tw/webpiano/assets/images/sns_share_img.jpg">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="WebPiano">
  <meta property="og:description" content="不需要安裝、隨時隨地都可以在任何裝置使用的簡易鍵盤樂器。">
  <meta property="og:url" content="http://app.boggy.tw/webpiano">
  <meta property="og:site_name" content="WebPiano">
  <meta property="og:image" content="http://app.boggy.tw/webpiano/assets/images/sns_share_img.jpg">
  
  <link rel="stylesheet" href="assets/css/common.css?v=<?= filemtime('assets/css/common.css'); ?>">
</head>
<body>
  <h1>Web Piano</h1>
  <div class="keyboard-container"><div class="keyboard"></div></div>
  <footer>
    <div class="copyright">Copyright © <?php echo date("Y"); ?> Boggy Jang. All rights reserved.</div>
  </footer>
  
  <script src="http://static.boggy.tw/vendor/jquery/jquery-3.1.1.min.js"></script>
  <script src="assets/js/common.js?v=<?= filemtime('assets/js/common.js'); ?>"></script>
</body>
</html>