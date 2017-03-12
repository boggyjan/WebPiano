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
  <meta name="google" value="notranslate">

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
  <h1>WebPiano</h1>
  <div class="effect-container">
    <div>
      Attack
      <div class="control">
        <input data-min="0" data-max="20" value="0.01" class="attack">
      </div>
    </div>
    <div>
      Start Value
      <div class="control">
        <input data-min="0" data-max="2" value="0" class="startValue">
      </div>
    </div>
    <div>
      Decay
      <div class="control">
        <input data-min="0" data-max="100" value="50" class="decay">
      </div>
    </div>
    <div>
      Sustain
      <div class="control">
        <input data-min="0" data-max="2" value="0" class="sustain">
      </div>
    </div>
    <div>
      Release
      <div class="control">
        <input data-min="0" data-max="10" value="1" class="release">
      </div>
    </div>
    <div>
      End Value
      <div class="control">
        <input data-min="0" data-max="2" value="0" class="endValue">
      </div>
    </div>
    <div>
      tone
      <div class="control">
        <select class="tone-type">
          <option value="sine">sine</option>
          <option value="square"> square</option>
          <option value="sawtooth"> sawtooth</option>
          <option value="triangle"> triangle</option>
          <!--<option value="custom"> custom</option>--><!--OscillatorNode.setPeriodicWave()-->
        </select>
      </div>
    </div>
  </div>
  <div class="keyboard-container"><div class="keyboard"></div></div>

  <footer>
    <div class="copyright">Copyright © <?php echo date("Y"); ?> Boggy Jang. All rights reserved.</div>
  </footer>
  
  <script src="http://static.boggy.tw/vendor/jquery/jquery-3.1.1.min.js"></script>
  <script src="http://static.boggy.tw/vendor/jQuery-Knob/1.2.12/jquery.knob.min.js"></script>

  <script src="assets/js/common.js?v=<?= filemtime('assets/js/common.js'); ?>"></script>
</body>
</html>
